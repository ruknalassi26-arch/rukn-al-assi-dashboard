// ==============================================================================
// features/roles-permissions/data/repositories/supabase-role.repository.ts
// Supabase Implementation of IRoleRepository using strongly typed Supabase DTOs
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type { UpdateTables } from "@core/types/database.types";
import type {
  IRoleRepository,
  GetRolesFilterParams,
  PaginatedRoles,
  CreateRoleInput,
  UpdateRoleInput,
} from "../../domain/repositories/i-user-role-management.repository";
import { RoleEntity } from "../../domain/entities/role.entity";
import { PermissionEntity } from "../../domain/entities/permission.entity";
import type { RoleCode, ResourceCode } from "../../domain/entities/role.enums";

interface RoleRowDTO {
  id: string;
  name: string;
  code?: string | null;
  description: string | null;
  is_system?: boolean | null;
  created_at: string;
  admin_user_roles?: { count: number }[];
  role_permissions?: { count: number }[];
}

interface PermissionRowDTO {
  id: string;
  code?: string | null;
  name?: string | null;
  module?: string | null;
  resource?: string | null;
  action?: string | null;
  description?: string | null;
}

interface RolePermissionJoinDTO {
  permission_id: string;
  permissions: PermissionRowDTO | PermissionRowDTO[] | null;
}

function mapPermissionDTOToEntity(permObj: PermissionRowDTO, fallbackId: string): PermissionEntity {
  const resource = permObj.resource || permObj.module || (permObj.code?.includes(":") ? permObj.code.split(":")[0] : "general");
  const action = permObj.action || (permObj.code?.includes(":") ? permObj.code.split(":")[1] : "access");

  const formattedResource = resource.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const formattedAction = action.toUpperCase();

  const codeStr = permObj.code || `${resource}:${action}`;
  const displayTitle = permObj.name && !permObj.name.includes("-") && permObj.name.length < 40
    ? permObj.name
    : `${formattedResource} (${formattedAction})`;

  return new PermissionEntity({
    id: permObj.id || fallbackId,
    code: codeStr,
    name: displayTitle,
    module: formattedResource as ResourceCode,
    description: permObj.description ?? `${action} access for ${resource}`,
  });
}

export class SupabaseRoleRepository implements IRoleRepository {
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

    let query = this.supabase
      .from("roles")
      .select("*, admin_user_roles(count), role_permissions(count)", { count: "exact" });

    if (params?.search && params.search.trim() !== "") {
      const search = params.search.trim();
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query.order("created_at", { ascending: true }).range(offset, offset + pageSize - 1);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    const rawRows = (data as unknown as RoleRowDTO[]) ?? [];

    const items = rawRows.map((row) => {
      const roleCode = (row.code ?? row.name.toLowerCase().replace(/\s+/g, "_")) as RoleCode;
      const roleEntity = new RoleEntity({
        id: row.id,
        name: row.name,
        code: roleCode,
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
    const { data: roleRow, error } = await this.supabase
      .from("roles")
      .select("*, admin_user_roles(count)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!roleRow) return null;

    const rawRole = roleRow as unknown as RoleRowDTO;

    const { data: permRows } = await this.supabase
      .from("role_permissions")
      .select("permission_id, permissions(*)")
      .eq("role_id", id);

    const rawPermRows = (permRows as unknown as RolePermissionJoinDTO[]) ?? [];

    const permissionIds = rawPermRows.map((p) => p.permission_id);
    const permissions = rawPermRows.map((p) => {
      const permObj = Array.isArray(p.permissions) ? p.permissions[0] : p.permissions;
      return mapPermissionDTOToEntity(permObj || { id: p.permission_id }, p.permission_id);
    });

    const roleCode = (rawRole.code ?? rawRole.name.toLowerCase().replace(/\s+/g, "_")) as RoleCode;
    const roleEntity = new RoleEntity({
      id: rawRole.id,
      name: rawRole.name,
      code: roleCode,
      description: rawRole.description ?? null,
      isSystemRole: rawRole.code === "super_admin" || rawRole.is_system === true,
    });

    const usersCount = rawRole.admin_user_roles?.[0]?.count ?? 0;

    return Object.assign(roleEntity, {
      usersCount,
      permissionIds,
      permissionEntities: permissions,
    });
  }

  async getAllPermissions(): Promise<PermissionEntity[]> {
    const { data, error } = await this.supabase.from("permissions").select("*");

    if (error) throw new Error(error.message);

    const rawPermissions = (data as unknown as PermissionRowDTO[]) ?? [];

    const items = rawPermissions.map((p) => mapPermissionDTOToEntity(p, p.id));

    return items.sort((a: PermissionEntity, b: PermissionEntity) =>
      a.module.localeCompare(b.module) || a.name.localeCompare(b.name)
    );
  }

  async createRole(input: CreateRoleInput): Promise<RoleEntity> {
    const code = input.code || input.name.toLowerCase().replace(/[^a-z0-9_]/g, "_");

    const { data: roleRow, error } = await this.supabase
      .from("roles")
      .insert({
        name: input.name,
        description: input.description ?? null,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    const rawRole = roleRow as unknown as RoleRowDTO;

    if (input.permissionIds && input.permissionIds.length > 0) {
      const inserts = input.permissionIds.map((pId) => ({
        role_id: rawRole.id,
        permission_id: pId,
      }));
      await this.supabase.from("role_permissions").insert(inserts);
    }

    const roleCode = (rawRole.code ?? code) as RoleCode;
    const entity = new RoleEntity({
      id: rawRole.id,
      name: rawRole.name,
      code: roleCode,
      description: rawRole.description,
    });

    await this.logActivity("created", entity.id, `Created Role: ${entity.name}`);
    return entity;
  }

  async updateRole(id: string, input: UpdateRoleInput): Promise<RoleEntity> {
    const payload: UpdateTables<"roles"> = {
      updated_at: new Date().toISOString(),
    };
    if (input.name !== undefined) payload.name = input.name;
    if (input.description !== undefined) payload.description = input.description;

    const { data: roleRow, error } = await this.supabase
      .from("roles")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    const rawRole = roleRow as unknown as RoleRowDTO;

    if (input.permissionIds !== undefined) {
      await this.supabase.from("role_permissions").delete().eq("role_id", id);

      if (input.permissionIds.length > 0) {
        const inserts = input.permissionIds.map((pId) => ({
          role_id: id,
          permission_id: pId,
        }));
        await this.supabase.from("role_permissions").insert(inserts);
      }
    }

    const roleCode = (rawRole.code ?? rawRole.name.toLowerCase().replace(/\s+/g, "_")) as RoleCode;
    const entity = new RoleEntity({
      id: rawRole.id,
      name: rawRole.name,
      code: roleCode,
      description: rawRole.description,
    });

    await this.logActivity("updated", id, `Updated Role: ${entity.name}`);
    return entity;
  }

  async deleteRole(id: string): Promise<void> {
    const existing = await this.getRoleById(id);
    if (existing?.code === "super_admin") {
      throw new Error("Cannot delete Super Admin system role.");
    }

    const { error } = await this.supabase.from("roles").delete().eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.name ?? null);
  }
}
