"use client";
// ==============================================================================
// features/notifications/presentation/components/notification-bell.tsx
// Header Notification Bell with Live Unread Counter & Quick Popover Menu
// ==============================================================================
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Bell, CheckCheck, FileText, Mail, ShieldAlert, AlertTriangle, UserCheck, ArrowRight, ExternalLink } from "lucide-react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Badge,
  ScrollArea,
} from "@shared/ui";
import {
  useUnreadNotificationsCountQuery,
  useNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useNotificationsRealtime,
} from "@shared/hooks/notifications/use-notifications-hooks";
import type { NotificationType } from "../../domain/entities/notification.entity";

export function NotificationBell() {
  const locale = useLocale();
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");

  // Active Realtime Listener
  useNotificationsRealtime();

  const { data: unreadCount = 0 } = useUnreadNotificationsCountQuery();
  const { data: notificationsData, isLoading } = useNotificationsQuery({ page: 1, pageSize: 5 });
  const markAsRead = useMarkNotificationAsReadMutation();
  const markAllAsRead = useMarkAllNotificationsAsReadMutation();

  const notifications = notificationsData?.items ?? [];

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "rfq_new":
        return <FileText className="h-4 w-4 text-orange-500" />;
      case "contact_new":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "email_failure":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "admin_login":
        return <UserCheck className="h-4 w-4 text-emerald-500" />;
      case "system":
      default:
        return <ShieldAlert className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9" title={t("bellTitle")}>
          <Bell className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 sm:w-96 p-0 shadow-lg border">
        {/* Popover Header */}
        <div className="flex items-center justify-between p-3.5 border-b bg-card">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-bold text-foreground">{t("bellTitle")}</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5">
                {unreadCount}
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-3 w-3" />
              <span>{t("markAllRead")}</span>
            </Button>
          )}
        </div>

        {/* Notification Stream Items */}
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">{tCommon("loading")}</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center space-y-1">
              <Bell className="h-6 w-6 mx-auto text-muted-foreground/40" />
              <p className="text-xs font-semibold text-muted-foreground">{t("emptyTitle")}</p>
              <p className="text-[11px] text-muted-foreground/80">{t("emptyDesc")}</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && markAsRead.mutate(item.id)}
                  className={`p-3 text-xs transition-colors flex items-start gap-3 cursor-pointer ${
                    item.isRead ? "bg-card hover:bg-muted/40" : "bg-primary/5 hover:bg-primary/10"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-muted/60 shrink-0 mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`font-semibold truncate ${item.isRead ? "text-foreground" : "text-primary"}`}>
                        {t.has(`titles.${item.type}`) ? t(`titles.${item.type}`) : item.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{item.timeAgo}</span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2">{item.message}</p>

                    {item.link && (
                      <Link
                        href={`/${locale}${item.link}`}
                        className="text-[11px] text-primary font-medium hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <span>{tCommon("viewAll")}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>

                  {!item.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" title="Unread" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Popover Footer */}
        <div className="p-2.5 border-t bg-muted/20 text-center">
          <Link
            href={`/${locale}/admin/notifications`}
            className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1.5"
          >
            <span>{t("viewAll")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
