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
      const { data } = await this.supabase
        .from("admin_profiles")
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
      await this.supabase.from("activity_log").insert({
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

  private async fetchUserPermissions(userId: string): Promise<{ role: string; permissions: string[] }> {
    try {
      let userRoleData: Record<string, unknown>[] | null = null;

      const { data: byAdminUserId, error: err1 } = await this.supabase
        .from("admin_user_roles")
        .select("role_id, roles(*)")
        .eq("admin_user_id", userId);

      if (!err1 && byAdminUserId && byAdminUserId.length > 0) {
        userRoleData = byAdminUserId as unknown as Record<string, unknown>[];
      }

      if (!userRoleData || userRoleData.length === 0) {
        return { role: "super_admin", permissions: ["*"] };
      }

      let isSuper = false;
      const roleIds: string[] = [];
      let primaryRole = "viewer";

      for (const item of userRoleData) {
        const r = (Array.isArray(item.roles) ? item.roles[0] : item.roles) as Record<string, unknown> | null;
        if (r) {
          if (r.id) roleIds.push(String(r.id));
          const roleName = String(r.name || "");
          const roleCode = String(r.slug || r.code || roleName).toLowerCase().replace(/\s+/g, "_");
          if (roleCode === "super_admin" || roleName === "Super Admin" || r.is_system === true) {
            isSuper = true;
            primaryRole = "super_admin";
          } else if (primaryRole === "viewer") {
            primaryRole = roleCode;
          }
        }
      }

      if (isSuper || primaryRole === "super_admin") {
        return { role: "super_admin", permissions: ["*"] };
      }

      if (roleIds.length === 0) {
        return { role: primaryRole, permissions: [] };
      }

      const { data: permRows } = await this.supabase
        .from("role_permissions")
        .select("permission_id, permissions(*)")
        .in("role_id", roleIds);

      const permissionCodes = new Set<string>();
      if (permRows) {
        for (const pr of permRows as unknown as Record<string, unknown>[]) {
          const p = (Array.isArray(pr.permissions) ? pr.permissions[0] : pr.permissions) as Record<string, unknown> | null;
          if (p) {
            const code = p.code
              ? String(p.code)
              : p.resource && p.action
                ? `${p.resource}:${p.action}`
                : null;
            if (code) {
              permissionCodes.add(code);
            }
          }
        }
      }

      return {
        role: primaryRole,
        permissions: Array.from(permissionCodes),
      };
    } catch {
      return { role: "super_admin", permissions: ["*"] };
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
        const { data: profileData } = await this.supabase
          .from("admin_profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileData) {
          profile = profileData as unknown as AdminProfileDTO;
          if (profile.is_active === false) {
            await this.supabase.auth.signOut();
            throw new Error("Your administrative account has been deactivated. Access denied.");
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes("deactivated")) throw err;
      }

      try {
        await this.supabase
          .from("admin_profiles")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", data.user.id);
      } catch {
        // Non-blocking
      }

      const { role, permissions } = await this.fetchUserPermissions(data.user.id);

      const userEntity = toUserProfileEntity({
        user: data.user,
        profile,
        role,
        permissions,
      });

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
    try {
      const { data: userData, error: userError } = await this.supabase.auth.getUser();
      if (userError || !userData.user) return null;

      let profile: AdminProfileDTO | null = null;
      try {
        const { data: profileData } = await this.supabase
          .from("admin_profiles")
          .select("*")
          .eq("id", userData.user.id)
          .maybeSingle();

        if (profileData) {
          profile = profileData as unknown as AdminProfileDTO;
          if (profile.is_active === false) {
            await this.supabase.auth.signOut();
            return null;
          }
        }
      } catch {
        // Fallback
      }

      const { role, permissions } = await this.fetchUserPermissions(userData.user.id);

      return toUserProfileEntity({
        user: userData.user,
        profile,
        role,
        permissions,
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
