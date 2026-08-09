// ==============================================================================
// features/authentication/data/repositories/supabase-auth.repository.ts
// Supabase Authentication Repository Implementation with Safe Foreign Key Checks
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IAuthRepository,
  SignInInput,
  SendPasswordResetInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from "../../domain/repositories/i-auth.repository";
import { UserProfileEntity } from "../../domain/entities/user-profile.entity";
import { toUserProfileEntity } from "../mapper/auth.mapper";
import type { AdminProfileDTO } from "../dto/auth.dto";

export class SupabaseAuthRepository implements IAuthRepository {
  private get supabase() {
    return createClient();
  }

  private async getValidAdminId(userId: string | null | undefined): Promise<string | null> {
    if (!userId) return null;
    try {
      const { data } = await (this.supabase.from("admin_profiles" as any) as any)
        .select("id")
        .eq("id", userId)
        .maybeSingle();
      return data?.id ?? null;
    } catch {
      return null;
    }
  }

  private async logActivity(
    action: "login" | "logout" | "created" | "updated" | "deleted",
    userId: string,
    userEmail: string,
    metadata?: Record<string, unknown>
  ) {
    try {
      const validAdminId = await this.getValidAdminId(userId);
      await (this.supabase.from("activity_log" as any) as any).insert({
        action,
        entity_type: "auth",
        entity_id: userId || null,
        details: { entity_title: `Authentication: ${action}`, user_email: userEmail, ...metadata },
        admin_user_id: validAdminId,
      });
    } catch {
      // Non-blocking log insertion
    }
  }

  async signIn(input: SignInInput): Promise<UserProfileEntity> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error || !data.user) {
        throw new Error(error?.message || "Invalid email or password");
      }

      let profile: AdminProfileDTO | null = null;
      try {
        const { data: profileData } = await (this.supabase as any)
          .from("admin_profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileData) {
          profile = profileData as AdminProfileDTO;
        }
      } catch {
        // Fallback
      }

      try {
        await (this.supabase as any)
          .from("admin_profiles")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", data.user.id);
      } catch {
        // Non-blocking
      }

      const userEntity = toUserProfileEntity({
        user: data.user,
        profile,
      });

      await this.logActivity("login", data.user.id, data.user.email ?? input.email, {
        rememberMe: input.rememberMe,
      });

      return userEntity;
    } catch (err: any) {
      if (err.name === "TypeError" || err.message === "Failed to fetch" || err.message?.includes("fetch")) {
        throw new Error("Unable to reach authentication server. Please check your internet connection or Supabase configuration.");
      }
      throw err;
    }
  }

  async signOut(): Promise<void> {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      if (userData?.user) {
        await this.logActivity("logout", userData.user.id, userData.user.email ?? "");
      }
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      if (err.name === "TypeError" || err.message === "Failed to fetch") {
        return;
      }
      throw err;
    }
  }

  async getCurrentUser(): Promise<UserProfileEntity | null> {
    try {
      const { data: userData, error: userError } = await this.supabase.auth.getUser();
      if (userError || !userData.user) return null;

      let profile: AdminProfileDTO | null = null;
      try {
        const { data: profileData } = await (this.supabase as any)
          .from("admin_profiles")
          .select("*")
          .eq("id", userData.user.id)
          .maybeSingle();

        if (profileData) {
          profile = profileData as AdminProfileDTO;
        }
      } catch {
        // Fallback
      }

      return toUserProfileEntity({
        user: userData.user,
        profile,
      });
    } catch {
      return null;
    }
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
    } catch (err: any) {
      if (err.name === "TypeError" || err.message === "Failed to fetch") {
        throw new Error("Unable to reach authentication server. Please check your internet connection.");
      }
      throw err;
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
    } catch (err: any) {
      if (err.name === "TypeError" || err.message === "Failed to fetch") {
        throw new Error("Unable to reach authentication server. Please check your internet connection.");
      }
      throw err;
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
    } catch (err: any) {
      if (err.name === "TypeError" || err.message === "Failed to fetch") {
        throw new Error("Unable to reach authentication server. Please check your internet connection.");
      }
      throw err;
    }
  }
}
