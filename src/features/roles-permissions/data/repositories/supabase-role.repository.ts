// ==============================================================================
// features/roles-permissions/data/repositories/supabase-role.repository.ts
// Supabase Implementation of IRoleRepository using get_admin_security_roles RPC
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
import { ALL_RESOURCES, type RoleCode, type ResourceCode } from "../../domain/entities/role.enums";

export interface AdminSecurityRolePermissionDto {
  id: string;
  resource: string;
  action: string;
}

export interface AdminSecurityRoleDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  assignedUsers: number;
  permissions: AdminSecurityRolePermissionDto[];
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

function mapPermissionDTOToEntity(
  permObj: PermissionRowDTO | AdminSecurityRolePermissionDto,
  fallbackId: string
): PermissionEntity {
  const pRow = permObj as PermissionRowDTO;
  const resource = (permObj.resource || pRow.module || (pRow.code?.includes(":") ? pRow.code.split(":")[0] : "general")).toLowerCase().trim();
  const action = (permObj.action || (pRow.code?.includes(":") ? pRow.code.split(":")[1] : "view")).toLowerCase().trim();

  const formattedResource = resource.replace("_", " ").replace(/\b\w/g, (char: string) => char.toUpperCase());
  const formattedAction = action.toUpperCase();

  const codeStr = `${resource}:${action}`;
  const displayTitle =
    pRow.name && !pRow.name.includes("-") && pRow.name.length < 40
      ? pRow.name
      : `${formattedResource} (${formattedAction})`;

  return new PermissionEntity({
    id: permObj.id || fallbackId,
    code: codeStr,
    name: displayTitle,
    module: resource as ResourceCode,
    description: pRow.description ?? `${action} access for ${resource}`,
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

  /**
   * Calls exactly public.get_admin_security_roles() RPC with NO parameters.
   */
  async getRoles(params?: GetRolesFilterParams): Promise<PaginatedRoles> {
    const page = Math.max(1, params?.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, params?.pageSize ?? 10));
    const offset = (page - 1) * pageSize;

    // Call canonical get_admin_security_roles RPC
    const { data: rpcData, error: rpcError } = await this.supabase.rpc("get_admin_security_roles");

    if (rpcError) {
      throw new Error(rpcError.message || "Failed to load roles via get_admin_security_roles RPC");
    }

    const rolesData = (Array.isArray(rpcData) ? rpcData : []) as AdminSecurityRoleDto[];

    // Apply optional search filter
    let filtered = rolesData;
    if (params?.search && params.search.trim() !== "") {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const paginatedSlice = filtered.slice(offset, offset + pageSize);

    const items = paginatedSlice.map((dto) => {
      const roleCode = (dto.slug || dto.name.toLowerCase().replace(/\s+/g, "_")) as RoleCode;
      const isSystem = dto.isSystem ?? dto.slug === "super_admin";
      const usersCount = dto.assignedUsers ?? 0;
      const permList = dto.permissions ?? [];

      const permissionIds = permList.map((p) => p.id);
      const permissionEntities = permList.map((p) => mapPermissionDTOToEntity(p, p.id));

      const entity = new RoleEntity({
        id: dto.id,
        name: dto.name,
        code: roleCode,
        description: dto.description ?? null,
        isSystemRole: isSystem,
        usersCount,
        permissionsCount: permList.length,
      });

      return Object.assign(entity, {
        permissionIds,
        permissionEntities,
        usersCount,
        permissionsCount: permList.length,
      });
    });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }

  async getRoleById(
    id: string
  ): Promise<(RoleEntity & { usersCount: number; permissionIds: string[]; permissionEntities: PermissionEntity[] }) | null> {
    const all = await this.getRoles({ pageSize: 100 });
    const found = all.items.find((r) => r.id === id);
    if (found) {
      return found as RoleEntity & { usersCount: number; permissionIds: string[]; permissionEntities: PermissionEntity[] };
    }
    return null;
  }

  async getAllPermissions(): Promise<PermissionEntity[]> {
    let items: PermissionEntity[] = [];

    try {
      const { data, error } = await this.supabase
        .from("permissions")
        .select("id, resource, action")
        .order("resource", { ascending: true });

      if (!error && data && data.length > 0) {
        const rawPermissions = (data as unknown as PermissionRowDTO[]) ?? [];
        items = rawPermissions.map((p) => mapPermissionDTOToEntity(p, p.id));
      }
    } catch {
      // Fallback
    }

    if (items.length === 0) {
      ALL_RESOURCES.forEach((res) => {
        (["view", "manage"] as const).forEach((act) => {
          const code = `${res}:${act}`;
          items.push(
            new PermissionEntity({
              id: code,
              code,
              name: `${res.charAt(0).toUpperCase() + res.slice(1)} (${act.toUpperCase()})`,
              module: res as ResourceCode,
              description: `${act} access for ${res}`,
            })
          );
        });
      });
    }

    return items.sort((a: PermissionEntity, b: PermissionEntity) =>
      a.module.localeCompare(b.module) || a.name.localeCompare(b.name)
    );
  }

  async createRole(input: CreateRoleInput): Promise<RoleEntity> {
    const slug = input.code || input.name.toLowerCase().replace(/[^a-z0-9_]/g, "_");

    const { data: roleRow, error } = await this.supabase
      .from("roles")
      .insert({
        name: input.name,
        slug: slug,
        description: input.description ?? null,
        is_system: false,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    if (input.permissionIds && input.permissionIds.length > 0) {
      const { data: dbPermsRaw } = await this.supabase.from("permissions").select("*");
      const dbPerms = (dbPermsRaw as unknown as PermissionRowDTO[]) ?? [];
      const inserts: { role_id: string; permission_id: string }[] = [];

      input.permissionIds.forEach((pVal) => {
        const foundById = dbPerms.find((dp) => dp.id === pVal);
        if (foundById) {
          inserts.push({ role_id: roleRow.id, permission_id: foundById.id });
        } else if (pVal.includes(":")) {
          const [r, a] = pVal.split(":");
          const foundByCode = dbPerms.find(
            (dp) => (dp.resource?.toLowerCase() === r.toLowerCase() || dp.code === pVal) && (dp.action?.toLowerCase() === a.toLowerCase() || dp.code === pVal)
          );
          if (foundByCode) {
            inserts.push({ role_id: roleRow.id, permission_id: foundByCode.id });
          }
        }
      });

      if (inserts.length > 0) {
        await this.supabase.from("role_permissions").insert(inserts);
      }
    }

    const roleCode = ((roleRow as { slug?: string }).slug ?? slug) as RoleCode;
    const entity = new RoleEntity({
      id: roleRow.id,
      name: roleRow.name,
      code: roleCode,
      description: roleRow.description,
      isSystemRole: false,
    });

    await this.logActivity("created", entity.id, `Created Role: ${entity.name}`);
    return entity;
  }

  async updateRole(id: string, input: UpdateRoleInput): Promise<RoleEntity> {
    const payload: UpdateTables<"roles"> = {};
    if (input.name !== undefined) {
      payload.name = input.name;
    }
    if (input.description !== undefined) {
      payload.description = input.description ?? null;
    }

    let roleRow: { id: string; name: string; slug?: string | null; description?: string | null; is_system?: boolean | null } | null = null;

    if (Object.keys(payload).length > 0) {
      const { data, error } = await this.supabase
        .from("roles")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      roleRow = data;
    } else {
      const { data, error } = await this.supabase
        .from("roles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      roleRow = data;
    }

    if (input.permissionIds !== undefined) {
      await this.supabase.from("role_permissions").delete().eq("role_id", id);

      if (input.permissionIds.length > 0) {
        const { data: dbPermsRaw } = await this.supabase.from("permissions").select("*");
        const dbPerms = (dbPermsRaw as unknown as PermissionRowDTO[]) ?? [];
        const inserts: { role_id: string; permission_id: string }[] = [];

        input.permissionIds.forEach((pVal) => {
          const foundById = dbPerms.find((dp) => dp.id === pVal);
          if (foundById) {
            inserts.push({ role_id: id, permission_id: foundById.id });
          } else if (pVal.includes(":")) {
            const [r, a] = pVal.split(":");
            const foundByCode = dbPerms.find(
              (dp) => (dp.resource?.toLowerCase() === r.toLowerCase() || dp.code === pVal) && (dp.action?.toLowerCase() === a.toLowerCase() || dp.code === pVal)
            );
            if (foundByCode) {
              inserts.push({ role_id: id, permission_id: foundByCode.id });
            }
          }
        });

        if (inserts.length > 0) {
          await this.supabase.from("role_permissions").insert(inserts);
        }
      }
    }

    const roleCode = (roleRow?.slug ?? roleRow?.name.toLowerCase().replace(/\s+/g, "_") ?? "viewer") as RoleCode;
    const entity = new RoleEntity({
      id: roleRow?.id ?? id,
      name: roleRow?.name ?? "",
      code: roleCode,
      description: roleRow?.description ?? null,
      isSystemRole: roleRow?.is_system === true || roleRow?.slug === "super_admin",
    });

    await this.logActivity("updated", id, `Updated Role: ${entity.name}`);
    return entity;
  }

  async deleteRole(id: string): Promise<void> {
    const existing = await this.getRoleById(id);
    if (existing?.isSuperAdmin || existing?.isSystemRole || existing?.code === "super_admin") {
      throw new Error("Cannot delete system roles such as Super Admin.");
    }

    const { error } = await this.supabase.from("roles").delete().eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.name ?? null);
  }
}
