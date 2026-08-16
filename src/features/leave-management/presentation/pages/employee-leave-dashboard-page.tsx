"use client";
// ==============================================================================
// features/leave-management/presentation/pages/employee-leave-dashboard-page.tsx
// Employee Leave & Vacation Dashboard main page
// ==============================================================================

import {
  LeaveSummaryCards,
  LeaveBalancesBreakdown,
  RecentLeaveRequests,
  NoEmployeeProfileAlert,
} from "../components";
import { useMyLeaveDashboard } from "../hooks/use-leave";
import { Button } from "@shared/ui";
import { Calendar, PlusCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

export function EmployeeLeaveDashboardPage() {
  const locale = useLocale();
  const { data: dashboard, isLoading, error, refetch } = useMyLeaveDashboard();

  const isProfileMissing =
    error &&
    (error.message.toLowerCase().includes("employee profile not found") ||
      error.message.toLowerCase().includes("profile not found") ||
      error.message.toLowerCase().includes("no employee"));

  if (isProfileMissing) {
    return <NoEmployeeProfileAlert message={error.message} />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome & CTA Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Calendar className="h-7 w-7 text-primary" />
            Vacation & Leave Portal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your time off, monitor remaining balance, and track submitted leave requests.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5 text-xs shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button asChild size="sm" className="gap-1.5 text-xs shadow-xs">
            <Link href={`/${locale}/admin/leave/apply`}>
              <PlusCircle className="h-4 w-4" />
              Apply for Leave
            </Link>
          </Button>
        </div>
      </div>

      {/* Error state if generic error */}
      {error && !isProfileMissing && (
        <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span>Failed to load leave dashboard: {error.message}</span>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* 4 KPI Summary Cards */}
      <LeaveSummaryCards summary={dashboard?.summary} isLoading={isLoading} />

      {/* Balances Category Breakdown */}
      <LeaveBalancesBreakdown balances={dashboard?.balances} isLoading={isLoading} />

      {/* Recent Leave Applications */}
      <RecentLeaveRequests requests={dashboard?.recentRequests} isLoading={isLoading} />
    </div>
  );
}
