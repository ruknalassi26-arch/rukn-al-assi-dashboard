"use client";
// ==============================================================================
// features/dashboard/presentation/components/dashboard-header.tsx
// Header controls with Title, Refresh Button, and Last Updated Timestamp
// ==============================================================================
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { RotateCw, LayoutDashboard } from "lucide-react";
import { Button } from "@shared/ui";
import { useRefetchDashboard } from "@shared/hooks/dashboard/use-dashboard-hooks";
import { toast } from "sonner";

export function DashboardHeader() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const refetchAll = useRefetchDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchAll();
      setLastUpdated(new Date());
      toast.success("Dashboard analytics refreshed");
    } catch {
      toast.error("Failed to refresh dashboard data");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const formattedTime = new Intl.DateTimeFormat(locale === "ar" ? "ar" : locale === "ckb" ? "ckb" : "en-US", {
    timeStyle: "short",
  }).format(lastUpdated);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl flex items-center gap-2.5">
          <LayoutDashboard className="h-7 w-7 text-primary" />
          {t("title")}
        </h1>
        <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
          {tCommon("date")}: <span className="text-foreground font-semibold">{formattedTime}</span>
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 text-xs"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          <span>{tCommon("retry")}</span>
        </Button>
      </div>
    </div>
  );
}
