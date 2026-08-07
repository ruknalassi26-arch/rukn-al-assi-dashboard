// ==============================================================================
// features/roles-permissions/domain/entities/admin-user.entity.ts
// Admin User Domain Entity
// ==============================================================================

export interface AdminUserProps {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  roleId?: string | null;
  roleName?: string | null;
  roleCode?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export class AdminUserEntity {
  public readonly id: string;
  public readonly email: string;
  public readonly fullName: string;
  public readonly avatarUrl: string | null;
  public readonly roleId: string | null;
  public readonly roleName: string | null;
  public readonly roleCode: string | null;
  public readonly isActive: boolean;
  public readonly lastLoginAt: string | null;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(props: AdminUserProps) {
    this.id = props.id;
    this.email = props.email;
    this.fullName = props.fullName;
    this.avatarUrl = props.avatarUrl ?? null;
    this.roleId = props.roleId ?? null;
    this.roleName = props.roleName ?? null;
    this.roleCode = props.roleCode ?? null;
    this.isActive = props.isActive;
    this.lastLoginAt = props.lastLoginAt ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
