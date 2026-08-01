"use client";
// ==============================================================================
// features/notifications/presentation/pages/notifications-page.tsx
// ==============================================================================
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { PermissionGuard } from "@features/roles-permissions/presentation/components";
import { NotificationFilters } from "../components/notification-filters";
import { NotificationList } from "../components/notification-list";

export function NotificationsPage() {
  const t = useTranslations("notifications");

  return (
    <PermissionGuard permission="dashboard:view">
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Bell className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("title")}</h1>
            </div>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        {/* Filters */}
        <NotificationFilters />

        {/* Notification Stream */}
        <NotificationList />
      </div>
    </PermissionGuard>
  );
}
