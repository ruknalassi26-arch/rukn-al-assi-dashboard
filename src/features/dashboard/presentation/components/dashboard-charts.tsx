"use client";
// ==============================================================================
// features/dashboard/presentation/components/dashboard-charts.tsx
// Area & Line Trend Charts for RFQs and Contact Messages
// ==============================================================================
import { useTranslations } from "next-intl";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Skeleton } from "@shared/ui";
import { useDashboardCharts } from "@shared/hooks/dashboard/use-dashboard-hooks";
import { ErrorState } from "@shared/components/error-state";
import { TrendingUp, FileText, Mail, BarChart2 } from "lucide-react";

export function DashboardCharts() {
  const t = useTranslations("dashboard.charts");
  const { data: chartData, isLoading, error, refetch } = useDashboardCharts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border shadow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent className="h-64">
            <Skeleton className="h-full w-full rounded-lg" />
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent className="h-64">
            <Skeleton className="h-full w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <ErrorState title={t("errorTitle")} error={error} onRetry={() => refetch()} />;
  }

  const rfqData = chartData?.rfqTrend ?? [];
  const contactData = chartData?.contactTrend ?? [];

  const isRfqEmpty = rfqData.length === 0 || rfqData.every((d) => d.count === 0);
  const isContactEmpty = contactData.length === 0 || contactData.every((d) => d.count === 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* RFQs per Month Chart */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-500" />
              {t("monthlyRfqs")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            {t("monthlyRfqs")}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 pt-4">
          {isRfqEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-muted/20 rounded-lg border border-dashed">
              <BarChart2 className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-xs font-semibold text-muted-foreground">{t("monthlyRfqs")}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rfqData}>
                <defs>
                  <linearGradient id="rfqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" textAnchor="end" height={50} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#rfqGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Messages per Month Chart */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              {t("monthlyContacts")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            {t("monthlyContacts")}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 pt-4">
          {isContactEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-muted/20 rounded-lg border border-dashed">
              <BarChart2 className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-xs font-semibold text-muted-foreground">{t("monthlyContacts")}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={contactData}>
                <defs>
                  <linearGradient id="contactGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" textAnchor="end" height={50} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#contactGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
