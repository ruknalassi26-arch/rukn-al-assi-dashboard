// ==============================================================================
// features/roles-permissions/data/repositories/supabase-role.repository.ts
// Supabase Implementation of IRoleRepository using ONLY existing schema
// (roles, permissions, role_permissions, admin_user_roles, activity_log)
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type {
  IRoleRepository,
  GetRolesFilterParams,
  PaginatedRoles,
  CreateRoleInput,
  UpdateRoleInput,
} from "../../domain/repositories/i-user-role-management.repository";
import { RoleEntity } from "../../domain/entities/role.entity";
import { PermissionEntity } from "../../domain/entities/permission.entity";

export class SupabaseRoleRepository implements IRoleRepository {
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
        entity_type: "settings",
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getRoles(params?: GetRolesFilterParams): Promise<PaginatedRoles> {
    const page = Math.max(1, params?.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, params?.pageSize ?? 10));
    const offset = (page - 1) * pageSize;

    let query = (this.supabase.from("roles" as any) as any)
      .select("*, admin_user_roles(count), role_permissions(count)", { count: "exact" });

    if (params?.search && params.search.trim() !== "") {
      const search = params.search.trim();
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query.order("created_at", { ascending: true }).range(offset, offset + pageSize - 1);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    const items = (data ?? []).map((row: any) => {
      const roleEntity = new RoleEntity({
        id: row.id,
        name: row.name,
        code: row.code ?? row.name.toLowerCase().replace(/\s+/g, "_"),
        description: row.description ?? null,
        isSystemRole: row.code === "super_admin" || row.is_system === true,
      });

      const usersCount = row.admin_user_roles?.[0]?.count ?? 0;
      const permissionsCount = row.role_permissions?.[0]?.count ?? 0;

      return Object.assign(roleEntity, {
        usersCount,
        permissionsCount,
      });
    });

    const total = count ?? items.length;
    const totalPages = Math.ceil(total / pageSize);

    return { items, total, page, pageSize, totalPages };
  }

  async getRoleById(id: string) {
    const { data: roleRow, error } = await (this.supabase.from("roles" as any) as any)
      .select("*, admin_user_roles(count)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!roleRow) return null;

    const { data: permRows } = await (this.supabase.from("role_permissions" as any) as any)
      .select("permission_id, permissions(*)")
      .eq("role_id", id);

    const permissionIds = (permRows ?? []).map((p: any) => p.permission_id);
    const permissions = (permRows ?? []).map((p: any) => {
      const name = p.permissions?.name || "";
      const derivedModule = p.permissions?.module
        ? p.permissions.module
        : name.includes(":")
        ? name.split(":")[0]
        : name.includes("_")
        ? name.split("_")[0]
        : "General";

      return new PermissionEntity({
        id: p.permissions.id,
        code: p.permissions.code ?? name,
        name,
        module: derivedModule as any,
        description: p.permissions.description ?? null,
      });
    });

    const roleEntity = new RoleEntity({
      id: roleRow.id,
      name: roleRow.name,
      code: roleRow.code ?? roleRow.name.toLowerCase().replace(/\s+/g, "_"),
      description: roleRow.description ?? null,
      isSystemRole: roleRow.code === "super_admin" || roleRow.is_system === true,
    });

    const usersCount = roleRow.admin_user_roles?.[0]?.count ?? 0;

    return Object.assign(roleEntity, {
      usersCount,
      permissionIds,
      permissionEntities: permissions,
    });
  }

  async getAllPermissions(): Promise<PermissionEntity[]> {
    const { data, error } = await (this.supabase.from("permissions" as any) as any)
      .select("*")
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((p: any) => {
      const name = p.name || "";
      const derivedModule = p.module
        ? p.module
        : name.includes(":")
        ? name.split(":")[0]
        : name.includes("_")
        ? name.split("_")[0]
        : "General";

      return new PermissionEntity({
        id: p.id,
        code: p.code ?? p.name,
        name: p.name,
        module: derivedModule as any,
        description: p.description ?? null,
      });
    });
  }

  async createRole(input: CreateRoleInput): Promise<RoleEntity> {
    const code = input.code || input.name.toLowerCase().replace(/[^a-z0-9_]/g, "_");

    const { data: roleRow, error } = await (this.supabase.from("roles" as any) as any)
      .insert({
        name: input.name,
        description: input.description ?? null,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    if (input.permissionIds && input.permissionIds.length > 0) {
      const inserts = input.permissionIds.map((pId) => ({
        role_id: roleRow.id,
        permission_id: pId,
      }));
      await (this.supabase.from("role_permissions" as any) as any).insert(inserts);
    }

    const entity = new RoleEntity({
      id: roleRow.id,
      name: roleRow.name,
      code: roleRow.code ?? code,
      description: roleRow.description,
    });

    await this.logActivity("created", entity.id, `Created Role: ${entity.name}`);
    return entity;
  }

  async updateRole(id: string, input: UpdateRoleInput): Promise<RoleEntity> {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (input.name !== undefined) payload.name = input.name;
    if (input.description !== undefined) payload.description = input.description;

    const { data: roleRow, error } = await (this.supabase.from("roles" as any) as any)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    if (input.permissionIds !== undefined) {
      // Clear old permissions and insert updated set
      await (this.supabase.from("role_permissions" as any) as any)
        .delete()
        .eq("role_id", id);

      if (input.permissionIds.length > 0) {
        const inserts = input.permissionIds.map((pId) => ({
          role_id: id,
          permission_id: pId,
        }));
        await (this.supabase.from("role_permissions" as any) as any).insert(inserts);
      }
    }

    const entity = new RoleEntity({
      id: roleRow.id,
      name: roleRow.name,
      code: roleRow.code,
      description: roleRow.description,
    });

    await this.logActivity("updated", id, `Updated Role: ${entity.name}`);
    return entity;
  }

  async deleteRole(id: string): Promise<void> {
    const existing = await this.getRoleById(id);
    if (existing?.code === "super_admin") {
      throw new Error("Cannot delete Super Admin system role.");
    }

    const { error } = await (this.supabase.from("roles" as any) as any)
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.name ?? null);
  }
}
