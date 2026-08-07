// ==============================================================================
// features/roles-permissions/domain/repositories/i-user-role-management.repository.ts
// Repository Interfaces for Admin Users, Roles, and Grouped Permissions
// ==============================================================================

import type { AdminUserEntity } from "../entities/admin-user.entity";
import type { RoleEntity } from "../entities/role.entity";
import type { PermissionEntity } from "../entities/permission.entity";

export interface GetUsersFilterParams {
  search?: string;
  roleId?: string;
  isActive?: boolean | "all";
  page?: number;
  pageSize?: number;
}

export interface PaginatedUsers {
  items: AdminUserEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  roleId: string;
  isActive?: boolean;
}

export interface UpdateUserInput {
  fullName?: string;
  avatarUrl?: string | null;
  roleId?: string;
  isActive?: boolean;
}

export interface GetRolesFilterParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedRoles {
  items: (RoleEntity & { usersCount: number; permissionsCount: number })[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateRoleInput {
  name: string;
  code?: string;
  description?: string | null;
  permissionIds: string[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string | null;
  permissionIds?: string[];
}

export interface IUserRepository {
  getUsers(params?: GetUsersFilterParams): Promise<PaginatedUsers>;
  getUserById(id: string): Promise<AdminUserEntity | null>;
  createUser(input: CreateUserInput): Promise<AdminUserEntity>;
  updateUser(id: string, input: UpdateUserInput): Promise<AdminUserEntity>;
  setUserActiveStatus(id: string, isActive: boolean): Promise<AdminUserEntity>;
}

export interface IRoleRepository {
  getRoles(params?: GetRolesFilterParams): Promise<PaginatedRoles>;
  getRoleById(id: string): Promise<(RoleEntity & { usersCount: number; permissionIds: string[]; permissionEntities: PermissionEntity[] }) | null>;
  getAllPermissions(): Promise<PermissionEntity[]>;
  createRole(input: CreateRoleInput): Promise<RoleEntity>;
  updateRole(id: string, input: UpdateRoleInput): Promise<RoleEntity>;
  deleteRole(id: string): Promise<void>;
}
