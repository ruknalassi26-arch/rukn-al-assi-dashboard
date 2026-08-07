// ==============================================================================
// features/roles-permissions/data/repositories/supabase-user.repository.ts
// Supabase Implementation of IUserRepository using ONLY existing schema
// (admin_profiles, roles, admin_user_roles, activity_log)
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type {
  IUserRepository,
  GetUsersFilterParams,
  PaginatedUsers,
  CreateUserInput,
  UpdateUserInput,
} from "../../domain/repositories/i-user-role-management.repository";
import { AdminUserEntity } from "../../domain/entities/admin-user.entity";

export class SupabaseUserRepository implements IUserRepository {
  private get supabase() {
    return createClient();
  }

  private async logActivity(
    action: "created" | "updated" | "deleted",
    entityId: string | null,
    entityTitle: string | null,
    metadata?: Record<string, unknown>
  ) {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      await (this.supabase.from("activity_log" as any) as any).insert({
        action,
        entity_type: "auth",
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getUsers(params?: GetUsersFilterParams): Promise<PaginatedUsers> {
    const page = Math.max(1, params?.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, params?.pageSize ?? 10));
    const offset = (page - 1) * pageSize;

    // Fetch admin_profiles with admin_user_roles and roles join
    let query = (this.supabase.from("admin_profiles" as any) as any)
      .select("*, admin_user_roles(role_id, roles(id, name, description))", { count: "exact" });

    if (params?.isActive !== undefined && params.isActive !== "all") {
      query = query.eq("is_active", params.isActive);
    }

    if (params?.search && params.search.trim() !== "") {
      const search = params.search.trim();
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    query = query.order("created_at", { ascending: false }).range(offset, offset + pageSize - 1);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    let items = (data ?? []).map((row: any) => {
      const roleRelation = Array.isArray(row.admin_user_roles)
        ? row.admin_user_roles[0]
        : row.admin_user_roles;
      const roleObj = roleRelation?.roles;

      return new AdminUserEntity({
        id: row.id,
        email: row.email || "",
        fullName: row.full_name || "Admin User",
        avatarUrl: row.avatar_url ?? null,
        roleId: roleObj?.id ?? roleRelation?.role_id ?? null,
        roleName: roleObj?.name ?? "Super Admin",
        roleCode: roleObj?.code ?? "super_admin",
        isActive: row.is_active ?? true,
        lastLoginAt: row.last_login_at ?? null,
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString(),
      });
    });

    if (params?.roleId) {
      items = items.filter((user: AdminUserEntity) => user.roleId === params.roleId);
    }

    const total = count ?? items.length;
    const totalPages = Math.ceil(total / pageSize);

    return { items, total, page, pageSize, totalPages };
  }

  async getUserById(id: string): Promise<AdminUserEntity | null> {
    const { data, error } = await (this.supabase.from("admin_profiles" as any) as any)
      .select("*, admin_user_roles(role_id, roles(id, name, description))")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    const roleRelation = Array.isArray(data.admin_user_roles)
      ? data.admin_user_roles[0]
      : data.admin_user_roles;
    const roleObj = roleRelation?.roles;

    return new AdminUserEntity({
      id: data.id,
      email: data.email || "",
      fullName: data.full_name || "Admin User",
      avatarUrl: data.avatar_url ?? null,
      roleId: roleObj?.id ?? roleRelation?.role_id ?? null,
      roleName: roleObj?.name ?? "Super Admin",
      roleCode: roleObj?.code ?? "super_admin",
      isActive: data.is_active ?? true,
      lastLoginAt: data.last_login_at ?? null,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    });
  }

  async createUser(input: CreateUserInput): Promise<AdminUserEntity> {
    // Invoke secure server API route to create Auth user + profile + role assignment
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to create user.");
    }

    const newUser = await this.getUserById(result.user.id);
    await this.logActivity("created", result.user.id, `Created User: ${input.fullName}`);
    return newUser || new AdminUserEntity({
      id: result.user.id,
      email: input.email,
      fullName: input.fullName,
      roleId: input.roleId,
      isActive: input.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<AdminUserEntity> {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (input.fullName !== undefined) payload.full_name = input.fullName;
    if (input.avatarUrl !== undefined) payload.avatar_url = input.avatarUrl;
    if (input.isActive !== undefined) payload.is_active = input.isActive;

    const { error: profileError } = await (this.supabase.from("admin_profiles" as any) as any)
      .update(payload)
      .eq("id", id);

    if (profileError) throw new Error(profileError.message);

    if (input.roleId) {
      await (this.supabase.from("admin_user_roles" as any) as any)
        .delete()
        .eq("user_id", id);

      await (this.supabase.from("admin_user_roles" as any) as any)
        .insert({ user_id: id, role_id: input.roleId });
    }

    const updated = await this.getUserById(id);
    await this.logActivity("updated", id, `Updated User Profile: ${input.fullName ?? id}`);
    return updated!;
  }

  async setUserActiveStatus(id: string, isActive: boolean): Promise<AdminUserEntity> {
    const updated = await this.updateUser(id, { isActive });
    await this.logActivity("updated", id, `${isActive ? "Activated" : "Deactivated"} User: ${updated.fullName}`);
    return updated;
  }
}
