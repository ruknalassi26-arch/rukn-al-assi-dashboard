"use client";
// ==============================================================================
// features/activity-log/presentation/components/activity-log-table.tsx
// Data Table for Activity Logs with Sorting, Pagination, and View Details Drawer Trigger
// ==============================================================================
import { useTranslations } from "next-intl";
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
  const t = useTranslations("activityLog");
  const tCommon = useTranslations("common");

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

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 bg-card border rounded-xl shadow-xs">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState title={tCommon("error")} error={error} onRetry={() => refetch()} />;
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
                    <span>{t("table.action")}</span>
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
                    <span>{t("table.entity")}</span>
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
                    <span>{t("table.user")}</span>
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </TableHead>

                {/* IP Address */}
                <TableHead className="text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    {t("table.ipAddress")}
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
                    <span>{t("table.timestamp")}</span>
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </TableHead>

                {/* Action View Button */}
                <TableHead className="w-[100px] text-end">{t("table.details")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Activity className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-xs font-semibold text-foreground">{t("table.emptyTitle")}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {t("table.emptyDesc")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.actionBadgeVariant} className="text-[10px] font-semibold uppercase">
                          {item.actionFormattedLabel}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground">{item.entityTitle || "—"}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-mono">
                          {item.entityType} #{item.entityId ? item.entityId.substring(0, 8) : "N/A"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-medium text-foreground">{item.userEmail || "—"}</span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-mono text-muted-foreground">{item.ipAddress || "—"}</span>
                    </TableCell>

                    <TableCell className="text-end">
                      <span className="text-xs text-muted-foreground font-mono">{item.formattedDate}</span>
                    </TableCell>

                    <TableCell className="text-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDrawer(item.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        title={t("table.details")}
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

        {/* Footer Pagination Bar */}
        {total > 0 && (
          <div className="flex items-center justify-between p-3 border-t bg-card text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>
                {tCommon("showing")} <strong className="text-foreground">{logs.length}</strong> {tCommon("of")}{" "}
                <strong className="text-foreground">{total}</strong> {tCommon("items")}
              </span>
              <Select value={String(pageSize)} onValueChange={(val) => setPageSize(Number(val))}>
                <SelectTrigger className="h-7 w-16 text-[11px] px-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10" className="text-xs">10</SelectItem>
                  <SelectItem value="25" className="text-xs">25</SelectItem>
                  <SelectItem value="50" className="text-xs">50</SelectItem>
                  <SelectItem value="100" className="text-xs">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="h-7 w-7"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[11px] font-semibold px-2">
                {tCommon("page")} {page} {tCommon("of")} {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="h-7 w-7"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
