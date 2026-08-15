// ==============================================================================
// features/authentication/data/repositories/supabase-auth.repository.ts
// Supabase Authentication Repository Implementation using public.get_current_admin_user_profile() RPC
// Clean Architecture & 100% Type-Safe TypeScript — ZERO 'any' & ZERO duplicate requests
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type {
  IAuthRepository,
  SignInInput,
  SendPasswordResetInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from "../../domain/repositories/i-auth.repository";
import { UserProfileEntity } from "../../domain/entities/user-profile.entity";
import { mapAdminUserProfileDtoToEntity } from "../mapper/auth.mapper";
import type { GetCurrentAdminUserProfileDto } from "../dto/auth.dto";

interface SupabaseRPCClient {
  rpc: (
    functionName: "get_current_admin_user_profile"
  ) => Promise<{ data: GetCurrentAdminUserProfileDto | null; error: { message: string } | null }>;
}

// Module-level global cache shared across all instantiated SupabaseAuthRepository objects
let globalCachedUserEntity: UserProfileEntity | null = null;
let globalCacheTimestamp = 0;
let globalCurrentUserPromise: Promise<UserProfileEntity | null> | null = null;

export function clearUserAuthCache(): void {
  globalCachedUserEntity = null;
  globalCacheTimestamp = 0;
  globalCurrentUserPromise = null;
}

export class SupabaseAuthRepository implements IAuthRepository {
  private get supabase() {
    return createClient();
  }

  private async logActivity(
    action: "login" | "logout" | "created" | "updated" | "deleted",
    userId: string,
    userEmail: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      await this.supabase.from("activity_log").insert({
        action,
        entity_type: "auth",
        entity_id: userId || null,
        details: { entity_title: `Authentication: ${action}`, user_email: userEmail, ...metadata },
        admin_user_id: userId || null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  /**
   * Calls ONLY public.get_current_admin_user_profile() RPC with NO parameters (uses auth.uid()).
   */
  private async fetchFullUserProfile(user: User): Promise<UserProfileEntity | null> {
    try {
      const rpcClient = this.supabase as unknown as SupabaseRPCClient;
      const { data: rpcData, error: rpcError } = await rpcClient.rpc("get_current_admin_user_profile");

      if (rpcError) {
        throw new Error(rpcError.message || "Failed to fetch get_current_admin_user_profile RPC");
      }

      if (rpcData && typeof rpcData === "object") {
        const dto = rpcData as GetCurrentAdminUserProfileDto;
        if (!dto.profile || Object.keys(dto.profile).length === 0) {
          return null;
        }

        if (dto.profile.is_active === false) {
          await this.supabase.auth.signOut();
          clearUserAuthCache();
          throw new Error("Your administrative account has been deactivated. Access denied.");
        }

        return mapAdminUserProfileDtoToEntity(user, dto);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("deactivated")) throw err;
      throw err;
    }

    return null;
  }

  async signIn(input: SignInInput): Promise<UserProfileEntity> {
    try {
      // Reset cache before signing in
      clearUserAuthCache();

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error || !data.user) {
        throw new Error(error?.message || "Invalid email or password");
      }

      // Update last login timestamp in background
      try {
        await this.supabase
          .from("admin_profiles")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", data.user.id);
      } catch {
        // Non-blocking
      }

      // Fetch full profile, role, and permissions via get_current_admin_user_profile RPC
      const userEntity = await this.getCurrentUser();
      if (!userEntity) {
        await this.supabase.auth.signOut();
        throw new Error("Admin profile not found or user account is not active.");
      }

      await this.logActivity("login", data.user.id, data.user.email ?? input.email, {
        rememberMe: input.rememberMe,
      });

      return userEntity;
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      if (errorObj.name === "TypeError" || errorObj.message === "Failed to fetch" || errorObj.message.includes("fetch")) {
        throw new Error("Unable to reach authentication server. Please check your internet connection or Supabase configuration.");
      }
      throw errorObj;
    }
  }

  async signOut(): Promise<void> {
    clearUserAuthCache();
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      if (userData?.user) {
        await this.logActivity("logout", userData.user.id, userData.user.email ?? "");
      }
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      if (errorObj.name === "TypeError" || errorObj.message === "Failed to fetch") {
        return;
      }
      throw errorObj;
    }
  }

  async getCurrentUser(): Promise<UserProfileEntity | null> {
    const now = Date.now();
    // Return module-level cached user if within 15 seconds TTL
    if (globalCachedUserEntity && (now - globalCacheTimestamp) < 15000) {
      return globalCachedUserEntity;
    }

    if (globalCurrentUserPromise) {
      return globalCurrentUserPromise;
    }

    globalCurrentUserPromise = (async () => {
      try {
        const { data: userData, error: userError } = await this.supabase.auth.getUser();
        if (userError || !userData.user) {
          clearUserAuthCache();
          return null;
        }

        const entity = await this.fetchFullUserProfile(userData.user);

        if (entity) {
          globalCachedUserEntity = entity;
          globalCacheTimestamp = Date.now();
        }
        return entity;
      } catch {
        return null;
      } finally {
        setTimeout(() => {
          globalCurrentUserPromise = null;
        }, 1000);
      }
    })();

    return globalCurrentUserPromise;
  }

  async sendPasswordResetEmail(input: SendPasswordResetInput): Promise<void> {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const redirectUrl = input.redirectUrl || `${origin}/admin/reset-password`;

      const { error } = await this.supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        throw new Error(error.message || "Failed to send password reset link");
      }
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      if (errorObj.name === "TypeError" || errorObj.message === "Failed to fetch") {
        throw new Error("Unable to reach authentication server. Please check your internet connection.");
      }
      throw errorObj;
    }
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: input.newPassword,
      });

      if (error) {
        throw new Error(error.message || "Failed to reset password");
      }
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      if (errorObj.name === "TypeError" || errorObj.message === "Failed to fetch") {
        throw new Error("Unable to reach authentication server. Please check your internet connection.");
      }
      throw errorObj;
    }
  }

  async changePassword(input: ChangePasswordInput): Promise<void> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: input.newPassword,
      });

      if (error) {
        throw new Error(error.message || "Failed to update password");
      }
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      if (errorObj.name === "TypeError" || errorObj.message === "Failed to fetch") {
        throw new Error("Unable to reach authentication server. Please check your internet connection.");
      }
      throw errorObj;
    }
  }
}
