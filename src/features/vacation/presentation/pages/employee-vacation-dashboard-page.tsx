// ==============================================================================
// features/vacation/presentation/pages/employee-vacation-dashboard-page.tsx
// Vacation Dashboard for Employees (Balance, Quick Request, Recent History)
// ==============================================================================

"use client";

import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@shared/ui";
import { PlusCircle, History, Umbrella, ArrowRight, RefreshCw } from "lucide-react";
import { useMyVacationDashboard } from "../hooks/use-vacation";
import { BalanceCards } from "../components/employee/balance-cards";
import { VacationHistoryTable } from "../components/employee/vacation-history-table";

export function EmployeeVacationDashboardPage() {
  const { data: dashboard, isLoading, refetch, isRefetching } = useMyVacationDashboard();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Umbrella className="h-6 w-6 text-primary" />
            My Vacation & Leave
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track your leave balance, submit new time-off requests, and view approval status.
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

      {/* Balance Cards & Metrics */}
      <BalanceCards dashboard={dashboard} isLoading={isLoading} />

      {/* Recent Requests Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Recent Leave Requests
          </h2>

          <Link
            href="/employee/vacation/history"
            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
          >
            View All History <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <VacationHistoryTable
          requests={dashboard?.recentRequests || []}
          isLoading={isLoading}
          limit={5}
        />
      </div>
    </div>
  );
}
