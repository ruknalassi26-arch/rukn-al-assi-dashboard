"use client";
// ==============================================================================
// features/leave-management/presentation/components/admin/admin-leave-balances-card.tsx
// Admin overview of employee leave balances
// ==============================================================================

import { useState, useMemo } from "react";
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
  Input,
} from "@shared/ui";
import { PieChart, Search } from "lucide-react";
import { useAdminLeaveBalances } from "../../hooks/use-leave";

export function AdminLeaveBalancesCard() {
  const { data: balances = [], isLoading } = useAdminLeaveBalances();
  const [search, setSearch] = useState("");

  const filteredBalances = useMemo(() => {
    if (!search.trim()) return balances;
    const q = search.toLowerCase().trim();
    return balances.filter(
      (b) =>
        b.employee?.fullName.toLowerCase().includes(q) ||
        b.employee?.department?.toLowerCase().includes(q) ||
        b.leaveType?.name.toLowerCase().includes(q)
    );
  }, [balances, search]);

  return (
    <Card className="shadow-xs border">
      <CardHeader className="pb-3 border-b bg-card/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Employee Leave Balances
            </CardTitle>
            <CardDescription>
              Current allocated, used, and remaining balances per employee
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search employee or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filteredBalances.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            No employee leave balances found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 text-xs font-semibold hover:bg-muted/40">
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Allocated</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBalances.map((balance) => {
                  const unit = balance.leaveType?.unit === "hour" ? "hrs" : "days";

                  return (
                    <TableRow key={balance.id} className="hover:bg-muted/30 text-xs">
                      <TableCell className="font-semibold text-foreground">
                        <div className="flex flex-col">
                          <span>{balance.employee?.fullName || "Employee"}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {balance.employee?.department || "General"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {balance.leaveType?.name || "Leave"}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-[11px]">
                        {balance.periodStart} to {balance.periodEnd}
                      </TableCell>
                      <TableCell className="font-mono text-foreground">
                        {balance.allocatedAmount} {unit}
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {balance.usedAmount} {unit}
                      </TableCell>
                      <TableCell className="font-mono text-amber-500 font-medium">
                        {balance.pendingAmount > 0 ? `${balance.pendingAmount} ${unit}` : "—"}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {balance.remainingAmount} {unit}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
