"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/role-guard.tsx
// Role Guard Component for Role-Based Access Control
// ==============================================================================
import React from "react";
import { usePermission } from "../hooks/use-permission";
import type { RoleCode } from "../../domain/entities/role.enums";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@shared/ui";

interface RoleGuardProps {
  allowedRoles: RoleCode | RoleCode[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { hasRole } = usePermission();

  const allowed = hasRole(allowedRoles);

  if (!allowed) {
    if (fallback !== undefined) return <>{fallback}</>;

    return (
      <Card className="border border-destructive/20 bg-destructive/5 my-6">
        <CardContent className="p-8 text-center space-y-3">
          <ShieldAlert className="h-10 w-10 mx-auto text-destructive" />
          <h3 className="text-lg font-bold text-foreground">Role Restrict Access</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Your user account role does not have sufficient privileges to access this area.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
