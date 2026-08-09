// ==============================================================================
// features/roles-permissions/data/repositories/supabase-user.repository.ts
// Supabase Implementation of IUserRepository using strongly typed Supabase DTOs
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type { Database, UpdateTables } from "@core/types/database.types";
import type {
  IUserRepository,
  GetUsersFilterParams,
  PaginatedUsers,
  CreateUserInput,
  UpdateUserInput,
} from "../../domain/repositories/i-user-role-management.repository";
import { AdminUserEntity } from "../../domain/entities/admin-user.entity";

interface RoleJoinDTO {
  id: string;
  name: string;
  description: string | null;
}

interface AdminUserRoleJoinDTO {
  role_id: string;
  roles: RoleJoinDTO | RoleJoinDTO[] | null;
}

interface AdminProfileJoinDTO {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  admin_user_roles: AdminUserRoleJoinDTO[] | AdminUserRoleJoinDTO | null;
}

function mapProfileDTOToEntity(row: AdminProfileJoinDTO): AdminUserEntity {
  const roleRelation = Array.isArray(row.admin_user_roles)
    ? row.admin_user_roles[0]
    : row.admin_user_roles;

  const roleObj = Array.isArray(roleRelation?.roles)
    ? roleRelation.roles[0]
    : roleRelation?.roles;

  return new AdminUserEntity({
    id: row.id,
    email: row.email || "",
    fullName: row.full_name || "Admin User",
    avatarUrl: row.avatar_url ?? null,
    roleId: roleObj?.id ?? roleRelation?.role_id ?? null,
    roleName: roleObj?.name ?? "Super Admin",
    roleCode: roleObj?.name ? roleObj.name.toLowerCase().replace(/\s+/g, "_") : "super_admin",
    isActive: row.is_active ?? true,
    lastLoginAt: row.last_login_at ?? null,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  });
}

export class SupabaseUserRepository implements IUserRepository {
  private get supabase() {
    return createClient();
  }

  private async logActivity(
    action: string,
    entityId: string | null,
    entityTitle: string | null,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      await this.supabase.from("activity_log").insert({
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

    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const result = await res.json();
        if (Array.isArray(result.users)) {
          const rawRows = result.users as AdminProfileJoinDTO[];
          let items = rawRows.map(mapProfileDTOToEntity);

          if (params?.isActive !== undefined && params.isActive !== "all") {
            items = items.filter((u) => u.isActive === params.isActive);
          }

          if (params?.search && params.search.trim() !== "") {
            const search = params.search.trim().toLowerCase();
            items = items.filter(
              (u) => u.fullName.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)
            );
          }

          if (params?.roleId) {
            items = items.filter((u) => u.roleId === params.roleId);
          }

          const total = items.length;
          const totalPages = Math.ceil(total / pageSize);
          const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

          return { items: paginatedItems, total, page, pageSize, totalPages };
        }
      }
    } catch {
      // Fallback
    }

    const offset = (page - 1) * pageSize;
    let query = this.supabase
      .from("admin_profiles")
      .select("*, admin_user_roles(role_id, roles(id, name, description))", { count: "exact" });

    if (params?.isActive !== undefined && params.isActive !== "all") {
      query = query.eq("is_active", params.isActive);
    }

    query = query.order("created_at", { ascending: false }).range(offset, offset + pageSize - 1);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    const rawRows = (data as unknown as AdminProfileJoinDTO[]) ?? [];
    let items = rawRows.map(mapProfileDTOToEntity);

    if (params?.roleId) {
      items = items.filter((user: AdminUserEntity) => user.roleId === params.roleId);
    }

    const total = count ?? items.length;
    const totalPages = Math.ceil(total / pageSize);

    return { items, total, page, pageSize, totalPages };
  }

  async getUserById(id: string): Promise<AdminUserEntity | null> {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const result = await res.json();
        if (Array.isArray(result.users)) {
          const rawRow = result.users.find((u: any) => u.id === id);
          if (rawRow) return mapProfileDTOToEntity(rawRow);
        }
      }
    } catch {
      // Fallback
    }

    const { data, error } = await this.supabase
      .from("admin_profiles")
      .select("*, admin_user_roles(role_id, roles(id, name, description))")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return mapProfileDTOToEntity(data as unknown as AdminProfileJoinDTO);
  }

  async createUser(input: CreateUserInput): Promise<AdminUserEntity> {
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const result = (await response.json()) as {
      success?: boolean;
      error?: string;
      user?: { id: string };
    };

    if (!response.ok || !result.success || !result.user) {
      throw new Error(result.error || "Failed to create user.");
    }

    const newUser = await this.getUserById(result.user.id);
    await this.logActivity("created", result.user.id, `Created User: ${input.fullName}`);
    return (
      newUser ||
      new AdminUserEntity({
        id: result.user.id,
        email: input.email,
        fullName: input.fullName,
        roleId: input.roleId,
        isActive: input.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<AdminUserEntity> {
    const payload: UpdateTables<"admin_profiles"> = {};
    if (input.fullName !== undefined) payload.full_name = input.fullName;
    if (input.avatarUrl !== undefined) payload.avatar_url = input.avatarUrl;
    if (input.isActive !== undefined) payload.is_active = input.isActive;

    if (Object.keys(payload).length > 0) {
      const { error: profileError } = await this.supabase
        .from("admin_profiles")
        .update(payload)
        .eq("id", id);

      if (profileError) throw new Error(profileError.message);
    }

    if (input.roleId) {
      await this.supabase.from("admin_user_roles").delete().eq("user_id", id);
      await this.supabase.from("admin_user_roles").insert({ user_id: id, role_id: input.roleId });
    }

    if (input.password && input.password.trim() !== "") {
      const current = await this.getUserById(id);
      if (current?.email) {
        await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: current.email,
            fullName: input.fullName || current.fullName,
            password: input.password,
            roleId: input.roleId || current.roleId,
          }),
        });
      }
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
