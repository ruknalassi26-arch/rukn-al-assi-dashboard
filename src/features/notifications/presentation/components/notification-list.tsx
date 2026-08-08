"use client";
// ==============================================================================
// features/notifications/presentation/components/notification-list.tsx
// Paginated Notification Stream List with Skeletons, Error & Empty States
// ==============================================================================
import { useTranslations } from "next-intl";
import {
  Skeleton,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui";
import { useNotificationStore } from "../stores/notification.store";
import { useNotificationsQuery } from "@shared/hooks/notifications/use-notifications-hooks";
import { ErrorState } from "@shared/components/error-state";
import { NotificationCard } from "./notification-card";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";

export function NotificationList() {
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");
  const { search, type, readStatus, page, pageSize, setPage, setPageSize } = useNotificationStore();

  const { data, isLoading, error, refetch } = useNotificationsQuery({
    search,
    type,
    readStatus,
    page,
    pageSize,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load notifications" error={error} onRetry={() => refetch()} />;
  }

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed rounded-xl bg-card/50 space-y-3">
          <Bell className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">{t("emptyTitle")}</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {t("emptyDesc")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <NotificationCard key={item.id} notification={item} />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-xl bg-card shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{tCommon("pagination.showingPage")}</span>
            <span className="font-semibold text-foreground">
              {(page - 1) * pageSize + 1}
            </span>
            <span>{tCommon("pagination.to")}</span>
            <span className="font-semibold text-foreground">
              {Math.min(page * pageSize, total)}
            </span>
            <span>{tCommon("pagination.of")}</span>
            <span className="font-semibold text-foreground">{total}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">{tCommon("pagination.rowsPerPage")}:</span>
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

            {/* Page Buttons */}
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
      )}
    </div>
  );
}
