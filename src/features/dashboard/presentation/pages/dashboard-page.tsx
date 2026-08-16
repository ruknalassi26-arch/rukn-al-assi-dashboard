"use client";
// ==============================================================================
// features/dashboard/presentation/pages/dashboard-page.tsx
// Main Dashboard Page Component with Website Analytics Section
// ==============================================================================
import { ErrorBoundary } from "@shared/components/error-boundary";
import { DashboardHeader } from "../components/dashboard-header";
import { QuickActions } from "../components/quick-actions";
import { DashboardStats } from "../components/dashboard-stats";
import { DashboardCharts } from "../components/dashboard-charts";
import { DashboardTables } from "../components/dashboard-tables";
import { RecentActivity } from "../components/recent-activity";
import { WebsiteAnalyticsSection } from "@features/analytics/presentation/components/website-analytics-section";

export function DashboardPage() {
  return (
    <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Dashboard Header controls */}
      <DashboardHeader />

      {/* Quick Actions Bar */}
      <QuickActions />

      {/* 8 KPI Stats Widgets Grid */}
      <ErrorBoundary>
        <DashboardStats />
      </ErrorBoundary>

      {/* Website Traffic & Visitor Analytics powered by page_views */}
      <ErrorBoundary>
        <WebsiteAnalyticsSection />
      </ErrorBoundary>

      {/* RFQ & Contact Trend Charts */}
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
