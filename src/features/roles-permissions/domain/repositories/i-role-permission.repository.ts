// ==============================================================================
// features/roles-permissions/domain/repositories/i-role-permission.repository.ts
// IRolePermissionRepository Contract Interface
// ==============================================================================
import type { RoleEntity } from "../entities/role.entity";
import type { RoleCode, PermissionCode } from "../entities/role.enums";

export interface IRolePermissionRepository {
  getRoles(): Promise<RoleEntity[]>;
  getRoleByCode(code: RoleCode): Promise<RoleEntity | null>;
  getUserPermissions(roleCode: RoleCode): Promise<PermissionCode[]>;
  hasPermission(roleCode: RoleCode, permission: PermissionCode): Promise<boolean>;
}
