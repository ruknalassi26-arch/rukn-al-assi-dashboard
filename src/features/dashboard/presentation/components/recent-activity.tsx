"use client";
// ==============================================================================
// features/dashboard/presentation/components/recent-activity.tsx
// Activity log timeline stream card
// ==============================================================================
import { useTranslations, useLocale } from "next-intl";
import { Activity, Shield, Package, Wrench, FileText, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Skeleton } from "@shared/ui";
import { useRecentActivity } from "@shared/hooks/dashboard/use-dashboard-hooks";
import { ErrorState } from "@shared/components/error-state";

export function RecentActivity() {
  const t = useTranslations("dashboard.activity");
  const locale = useLocale();
  const { data: activities, isLoading, error, refetch } = useRecentActivity(8);

  const getActionIcon = (entityType: string) => {
    switch (entityType.toLowerCase()) {
      case "product":
        return <Package className="h-3.5 w-3.5 text-blue-500" />;
      case "service":
        return <Wrench className="h-3.5 w-3.5 text-cyan-500" />;
      case "rfq":
        return <FileText className="h-3.5 w-3.5 text-orange-500" />;
      case "contact":
      case "contact-messages":
        return <Mail className="h-3.5 w-3.5 text-rose-500" />;
      case "auth":
        return <Shield className="h-3.5 w-3.5 text-emerald-500" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-primary" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar" : locale === "ckb" ? "ckb" : "en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorState title={t("errorTitle")} error={error} onRetry={() => refetch()} />;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          {t("title")}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t("emptyDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!activities || activities.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground border border-dashed rounded-lg">
            <Activity className="h-7 w-7 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold">{t("emptyTitle")}</p>
            <p className="text-[11px] text-muted-foreground">{t("emptyDescription")}</p>
          </div>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:start-3.5 before:w-0.5 before:bg-muted">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 relative z-10">
                <div className="p-1.5 rounded-full bg-background border shadow-xs shrink-0">
                  {getActionIcon(act.entityType)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground leading-tight truncate">
                    {act.action} — {act.entityTitle || act.entityType}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                    <span>{act.userEmail}</span>
                    <span>•</span>
                    <span>{formatDate(act.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
