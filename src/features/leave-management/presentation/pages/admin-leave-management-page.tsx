"use client";
// ==============================================================================
// features/leave-management/presentation/pages/admin-leave-management-page.tsx
// Admin Leave Management Page (Requires leave:manage permission)
// ==============================================================================

import { useState } from "react";
import {
  AdminLeaveRequestsTable,
  AdminLeavePoliciesCard,
  AdminLeaveBalancesCard,
} from "../components";
import { Tabs, TabsContent, TabsList, TabsTrigger, Card, CardContent } from "@shared/ui";
import { ShieldCheck, FileCheck, PieChart, ShieldAlert, Lock } from "lucide-react";
import { usePermission } from "@features/roles-permissions/presentation/hooks/use-permission";

export function AdminLeaveManagementPage() {
  const { hasPermission, isLoading: isLoadingAuth } = usePermission();
  const [activeTab, setActiveTab] = useState("requests");

  const canManageLeave = hasPermission("leave", "manage") || hasPermission("leave:manage");

  if (!isLoadingAuth && !canManageLeave) {
    return (
      <Card className="max-w-xl mx-auto my-12 border-destructive/20 bg-destructive/5 text-center p-8">
        <div className="p-3.5 rounded-full bg-destructive/10 text-destructive w-fit mx-auto mb-3">
          <Lock className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Access Restricted</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          You do not have the necessary <strong>leave:manage</strong> permission to access Admin Leave Management.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <ShieldCheck className="h-7 w-7 text-primary" />
          Leave & Absence Administration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review company leave applications, monitor employee balances, and audit leave policies.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full sm:w-[480px] h-10 p-1 bg-muted/60">
          <TabsTrigger value="requests" className="text-xs font-semibold gap-1.5">
            <FileCheck className="h-3.5 w-3.5" />
            Requests Review
          </TabsTrigger>
          <TabsTrigger value="balances" className="text-xs font-semibold gap-1.5">
            <PieChart className="h-3.5 w-3.5" />
            Employee Balances
          </TabsTrigger>
          <TabsTrigger value="policies" className="text-xs font-semibold gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5" />
            Policies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <AdminLeaveRequestsTable />
        </TabsContent>

        <TabsContent value="balances" className="space-y-4">
          <AdminLeaveBalancesCard />
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <AdminLeavePoliciesCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
