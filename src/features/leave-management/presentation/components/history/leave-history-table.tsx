"use client";
// ==============================================================================
// features/leave-management/presentation/components/history/leave-history-table.tsx
// My Leave History table with search, status filters, and cancel request action
// ==============================================================================

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui";
import {
  History,
  PlusCircle,
  Search,
  Filter,
  Ban,
  Loader2,
  Calendar,
  AlertTriangle,
  FileText,
  RotateCcw,
} from "lucide-react";
import { LeaveStatusBadge } from "../shared/leave-status-badge";
import { NoEmployeeProfileAlert } from "../shared/no-employee-profile-alert";
import { useMyLeaveHistory, useCancelMyLeaveRequest } from "../../hooks/use-leave";
import type { LeaveRequestEntity } from "../../../domain/entities";

export function LeaveHistoryTable() {
  const locale = useLocale();

  const { data: requests = [], isLoading, error, refetch } = useMyLeaveHistory();
  const cancelMutation = useCancelMyLeaveRequest();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cancellingRequest, setCancellingRequest] = useState<LeaveRequestEntity | null>(null);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter !== "all" && req.status !== statusFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const typeMatch = req.leaveType?.name.toLowerCase().includes(q);
        const noteMatch = req.note?.toLowerCase().includes(q);
        const dateMatch = req.fromDate.includes(q) || req.toDate.includes(q);
        if (!typeMatch && !noteMatch && !dateMatch) return false;
      }
      return true;
    });
  }, [requests, statusFilter, search]);

  const handleConfirmCancel = async () => {
    if (!cancellingRequest) return;
    await cancelMutation.mutateAsync(cancellingRequest.id);
    setCancellingRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Header card with filters */}
      <Card className="shadow-xs border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                My Leave History
              </CardTitle>
              <CardDescription>
                Track the status and timeline of all your submitted vacation and leave applications.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="gap-2 shadow-xs">
              <Link href={`/${locale}/admin/leave/apply`}>
                <PlusCircle className="h-4 w-4" />
                Apply for Leave
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by leave type, note, date..."
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
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-end">
              {(search || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
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
          ) : error &&
            (error.message.toLowerCase().includes("employee profile not found") ||
              error.message.toLowerCase().includes("profile not found") ||
              error.message.toLowerCase().includes("no employee")) ? (
            <div className="p-6">
              <NoEmployeeProfileAlert message={error.message} />
            </div>
          ) : error ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-sm text-destructive">
                {error instanceof Error ? error.message : "Failed to load leave history."}
              </p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="p-3 rounded-full bg-muted w-fit mx-auto mb-3 text-muted-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <h4 className="text-base font-semibold text-foreground">No leave records found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                {search || statusFilter !== "all"
                  ? "No leave requests matched your filter criteria."
                  : "You haven't submitted any leave requests yet."}
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href={`/${locale}/admin/leave/apply`}>Submit an Application</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 text-xs font-semibold hover:bg-muted/40">
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes & Review</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-end">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => {
                    const durationText =
                      request.requestUnit === "hour"
                        ? `${request.requestedHours ?? 0} Hours`
                        : `${request.requestedDays ?? 0} Days`;

                    const isPending = request.status === "pending";

                    return (
                      <TableRow key={request.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-semibold text-sm">
                          <span className="text-foreground">{request.leaveType?.name || "Leave"}</span>
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
                        <TableCell>
                          <LeaveStatusBadge status={request.status} />
                        </TableCell>
                        <TableCell className="text-xs max-w-xs">
                          <div className="space-y-1">
                            {request.note && (
                              <p className="text-muted-foreground line-clamp-1 italic">
                                &ldquo;{request.note}&rdquo;
                              </p>
                            )}
                            {request.reviewerNote && (
                              <p className="text-primary font-medium text-[11px]">
                                Reviewer: {request.reviewerNote}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-end">
                          {isPending && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCancellingRequest(request)}
                              className="text-xs h-7 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 gap-1"
                            >
                              <Ban className="h-3 w-3" />
                              Cancel
                            </Button>
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

      {/* Confirmation Dialog for Cancelling Leave Request */}
      <Dialog
        open={!!cancellingRequest}
        onOpenChange={(open) => !open && setCancellingRequest(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Cancel Leave Request
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this pending leave request for{" "}
              <strong>{cancellingRequest?.leaveType?.name}</strong> (
              {cancellingRequest?.fromDate} to {cancellingRequest?.toDate})?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setCancellingRequest(null)}
              disabled={cancelMutation.isPending}
            >
              Keep Request
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={cancelMutation.isPending}
              className="gap-2"
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
