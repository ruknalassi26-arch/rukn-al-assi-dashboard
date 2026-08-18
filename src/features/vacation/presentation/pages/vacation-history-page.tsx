// ==============================================================================
// features/vacation/presentation/pages/vacation-history-page.tsx
// Full history of vacation & time-off requests for employee
// ==============================================================================

"use client";

import Link from "next/link";
import { Button } from "@shared/ui";
import { ArrowLeft, PlusCircle, RefreshCw, History } from "lucide-react";
import { useMyVacationDashboard } from "../hooks/use-vacation";
import { VacationHistoryTable } from "../components/employee/vacation-history-table";

export function VacationHistoryPage() {
  const { data: dashboard, isLoading, refetch, isRefetching } = useMyVacationDashboard();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/employee/vacation">
            <Button variant="ghost" size="sm" className="gap-1 text-xs h-7 px-2 -ml-2 text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            Vacation Request History
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete list of all your submitted leave requests and reviewer decisions.
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

          <Link href="/employee/vacation/apply">
            <Button size="sm" className="text-xs h-9 gap-1.5">
              <PlusCircle className="h-4 w-4" />
              Apply for Leave
            </Button>
          </Link>
        </div>
      </div>

      <VacationHistoryTable
        requests={dashboard?.recentRequests || []}
        isLoading={isLoading}
      />
    </div>
  );
}
