"use client";
// ==============================================================================
// features/roles-permissions/presentation/hooks/use-permission.ts
// Reusable React Hook for RBAC Permission Guards with "manage implies view" logic
// ==============================================================================
import { useAuthStore } from "@features/authentication/presentation/stores/auth.store";
import { ALL_PERMISSIONS, ROLE_PERMISSION_MATRIX } from "../../domain/entities/role-permission.matrix";
import type { PermissionAction, PermissionCode, ResourceCode } from "../../domain/entities/role.enums";

export function usePermission() {
  const { user } = useAuthStore();

  const userRole = (user?.role?.toLowerCase().replace(/\s+/g, "_") ?? "viewer");
  const isSuperAdmin = userRole === "super_admin" || user?.isSuperAdmin === true;

  // Effective permissions across all user roles
  const effectivePermissions: PermissionCode[] = isSuperAdmin
    ? ALL_PERMISSIONS
    : (user?.permissions as PermissionCode[]) ?? ROLE_PERMISSION_MATRIX[userRole] ?? ROLE_PERMISSION_MATRIX.viewer ?? [];

  /**
   * Checks if user has specific resource & action permission.
   * "manage" action automatically implies "view" access.
   */
  const hasPermission = (
    resourceOrCode: ResourceCode | PermissionCode | string,
    action?: PermissionAction
  ): boolean => {
    if (isSuperAdmin) return true;

    let resource: string;
    let act: string;

    if (action) {
      resource = resourceOrCode;
      act = action;
    } else if (resourceOrCode.includes(":")) {
      const parts = resourceOrCode.split(":");
      resource = parts[0];
      act = parts[1];
    } else {
      resource = resourceOrCode;
      act = "view";
    }

    const exactCode = `${resource}:${act}`;
    const manageCode = `${resource}:manage`;

    if (effectivePermissions.includes(exactCode as PermissionCode)) {
      return true;
    }

    // "manage" implies "view"
    if (act === "view" && effectivePermissions.includes(manageCode as PermissionCode)) {
      return true;
    }

    return false;
  };

  const hasRole = (allowedRoles: string | string[]): boolean => {
    if (isSuperAdmin) return true;
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return rolesArray.includes(userRole);
  };

  return {
    user,
    role: userRole,
    effectivePermissions,
    isSuperAdmin,
    hasPermission,
    hasRole,
  };
}
