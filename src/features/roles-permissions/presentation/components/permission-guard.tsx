"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/permission-guard.tsx
// Permission Guard Component with Fallback View
// ==============================================================================
import React from "react";
import { usePermission } from "../hooks/use-permission";
import type { PermissionCode } from "../../domain/entities/role.enums";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@shared/ui";

interface PermissionGuardProps {
  permission: PermissionCode | PermissionCode[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { hasPermission } = usePermission();

  const perms = Array.isArray(permission) ? permission : [permission];
  const allowed = perms.some((p) => hasPermission(p));

  if (!allowed) {
    if (fallback !== undefined) return <>{fallback}</>;

    return (
      <Card className="border border-destructive/20 bg-destructive/5 my-6">
        <CardContent className="p-8 text-center space-y-3">
          <ShieldAlert className="h-10 w-10 mx-auto text-destructive" />
          <h3 className="text-lg font-bold text-foreground">Access Restricted</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            You do not have permission to access or view this module. Please contact your system administrator.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
