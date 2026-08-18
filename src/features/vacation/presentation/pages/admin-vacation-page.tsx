// ==============================================================================
// features/vacation/presentation/pages/admin-vacation-page.tsx
// Admin Page for managing all employee vacation requests
// ==============================================================================

"use client";

import { useState } from "react";
import { Button } from "@shared/ui";
import { PlusCircle, CalendarCheck, RefreshCw } from "lucide-react";
import { useAdminVacationRequests } from "../hooks/use-vacation";
import { AdminVacationTable } from "../components/admin/admin-vacation-table";
import { AdminCreateVacationDialog } from "../components/admin/admin-create-vacation-dialog";
import { Can } from "@features/roles-permissions/presentation/components";

export function AdminVacationPage() {
  const [activeStatus, setActiveStatus] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    data: requests = [],
    isLoading,
    refetch,
    isRefetching,
  } = useAdminVacationRequests(activeStatus === "all" ? undefined : activeStatus);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-primary" />
            Vacation & Leave Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review pending employee requests, approve or reject leaves, and log company vacations.
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
            Refresh
          </Button>

          <Can access="vacation:manage">
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="text-xs h-9 gap-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              Record Vacation
            </Button>
          </Can>
        </div>
      </div>

      {/* Requests Table */}
      <AdminVacationTable
        requests={requests}
        isLoading={isLoading}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />

      {/* Admin Record Vacation Modal */}
      <AdminCreateVacationDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
