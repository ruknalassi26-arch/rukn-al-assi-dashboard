// ==============================================================================
// features/authentication/data/repositories/supabase-auth.repository.ts
// Supabase Authentication Repository Implementation
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

  private async logActivity(
    action: "login" | "logout" | "created" | "updated" | "deleted",
    userId: string,
    userEmail: string,
    metadata?: Record<string, unknown>
  ) {
    try {
      await this.supabase.from("activity_logs").insert({
        action,
        entity_type: "auth",
        entity_id: userId,
        entity_title: `Authentication: ${action}`,
        user_id: userId,
        user_email: userEmail,
        metadata: metadata ?? null,
      });
    } catch {
      // Non-blocking log insertion
    }
  }

  async signIn(input: SignInInput): Promise<UserProfileEntity> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.user) {
      throw new Error(error?.message || "Invalid email or password");
    }

    // Fetch user profile from admin_profiles
    const { data: profile } = await this.supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    // Update last_login_at
    try {
      await this.supabase
        .from("admin_profiles")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", data.user.id);
    } catch {
      // Non-blocking
    }

    const userEntity = toUserProfileEntity({
      user: data.user,
      profile: profile as AdminProfileDTO | null,
    });

    await this.logActivity("login", data.user.id, data.user.email ?? input.email, {
      rememberMe: input.rememberMe,
    });

    return userEntity;
  }

  async signOut(): Promise<void> {
    const { data: userData } = await this.supabase.auth.getUser();
    if (userData?.user) {
      await this.logActivity("logout", userData.user.id, userData.user.email ?? "");
    }
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(): Promise<UserProfileEntity | null> {
    const { data: userData, error } = await this.supabase.auth.getUser();
    if (error || !userData.user) return null;

    const { data: profile } = await this.supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", userData.user.id)
      .maybeSingle();

    return toUserProfileEntity({
      user: userData.user,
      profile: profile as AdminProfileDTO | null,
    });
  }

  async sendPasswordResetEmail(input: SendPasswordResetInput): Promise<void> {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUrl = input.redirectUrl || `${origin}/admin/reset-password`;

    const { error } = await this.supabase.auth.resetPasswordForEmail(input.email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      throw new Error(error.message || "Failed to send password reset link");
    }
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: input.newPassword,
    });

    if (error) {
      throw new Error(error.message || "Failed to reset password");
    }
  }

  async changePassword(input: ChangePasswordInput): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: input.newPassword,
    });

    if (error) {
      throw new Error(error.message || "Failed to update password");
    }
  }
}
