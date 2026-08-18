"use client";

import { useState } from "react";
import { Button } from "@shared/ui";
import { Users, RefreshCw, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAdminEmployees } from "../hooks/use-vacation";
import { EmployeeTable } from "../components/admin/employee-table";
import { InviteEmployeeDialog } from "../components/admin/invite-employee-dialog";

export function AdminEmployeesPage() {
  const t = useTranslations("employees");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { data: employees = [], isLoading, refetch, isRefetching } = useAdminEmployees();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
            {t("refresh")}
          </Button>

          <Button
            size="sm"
            onClick={() => setIsInviteOpen(true)}
            className="text-xs h-9 gap-1.5"
          >
            <UserPlus className="h-3.5 w-3.5" />
            {t("inviteEmployee")}
          </Button>
        </div>
      </div>

      {/* Directory Table */}
      <EmployeeTable employees={employees} isLoading={isLoading} />

      {/* Invite Employee Modal */}
      <InviteEmployeeDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
