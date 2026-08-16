"use client";
// ==============================================================================
// features/leave-management/presentation/components/admin/admin-leave-requests-table.tsx
// Admin table for managing and reviewing company-wide employee leave requests
// ==============================================================================

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Badge,
} from "@shared/ui";
import {
  Search,
  Filter,
  CheckSquare,
  RotateCcw,
  Calendar,
  Layers,
  User,
  Clock,
  FileCheck,
} from "lucide-react";
import { LeaveStatusBadge } from "../shared/leave-status-badge";
import { AdminReviewModal } from "./admin-review-modal";
import { useAdminLeaveRequests, useActiveLeaveTypes } from "../../hooks/use-leave";
import type { LeaveRequestEntity } from "../../../domain/entities";

export function AdminLeaveRequestsTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [selectedRequestForReview, setSelectedRequestForReview] = useState<LeaveRequestEntity | null>(null);

  const { data: leaveTypes = [] } = useActiveLeaveTypes();

  const filterParams = useMemo(() => {
    return {
      search: search.trim() || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      leaveTypeId: leaveTypeFilter !== "all" ? leaveTypeFilter : undefined,
    };
  }, [search, statusFilter, leaveTypeFilter]);

  const { data: requests = [], isLoading, error, refetch } = useAdminLeaveRequests(filterParams);

  const pendingCount = useMemo(() => {
    return requests.filter((r) => r.status === "pending").length;
  }, [requests]);

  return (
    <div className="space-y-6">
      <Card className="shadow-xs border overflow-hidden">
        <CardHeader className="pb-4 border-b bg-card/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Leave Applications
                </CardTitle>
                {pendingCount > 0 && (
                  <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 animate-pulse">
                    {pendingCount} Pending Review
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-1">
                Review, approve, or reject employee time-off and vacation requests across all departments.
              </CardDescription>
            </div>
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee, email, notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="All Statuses" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending Only</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="All Leave Types" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leave Types</SelectItem>
                  {leaveTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-end">
              {(search || statusFilter !== "all" || leaveTypeFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setLeaveTypeFilter("all");
                  }}
                  className="text-xs h-9 gap-1.5 text-muted-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset Filters
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-sm text-destructive">
                {error instanceof Error ? error.message : "Failed to load leave requests."}
              </p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : requests.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="p-3 rounded-full bg-muted w-fit mx-auto mb-3 text-muted-foreground">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h4 className="text-base font-semibold text-foreground">No leave applications found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                {search || statusFilter !== "all" || leaveTypeFilter !== "all"
                  ? "No records matched your search filters."
                  : "No leave requests have been submitted yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 text-xs font-semibold hover:bg-muted/40">
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Covering Colleague</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-end">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => {
                    const durationText =
                      request.requestUnit === "hour"
                        ? `${request.requestedHours ?? 0} Hours`
                        : `${request.requestedDays ?? 0} Days`;

                    const isPending = request.status === "pending";

                    return (
                      <TableRow key={request.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium text-sm">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                              {request.employee?.fullName || "Employee"}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {request.employee?.department || "General"}
                              {request.employee?.email ? ` • ${request.employee.email}` : ""}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-medium text-foreground">
                            {request.leaveType?.name || "Leave"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                            {durationText}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex flex-col font-mono text-muted-foreground">
                            <span className="text-foreground font-medium">{request.fromDate}</span>
                            <span>to {request.toDate}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {request.returnToWorkDate || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {request.alternativeEmployee?.fullName || "—"}
                        </TableCell>
                        <TableCell>
                          <LeaveStatusBadge status={request.status} />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-end">
                          {isPending ? (
                            <Button
                              size="sm"
                              onClick={() => setSelectedRequestForReview(request)}
                              className="text-xs h-7 gap-1 shadow-xs bg-primary hover:bg-primary/90"
                            >
                              <CheckSquare className="h-3 w-3" />
                              Review
                            </Button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">
                              {request.status === "approved" ? "Approved" : request.status === "rejected" ? "Rejected" : "Cancelled"}
                            </span>
                          )}
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

      {/* Review Modal */}
      <AdminReviewModal
        request={selectedRequestForReview}
        isOpen={!!selectedRequestForReview}
        onClose={() => setSelectedRequestForReview(null)}
      />
    </div>
  );
}
