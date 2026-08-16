// ==============================================================================
// features/leave-management/presentation/components/dashboard/recent-leave-requests.tsx
// Table/Card list of recent employee leave requests with CTA
// ==============================================================================

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from "@shared/ui";
import { PlusCircle, CalendarDays, History, ArrowRight } from "lucide-react";
import { LeaveStatusBadge } from "../shared/leave-status-badge";
import type { LeaveRequestEntity } from "../../../domain/entities";

interface RecentLeaveRequestsProps {
  requests?: LeaveRequestEntity[];
  isLoading?: boolean;
}

export function RecentLeaveRequests({ requests = [], isLoading }: RecentLeaveRequestsProps) {
  const locale = useLocale();

  if (isLoading) {
    return (
      <Card className="shadow-xs border">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xs border overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b bg-card/50 pb-4">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            Recent Leave Requests
          </CardTitle>
          <CardDescription>Overview of your most recently submitted leave applications</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
            <Link href={`/${locale}/admin/leave/history`}>
              <History className="h-3.5 w-3.5" />
              View Full History
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 text-xs shadow-xs">
            <Link href={`/${locale}/admin/leave/apply`}>
              <PlusCircle className="h-3.5 w-3.5" />
              Apply for Leave
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="p-3.5 rounded-full bg-primary/10 text-primary mb-3">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h4 className="text-base font-semibold text-foreground">No leave requests yet</h4>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
              You haven&apos;t submitted any leave applications yet. Ready to take time off?
            </p>
            <Button asChild size="sm" className="gap-2">
              <Link href={`/${locale}/admin/leave/apply`}>
                <PlusCircle className="h-4 w-4" />
                Apply for Leave
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 text-xs font-semibold hover:bg-muted/40">
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration / Dates</TableHead>
                  <TableHead>Days / Hours</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.slice(0, 5).map((request) => {
                  const durationText =
                    request.requestUnit === "hour"
                      ? `${request.requestedHours ?? 0} Hours`
                      : `${request.requestedDays ?? 0} Days`;

                  return (
                    <TableRow key={request.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-sm">
                        <div className="flex flex-col">
                          <span className="text-foreground">{request.leaveType?.name || "Leave"}</span>
                          {request.note && (
                            <span className="text-xs text-muted-foreground line-clamp-1 italic max-w-xs">
                              &ldquo;{request.note}&rdquo;
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col">
                          <span className="font-mono text-foreground font-medium">
                            {request.fromDate} <span className="text-muted-foreground font-sans">to</span> {request.toDate}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-mono">
                          {durationText}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {request.returnToWorkDate || "—"}
                      </TableCell>
                      <TableCell>
                        <LeaveStatusBadge status={request.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "—"}
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
