// ==============================================================================
// features/leave-management/presentation/components/dashboard/leave-balances-breakdown.tsx
// Breakdown card for employee leave type balances
// ==============================================================================

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "@shared/ui";
import { Layers, PieChart } from "lucide-react";
import type { LeaveBalanceEntity } from "../../../domain/entities";

interface LeaveBalancesBreakdownProps {
  balances?: LeaveBalanceEntity[];
  isLoading?: boolean;
}

export function LeaveBalancesBreakdown({ balances = [], isLoading }: LeaveBalancesBreakdownProps) {
  if (isLoading) {
    return (
      <Card className="shadow-xs">
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-3 w-60" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (balances.length === 0) {
    return (
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Leave Balances
          </CardTitle>
          <CardDescription>Your current leave entitlements per category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-xl bg-muted/20">
            No specific leave balances allocated for the current period yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xs border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Leave Category Balances
            </CardTitle>
            <CardDescription>Your current entitlements and utilization</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {balances.map((balance) => {
            const unit = balance.leaveType?.unit === "hour" ? "Hours" : "Days";
            const percentUsed =
              balance.allocatedAmount > 0
                ? Math.min(100, Math.round(((balance.usedAmount + balance.pendingAmount) / balance.allocatedAmount) * 100))
                : 0;

            return (
              <div
                key={balance.id}
                className="p-4 rounded-xl border bg-card/60 hover:bg-card transition-all duration-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      {balance.leaveType?.name || "Leave Type"}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Period: {balance.periodStart || "—"} to {balance.periodEnd || "—"}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                    {balance.remainingAmount} {unit} left
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${balance.allocatedAmount > 0 ? (balance.usedAmount / balance.allocatedAmount) * 100 : 0}%`,
                      }}
                      title={`Used: ${balance.usedAmount} ${unit}`}
                    />
                    <div
                      className="bg-amber-500 transition-all duration-500"
                      style={{
                        width: `${balance.allocatedAmount > 0 ? (balance.pendingAmount / balance.allocatedAmount) * 100 : 0}%`,
                      }}
                      title={`Pending: ${balance.pendingAmount} ${unit}`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span>Allocated: {balance.allocatedAmount} {unit}</span>
                    <span>Used: {balance.usedAmount}</span>
                    {balance.pendingAmount > 0 && <span className="text-amber-500">Pending: {balance.pendingAmount}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
