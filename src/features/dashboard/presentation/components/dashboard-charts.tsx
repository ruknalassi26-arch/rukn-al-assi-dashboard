"use client";
// ==============================================================================
// features/dashboard/presentation/components/dashboard-charts.tsx
// Charts component for Dashboard statistics visualization
// ==============================================================================
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Skeleton } from "@shared/ui";
import { useDashboardCharts } from "@shared/hooks/dashboard/use-dashboard-hooks";
import { ErrorState } from "@shared/components/error-state";

export function DashboardCharts() {
  const { data: chartData, isLoading, error, refetch } = useDashboardCharts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card><CardHeader><Skeleton className="h-6 w-36" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-36" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load dashboard charts" error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* RFQ Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">RFQ Inquiries Trend</CardTitle>
          <CardDescription>Monthly quotation requests received over time</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData?.rfqTrend ?? []}>
              <defs>
                <linearGradient id="rfqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#rfqGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Contact Messages Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Submissions Trend</CardTitle>
          <CardDescription>Direct website messages received per month</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData?.contactTrend ?? []}>
              <defs>
                <linearGradient id="contactGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#contactGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
