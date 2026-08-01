"use client";
// ==============================================================================
// features/notifications/presentation/pages/notifications-page.tsx
// Dedicated Notification Center Admin Page
// ==============================================================================
import { Bell, CheckCheck, ShieldCheck } from "lucide-react";
import { Button, Badge } from "@shared/ui";
import { NotificationFilters } from "../components/notification-filters";
import { NotificationList } from "../components/notification-list";
import {
  useUnreadNotificationsCountQuery,
  useMarkAllNotificationsAsReadMutation,
} from "@shared/hooks/notifications/use-notifications-hooks";

export function NotificationsPage() {
  const { data: unreadCount = 0 } = useUnreadNotificationsCountQuery();
  const markAllAsRead = useMarkAllNotificationsAsReadMutation();

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Bell className="h-7 w-7 text-primary" />
            Notification Center
          </h1>
          <p className="text-xs text-muted-foreground">
            Real-time notifications for RFQ inquiries, direct customer messages, system events, and logins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary border-primary/20">
              {unreadCount} Unread Notifications
            </Badge>
          )}

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="gap-2 text-xs h-9"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark All as Read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <NotificationFilters />

      {/* Paginated Stream List */}
      <NotificationList />
    </div>
  );
}
