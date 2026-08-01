// ==============================================================================
// features/roles-permissions/data/repositories/supabase-role-permission.repository.ts
// Concrete Implementation of IRolePermissionRepository
// ==============================================================================
import { RoleEntity } from "../../domain/entities/role.entity";
import { ROLE_PERMISSION_MATRIX } from "../../domain/entities/role-permission.matrix";
import type { IRolePermissionRepository } from "../../domain/repositories/i-role-permission.repository";
import type { RoleCode, PermissionCode } from "../../domain/entities/role.enums";

export class SupabaseRolePermissionRepository implements IRolePermissionRepository {
  private static systemRoles: RoleEntity[] = [
    new RoleEntity({
      id: "role-super-admin",
      name: "Super Admin",
      code: "super_admin",
      description: "Full unrestricted access across all system modules and user accounts",
      permissions: ROLE_PERMISSION_MATRIX.super_admin,
      isSystemRole: true,
    }),
    new RoleEntity({
      id: "role-admin",
      name: "Admin",
      code: "admin",
      description: "Administrative control over products, services, projects, RFQs, and settings",
      permissions: ROLE_PERMISSION_MATRIX.admin,
      isSystemRole: true,
    }),
    new RoleEntity({
      id: "role-editor",
      name: "Editor",
      code: "editor",
      description: "Content creation and editing rights. Cannot delete items or manage settings/users",
      permissions: ROLE_PERMISSION_MATRIX.editor,
      isSystemRole: true,
    }),
    new RoleEntity({
      id: "role-viewer",
      name: "Viewer",
      code: "viewer",
      description: "Read-only viewing access across all catalog modules and messages",
      permissions: ROLE_PERMISSION_MATRIX.viewer,
      isSystemRole: true,
    }),
  ];

  async getRoles(): Promise<RoleEntity[]> {
    return SupabaseRolePermissionRepository.systemRoles;
  }

  async getRoleByCode(code: RoleCode): Promise<RoleEntity | null> {
    const role = SupabaseRolePermissionRepository.systemRoles.find((r) => r.code === code);
    return role ?? null;
  }

  async getUserPermissions(roleCode: RoleCode): Promise<PermissionCode[]> {
    return ROLE_PERMISSION_MATRIX[roleCode] ?? ROLE_PERMISSION_MATRIX.viewer;
  }

  async hasPermission(roleCode: RoleCode, permission: PermissionCode): Promise<boolean> {
    if (roleCode === "super_admin") return true;
    const perms = ROLE_PERMISSION_MATRIX[roleCode] ?? [];
    return perms.includes(permission);
  }
}
