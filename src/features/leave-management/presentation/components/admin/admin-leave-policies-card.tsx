"use client";
// ==============================================================================
// features/leave-management/presentation/components/admin/admin-leave-policies-card.tsx
// Admin overview of active leave policies
// ==============================================================================

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Badge,
} from "@shared/ui";
import { ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { useActiveLeavePolicies } from "../../hooks/use-leave";

export function AdminLeavePoliciesCard() {
  const { data: policies = [], isLoading } = useActiveLeavePolicies();

  return (
    <Card className="shadow-xs border">
      <CardHeader className="pb-3 border-b bg-card/50">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-primary" />
          Company Leave Policies
        </CardTitle>
        <CardDescription>
          Active entitlement rules and allocations configured per leave category
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : policies.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            No active leave policies configured.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 text-xs font-semibold hover:bg-muted/40">
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Allocation Amount</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Hours / Day</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id} className="hover:bg-muted/30 text-xs">
                    <TableCell className="font-semibold text-foreground">
                      {policy.leaveType?.name || "Leave Policy"}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-foreground">
                      {policy.allocationAmount} {policy.allocationUnit}s
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      Every {policy.periodMonths} Months
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono">
                      {policy.hoursPerDay} hrs/day
                    </TableCell>
                    <TableCell>
                      {policy.isActive ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-[10px]">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
