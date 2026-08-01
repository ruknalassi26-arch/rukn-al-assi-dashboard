"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/can.tsx
// Declarative RBAC Component for Button & Action Visibility
// Usage: <Can access="products:create"><Button>Create Product</Button></Can>
// ==============================================================================
import React from "react";
import { usePermission } from "../hooks/use-permission";
import type { PermissionCode, RoleCode } from "../../domain/entities/role.enums";

interface CanProps {
  access?: PermissionCode | PermissionCode[];
  role?: RoleCode | RoleCode[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ access, role, children, fallback = null }: CanProps) {
  const { hasPermission, hasRole } = usePermission();

  let isAllowed = true;

  if (access) {
    const accessArray = Array.isArray(access) ? access : [access];
    isAllowed = accessArray.some((perm) => hasPermission(perm));
  }

  if (isAllowed && role) {
    isAllowed = hasRole(role);
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
