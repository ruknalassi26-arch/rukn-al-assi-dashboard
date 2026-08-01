"use client";
// ==============================================================================
// features/activity-log/presentation/components/activity-log-table.tsx
// Data Table for Activity Logs with Sorting, Pagination, and View Details Drawer Trigger
// ==============================================================================
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui";
import { useActivityLogStore } from "../stores/activity-log.store";
import { useActivityLogsQuery } from "@shared/hooks/activity-log/use-activity-log-hooks";
import { ErrorState } from "@shared/components/error-state";
import { Activity, Eye, ChevronLeft, ChevronRight, ArrowUpDown, Clock, User, Globe, FileText } from "lucide-react";

export function ActivityLogTable() {
  const {
    search,
    action,
    entityType,
    startDate,
    endDate,
    page,
    pageSize,
    sortBy,
    sortOrder,
    setPage,
    setPageSize,
    setSorting,
    openDrawer,
  } = useActivityLogStore();

  const { data, isLoading, error, refetch } = useActivityLogsQuery({
    search,
    action,
    entityType,
    startDate,
    endDate,
    page,
    pageSize,
    sortBy,
    sortOrder,
  });

  const handleSort = (column: "created_at" | "action" | "entity_type" | "user_email") => {
    if (sortBy === column) {
      setSorting(column, sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSorting(column, "desc");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="border rounded-xl p-4 bg-card">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load activity logs" error={error} onRetry={() => refetch()} />;
  }

  const logs = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      <div className="border rounded-xl bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/40">
                {/* Action Column */}
                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleSort("action")}
                    className="flex items-center gap-1 text-xs font-bold hover:text-primary transition-colors"
                  >
                    <Activity className="h-3.5 w-3.5" />
                    <span>Action</span>
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </TableHead>

                {/* Entity Column */}
                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleSort("entity_type")}
                    className="flex items-center gap-1 text-xs font-bold hover:text-primary transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Entity Target</span>
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </TableHead>

                {/* User Column */}
                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleSort("user_email")}
                    className="flex items-center gap-1 text-xs font-bold hover:text-primary transition-colors"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>User Account</span>
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </TableHead>

                {/* IP Address */}
                <TableHead className="text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    IP Address
                  </span>
                </TableHead>

                {/* Timestamp Column */}
                <TableHead className="text-end">
                  <button
                    type="button"
                    onClick={() => handleSort("created_at")}
                    className="flex items-center gap-1 text-xs font-bold hover:text-primary transition-colors ms-auto"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Timestamp</span>
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </TableHead>

                {/* Action View Button */}
                <TableHead className="w-[100px] text-end">Details</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Activity className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-xs font-semibold text-foreground">No Activity Logs Found</p>
                      <p className="text-[11px] text-muted-foreground">
                        Try adjusting your search query or filter options.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                    {/* Action */}
                    <TableCell className="py-3">
                      <Badge variant={item.actionBadgeVariant} className="text-xs font-medium">
                        {item.actionFormattedLabel}
                      </Badge>
                    </TableCell>

                    {/* Entity */}
                    <TableCell className="py-3">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{item.entityFormattedLabel}</p>
                        {item.entityTitle && (
                          <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                            {item.entityTitle}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* User */}
                    <TableCell className="py-3">
                      <span className="text-xs text-foreground font-medium truncate max-w-[180px] block">
                        {item.userEmail || "System"}
                      </span>
                    </TableCell>

                    {/* IP */}
                    <TableCell className="py-3 font-mono text-[11px] text-muted-foreground">
                      {item.ipAddress || "N/A"}
                    </TableCell>

                    {/* Timestamp */}
                    <TableCell className="py-3 text-end text-[11px] text-muted-foreground whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3 text-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDrawer(item.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        title="View Log Details & Diff"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Server Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-muted/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Showing</span>
            <span className="font-semibold text-foreground">
              {total > 0 ? (page - 1) * pageSize + 1 : 0}
            </span>
            <span>to</span>
            <span className="font-semibold text-foreground">
              {Math.min(page * pageSize, total)}
            </span>
            <span>of</span>
            <span className="font-semibold text-foreground">{total}</span>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Rows:</span>
              <Select value={String(pageSize)} onValueChange={(val) => setPageSize(Number(val))}>
                <SelectTrigger className="h-8 w-16 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10" className="text-xs">10</SelectItem>
                  <SelectItem value="25" className="text-xs">25</SelectItem>
                  <SelectItem value="50" className="text-xs">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-semibold px-2">
                {page} / {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
