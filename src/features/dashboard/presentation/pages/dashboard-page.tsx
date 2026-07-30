"use client";
// ==============================================================================
// features/dashboard/presentation/pages/dashboard-page.tsx
// Main Dashboard Page Component
// ==============================================================================
import { useTranslations } from "next-intl";
import { ErrorBoundary } from "@shared/components/error-boundary";
import { DashboardStats } from "../components/dashboard-stats";
import { DashboardCharts } from "../components/dashboard-charts";
import { DashboardTables } from "../components/dashboard-tables";
import { RecentActivity } from "../components/recent-activity";
import { QuickActions } from "../components/quick-actions";

export function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Quick Actions Bar */}
      <QuickActions />

      {/* KPI Stats Cards */}
      <ErrorBoundary>
        <DashboardStats />
      </ErrorBoundary>

      {/* Charts Grid */}
      <ErrorBoundary>
        <DashboardCharts />
      </ErrorBoundary>

      {/* Tables & Activity Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <DashboardTables />
          </ErrorBoundary>
        </div>

        <div>
          <ErrorBoundary>
            <RecentActivity />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
