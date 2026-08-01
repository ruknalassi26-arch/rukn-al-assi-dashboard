"use client";
// ==============================================================================
// features/roles-permissions/presentation/hooks/use-permission.ts
// React Hook for Checking Permissions & Role Guards
// ==============================================================================
import { useAuthStore } from "@features/authentication/presentation/stores/auth.store";
import { ROLE_PERMISSION_MATRIX } from "../../domain/entities/role-permission.matrix";
import type { RoleCode, PermissionCode } from "../../domain/entities/role.enums";

export function usePermission() {
  const { user } = useAuthStore();

  const userRole = (user?.role?.toLowerCase().replace(/\s+/g, "_") ?? "admin") as RoleCode;
  const isSuperAdmin = userRole === "super_admin" || user?.isSuperAdmin === true;

  const permissions: PermissionCode[] = isSuperAdmin
    ? ROLE_PERMISSION_MATRIX.super_admin
    : (user?.permissions as PermissionCode[]) ?? ROLE_PERMISSION_MATRIX[userRole] ?? ROLE_PERMISSION_MATRIX.admin;

  const hasPermission = (permission: PermissionCode | string): boolean => {
    if (isSuperAdmin) return true;
    return permissions.includes(permission as PermissionCode);
  };

  const hasRole = (allowedRoles: RoleCode | RoleCode[]): boolean => {
    if (isSuperAdmin) return true;
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return rolesArray.includes(userRole);
  };

  return {
    user,
    role: userRole,
    permissions,
    isSuperAdmin,
    hasPermission,
    hasRole,
  };
}
