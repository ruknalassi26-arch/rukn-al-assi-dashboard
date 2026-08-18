"use client";
// ==============================================================================
// features/vacation/presentation/components/employee/vacation-history-table.tsx
// Table showing employee's vacation and leave request history with pagination
// ==============================================================================

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Skeleton,
} from "@shared/ui";
import { CheckCircle, XCircle, Clock, Ban, X } from "lucide-react";
import { DataTablePagination } from "@shared/components";
import type { VacationRequestEntity } from "../../../domain/entities/vacation.entity";
import { useCancelVacationRequest } from "../../hooks/use-vacation";

interface VacationHistoryTableProps {
  requests: VacationRequestEntity[];
  isLoading: boolean;
  limit?: number;
}

const PAGE_SIZE = 10;

function formatDisplayDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function VacationHistoryTable({
  requests,
  isLoading,
  limit,
}: VacationHistoryTableProps) {
  const [page, setPage] = useState(1);
  const cancelMutation = useCancelVacationRequest();

  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
  const displayRequests = limit
    ? requests.slice(0, limit)
    : requests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 gap-1 text-[10px]">
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1 text-[10px]">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary" className="gap-1 text-[10px] text-muted-foreground">
            <Ban className="h-3 w-3" /> Cancelled
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 gap-1 text-[10px]">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
    }
  };

  const handleCancel = (requestId: string) => {
    if (window.confirm("Are you sure you want to cancel this vacation request?")) {
      cancelMutation.mutate(requestId);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-semibold">Leave Type</TableHead>
              <TableHead className="text-xs font-semibold">Period</TableHead>
              <TableHead className="text-xs font-semibold text-center">Days</TableHead>
              <TableHead className="text-xs font-semibold">Return to Work</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Note / Response</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="py-3">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : displayRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                  No vacation requests found.
                </TableCell>
              </TableRow>
            ) : (
              displayRequests.map((req) => {
                const leaveTypeName =
                  typeof req.vacationType === "object"
                    ? req.vacationType?.name
                    : req.vacationType || "Vacation";

                return (
                  <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                    {/* Type */}
                    <TableCell className="text-xs font-medium">
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {leaveTypeName}
                      </Badge>
                    </TableCell>

                    {/* Period */}
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {formatDisplayDate(req.fromDate)} → {formatDisplayDate(req.toDate)}
                    </TableCell>

                    {/* Duration */}
                    <TableCell className="text-xs font-bold text-center">
                      {req.requestedDays}
                    </TableCell>

                    {/* Return to Work */}
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {formatDisplayDate(req.returnToWorkDate)}
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getStatusBadge(req.status)}</TableCell>

                    {/* Notes */}
                    <TableCell className="text-xs max-w-[220px]">
                      {req.reviewerNote ? (
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-muted-foreground block">Reviewer:</span>
                          <p className="italic text-foreground line-clamp-2">
                            &quot;{req.reviewerNote}&quot;
                          </p>
                        </div>
                      ) : req.note ? (
                        <p className="text-muted-foreground line-clamp-1 truncate">{req.note}</p>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">—</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      {req.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                          disabled={cancelMutation.isPending}
                          onClick={() => handleCancel(req.id)}
                        >
                          <X className="h-3.5 w-3.5" /> Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!limit && requests.length > PAGE_SIZE && (
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          totalItems={requests.length}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
