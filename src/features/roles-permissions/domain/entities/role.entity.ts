// ==============================================================================
// features/roles-permissions/domain/entities/role.entity.ts
// Role Domain Entity Class
// ==============================================================================
import type { RoleCode, PermissionCode } from "./role.enums";
import { ROLE_PERMISSION_MATRIX } from "./role-permission.matrix";

export interface RoleProps {
  id: string;
  name: string;
  code: RoleCode;
  description?: string | null;
  permissions?: PermissionCode[];
  isSystemRole?: boolean;
}

export class RoleEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly code: RoleCode;
  public readonly description: string | null;
  public readonly permissions: PermissionCode[];
  public readonly isSystemRole: boolean;

  constructor(props: RoleProps) {
    this.id = props.id;
    this.name = props.name;
    this.code = props.code;
    this.description = props.description ?? null;
    this.permissions = props.permissions ?? ROLE_PERMISSION_MATRIX[props.code] ?? [];
    this.isSystemRole = props.isSystemRole ?? true;
  }

  public get isSuperAdmin(): boolean {
    return this.code === "super_admin";
  }

  public hasPermission(permission: PermissionCode | string): boolean {
    if (this.isSuperAdmin) return true;
    return this.permissions.includes(permission as PermissionCode);
  }
}
