// ==============================================================================
// features/roles-permissions/data/repositories/supabase-role.repository.ts
// Supabase Implementation of IRoleRepository using get_admin_security_roles RPC
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
import type { RoleCode, ResourceCode } from "../../domain/entities/role.enums";

export interface PermissionDto {
  id: string;
  resource: string;
  action: "view" | "manage";
}

export interface AdminSecurityRoleDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  assignedUsers: number;
  permissions: PermissionDto[];
}

function mapPermissionDTOToEntity(permObj: PermissionDto): PermissionEntity {
  const resource = permObj.resource.toLowerCase().trim();
  const action = permObj.action.toLowerCase().trim();
  const formattedResource = resource.replace("_", " ").replace(/\b\w/g, (char: string) => char.toUpperCase());
  const formattedAction = action.toUpperCase();

  const codeStr = `${resource}:${action}`;
  const displayTitle = `${formattedResource} (${formattedAction})`;

  return new PermissionEntity({
    id: permObj.id,
    code: codeStr,
    name: displayTitle,
    module: resource as ResourceCode,
    description: `${action} access for ${resource}`,
  });
}

export class SupabaseRoleRepository implements IRoleRepository {
  private get supabase() {
    return createClient();
  }

  /**
   * Calls public.get_admin_security_roles() RPC with NO parameters.
   */
  async getRoles(params?: GetRolesFilterParams): Promise<PaginatedRoles> {
    const page = Math.max(1, params?.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, params?.pageSize ?? 10));
    const offset = (page - 1) * pageSize;

    const { data: rpcData, error: rpcError } = await this.supabase.rpc("get_admin_security_roles");

    if (rpcError) {
      throw new Error(rpcError.message || "Failed to load roles via get_admin_security_roles RPC");
    }

    const rolesData = (Array.isArray(rpcData) ? rpcData : []) as AdminSecurityRoleDto[];

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
      const permissionEntities = permList.map((p) => mapPermissionDTOToEntity(p));

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
    let rawPermissions: PermissionDto[] = [];

    try {
      const { data, error } = await this.supabase
        .from("permissions")
        .select("id, resource, action")
        .order("resource", { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        rawPermissions = data as unknown as PermissionDto[];
      }
    } catch {
      // Fallback to RPC below
    }

    // If direct select on permissions returned empty due to RLS, extract from get_admin_security_roles RPC
    if (rawPermissions.length === 0) {
      const { data: rpcData } = await this.supabase.rpc("get_admin_security_roles");
      if (Array.isArray(rpcData)) {
        const permMap = new Map<string, PermissionDto>();
        (rpcData as AdminSecurityRoleDto[]).forEach((role) => {
          (role.permissions || []).forEach((p) => {
            if (p.id && !permMap.has(p.id)) {
              permMap.set(p.id, p);
            }
          });
        });
        rawPermissions = Array.from(permMap.values());
      }
    }

    const items = rawPermissions.map((p) => mapPermissionDTOToEntity(p));

    return items.sort((a: PermissionEntity, b: PermissionEntity) =>
      a.module.localeCompare(b.module) || a.name.localeCompare(b.name)
    );
  }

  async createRole(input: CreateRoleInput): Promise<RoleEntity> {
    const slug = input.code || input.name.toLowerCase().replace(/[^a-z0-9_]/g, "_");

    const { data, error } = await (this.supabase.rpc as CallableFunction)(
      "create_admin_security_role",
      {
        p_name: input.name,
        p_slug: slug,
        p_description: input.description ?? null,
        p_permission_ids: input.permissionIds ?? [],
      }
    );

    if (error) throw new Error(error.message);

    const result = (typeof data === "string" ? JSON.parse(data) : data) as {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      is_system: boolean;
    };

    return new RoleEntity({
      id: result.id,
      name: result.name,
      code: (result.slug ?? slug) as RoleCode,
      description: result.description ?? null,
      isSystemRole: false,
    });
  }

  async updateRole(id: string, input: UpdateRoleInput): Promise<RoleEntity> {
    const { data, error } = await (this.supabase.rpc as CallableFunction)(
      "update_admin_security_role",
      {
        p_role_id: id,
        p_name: input.name ?? null,
        p_description: input.description ?? null,
        p_permission_ids: input.permissionIds ?? null,
      }
    );

    if (error) throw new Error(error.message);

    const result = (typeof data === "string" ? JSON.parse(data) : data) as {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      is_system: boolean;
    };

    return new RoleEntity({
      id: result.id,
      name: result.name,
      code: (result.slug ?? "viewer") as RoleCode,
      description: result.description ?? null,
      isSystemRole: result.is_system === true || result.slug === "super_admin",
    });
  }

  async deleteRole(id: string): Promise<void> {
    const { error } = await (this.supabase.rpc as CallableFunction)(
      "delete_admin_security_role",
      { p_role_id: id }
    );

    if (error) throw new Error(error.message);
  }
}
