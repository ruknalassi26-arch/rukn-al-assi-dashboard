// ==============================================================================
// features/authentication/domain/entities/user-profile.entity.ts
// User Profile Domain Entity Class (Clean Architecture)
// ==============================================================================

export interface UserProfileProps {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: string;
  roles?: string[];
  permissions: string[];
  isSuperAdmin?: boolean;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
}

export class UserProfileEntity {
  public readonly id: string;
  public readonly email: string;
  public readonly fullName: string;
  public readonly phone: string | null;
  public readonly avatarUrl: string | null;
  public readonly role: string;
  public readonly roles: string[];
  public readonly permissions: string[];
  public readonly isSuperAdmin: boolean;
  public readonly isActive: boolean;
  public readonly lastLoginAt: Date | null;
  public readonly createdAt: Date;

  constructor(props: UserProfileProps) {
    this.id = props.id;
    this.email = props.email;
    this.fullName = props.fullName;
    this.phone = props.phone ?? null;
    this.avatarUrl = props.avatarUrl ?? null;
    this.role = props.role;
    this.roles = props.roles ?? [props.role];
    this.permissions = props.permissions;
    this.isSuperAdmin = props.isSuperAdmin ?? (props.role === "super_admin" || props.role === "Super Admin");
    this.isActive = props.isActive;
    this.lastLoginAt = props.lastLoginAt ?? null;
    this.createdAt = props.createdAt;
  }

  public hasPermission(permission: string): boolean {
    if (this.isSuperAdmin || this.permissions.includes("*")) return true;
    return this.permissions.includes(permission);
  }

  public get initials(): string {
    if (!this.fullName) return this.email.substring(0, 2).toUpperCase();
    const parts = this.fullName.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return this.fullName.substring(0, 2).toUpperCase();
  }
}
