"use client";
// ==============================================================================
// features/notifications/presentation/components/notification-card.tsx
// Notification item card component with Mark Read & Delete controls
// ==============================================================================
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FileText, Mail, ShieldAlert, AlertTriangle, UserCheck, Check, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent, Badge, Button } from "@shared/ui";
import type { NotificationEntity, NotificationType } from "../../domain/entities/notification.entity";
import {
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} from "@shared/hooks/notifications/use-notifications-hooks";

interface NotificationCardProps {
  notification: NotificationEntity;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const locale = useLocale();
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");
  const markAsRead = useMarkNotificationAsReadMutation();
  const deleteMutation = useDeleteNotificationMutation();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "rfq_new":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "contact_new":
        return <Mail className="h-5 w-5 text-blue-500" />;
      case "email_failure":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "admin_login":
        return <UserCheck className="h-5 w-5 text-emerald-500" />;
      case "system":
      default:
        return <ShieldAlert className="h-5 w-5 text-primary" />;
    }
  };

  const titleText = t.has(`titles.${notification.type}`) ? t(`titles.${notification.type}`) : notification.title;
  const typeLabelText = t.has(`typeLabels.${notification.type}`) ? t(`typeLabels.${notification.type}`) : notification.typeLabel;

  const getLocalizedMessage = () => {
    const rawMsg = notification.message ?? "";
    if (notification.type === "admin_login" || rawMsg.toLowerCase().includes("logged into") || rawMsg.toLowerCase().includes("admin login")) {
      if (locale === "ar") return "تم تسجيل دخول المسؤول إلى لوحة التحكم بنجاح.";
      if (locale === "ckb") return "چوونه‌ژووره‌وه‌ی بەڕێوەبەر بۆ تابلۆی کۆنترۆڵ بەسەرکەوتوویی ئەنجامدرا.";
    }
    if (notification.type === "rfq_new" || rawMsg.toLowerCase().includes("rfq") || rawMsg.toLowerCase().includes("quotation")) {
      if (locale === "ar") return "تم استلام طلب عرض سعر جديد عبر ماڵپەڕ.";
      if (locale === "ckb") return "داواکاری نرخی نوێ لەلایەن کڕیارێکەوە وەرگیرا.";
    }
    if (notification.type === "contact_new" || rawMsg.toLowerCase().includes("contact") || rawMsg.toLowerCase().includes("message")) {
      if (locale === "ar") return "تم استلام رسالة تواصل جديدة من أحد الزوار.";
      if (locale === "ckb") return "پەیامی پەیوەندیکردنی نوێ لە رێگەی ماڵپەڕەوە وەرگیرا.";
    }
    if (notification.type === "email_failure" || rawMsg.toLowerCase().includes("email failure") || rawMsg.toLowerCase().includes("failed")) {
      if (locale === "ar") return "تنبيه: تعذر تسليم البريد الإلكتروني بنجاح.";
      if (locale === "ckb") return "ئاگاداری: شکست لە ناردنی ئیمەیڵ.";
    }
    return rawMsg;
  };

  return (
    <Card
      className={`border transition-all hover:shadow-xs relative overflow-hidden ${
        notification.isRead ? "bg-card/70 border-border/60" : "bg-primary/5 border-primary/20 shadow-2xs"
      }`}
    >
      <CardContent className="p-4 flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="p-2.5 rounded-xl bg-muted/60 shrink-0 mt-0.5 border">
            {getIcon(notification.type)}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-sm font-bold truncate ${notification.isRead ? "text-foreground" : "text-primary"}`}>
                {titleText}
              </span>
              <Badge variant={notification.badgeVariant} className="text-[10px] font-medium">
                {typeLabelText}
              </Badge>
              {!notification.isRead && (
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                  {t("new")}
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{getLocalizedMessage()}</p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1">
              <span>{notification.timeAgo}</span>
              {notification.link && (
                <Link
                  href={`/${locale}${notification.link}`}
                  className="text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <span>{t("viewRelated")}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 self-end sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
          {!notification.isRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAsRead.mutate(notification.id)}
              disabled={markAsRead.isPending}
              className="gap-1.5 text-xs h-8"
              title={t("read")}
            >
              <Check className="h-3.5 w-3.5" />
              <span>{t("read")}</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate(notification.id)}
            disabled={deleteMutation.isPending}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title={tCommon("delete")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
