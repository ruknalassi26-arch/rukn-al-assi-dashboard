// ==============================================================================
// features/vacation/presentation/components/employee/balance-cards.tsx
// Vacation balance cards & summary metrics for employee
// ==============================================================================

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@shared/ui";
import { Calendar, Clock, CheckCircle2, XCircle, Sparkles, Umbrella } from "lucide-react";
import type {
  VacationBalanceEntity,
  MyVacationDashboardEntity,
} from "../../../domain/entities/vacation.entity";

interface BalanceCardsProps {
  dashboard: MyVacationDashboardEntity | undefined;
  isLoading: boolean;
}

export function BalanceCards({ dashboard, isLoading }: BalanceCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const primaryBalance = dashboard?.balances?.[0];
  const remainingDays = primaryBalance?.remaining ?? 0;
  const allocatedDays = primaryBalance?.allocated ?? 0;
  const usedDays = primaryBalance?.used ?? 0;
  const pendingDays = primaryBalance?.pending ?? 0;

  const summary = dashboard?.summary || {
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  };

  return (
    <div className="space-y-4">
      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Remaining Balance Card */}
        <Card className="border-l-4 border-l-primary shadow-sm bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Remaining Balance
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Umbrella className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {remainingDays} <span className="text-sm font-normal text-muted-foreground">Days</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Out of {allocatedDays} days allocated this cycle
            </p>
          </CardContent>
        </Card>

        {/* Used Days */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Used Days
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {usedDays} <span className="text-sm font-normal text-muted-foreground">Days</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {summary.approved} approved request{summary.approved !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Approval
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {pendingDays} <span className="text-sm font-normal text-muted-foreground">Days</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {summary.pending} request{summary.pending !== 1 ? "s" : ""} under review
            </p>
          </CardContent>
        </Card>

        {/* Total Requests Made */}
        <Card className="border-l-4 border-l-slate-400 dark:border-l-slate-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Request Activity
            </CardTitle>
            <div className="p-2 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {summary.pending + summary.approved + summary.rejected + summary.cancelled}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {summary.approved} Approved • {summary.rejected} Rejected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Multiple Policy breakdown (if more than 1 balance) */}
      {(dashboard?.balances?.length ?? 0) > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {dashboard?.balances.map((b) => (
            <div
              key={b.id}
              className="rounded-lg border bg-card p-3 flex items-center justify-between shadow-xs"
            >
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  {b.vacationType?.name || "Leave"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Valid: {b.periodStart} → {b.periodEnd}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-primary block">{b.remaining} Days left</span>
                <span className="text-[10px] text-muted-foreground">Allocated: {b.allocated}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
