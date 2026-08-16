"use client";

// ==============================================================================
// features/analytics/presentation/components/website-analytics-section.tsx
// Website Analytics Dashboard UI powered strictly by public.page_views RPC
// ==============================================================================
import { useWebsiteAnalytics, type DateRangePreset } from "../hooks/use-website-analytics";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from "@shared/ui";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  Eye,
  Users,
  Calendar,
  Globe2,
  Smartphone,
  Laptop,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  RotateCw,
  TrendingUp,
  FileText,
  PieChart,
} from "lucide-react";

export function WebsiteAnalyticsSection() {
  const {
    preset,
    setPreset,
    languageCode,
    setLanguageCode,
    data,
    isLoading,
    error,
    refetch,
  } = useWebsiteAnalytics();

  const summary = data?.summary;
  const viewsOverTime = data?.viewsOverTime ?? [];
  const topPages = data?.topPages ?? [];
  const countries = data?.countries ?? [];
  const devices = data?.devices ?? [];
  const browsers = data?.browsers ?? [];
  const referrers = data?.referrers ?? [];
  const campaigns = data?.campaigns ?? [];

  if (error) {
    return (
      <Card className="border border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/50">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Failed to load website traffic analytics.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{error.message}</p>
          <Button variant="outline" size="sm" onClick={refetch} className="mt-4 gap-2">
            <RotateCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header & Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Website Traffic & Visitors
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aggregated page views and estimated unique sessions from website visitors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Date Filter Buttons */}
          <div className="inline-flex items-center rounded-lg border bg-muted/30 p-1 text-xs font-medium">
            {(
              [
                { key: "today", label: "Today" },
                { key: "7d", label: "7 Days" },
                { key: "30d", label: "30 Days" },
                { key: "90d", label: "90 Days" },
              ] as { key: DateRangePreset; label: string }[]
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setPreset(item.key)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  preset === item.key
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Language Filter */}
          <Select value={languageCode} onValueChange={setLanguageCode}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <Globe2 className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="en">English (EN)</SelectItem>
              <SelectItem value="ar">Arabic (AR)</SelectItem>
              <SelectItem value="ku">Kurdish (KU)</SelectItem>
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
            className="h-8 px-2.5"
            title="Refresh analytics data"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Page Views */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Page Views</span>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-7 w-20 mt-2" />
            ) : (
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight">
                  {summary?.totalPageViews.toLocaleString() ?? 0}
                </span>
                {summary && summary.previousPeriodViews > 0 && (
                  <span
                    className={`inline-flex items-center text-xs font-semibold ${
                      summary.growthPercentage >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {summary.growthPercentage >= 0 ? (
                      <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                    )}
                    {Math.abs(summary.growthPercentage)}%
                  </span>
                )}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-1">
              Total page requests in selected range
            </p>
          </CardContent>
        </Card>

        {/* Estimated Unique Visitors / Sessions */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Estimated Unique Sessions
              </span>
              <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
                <Users className="h-4 w-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-7 w-20 mt-2" />
            ) : (
              <div className="mt-2">
                <span className="text-2xl font-bold tracking-tight">
                  {summary?.uniqueSessions.toLocaleString() ?? 0}
                </span>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-1">
              Distinct visitor sessions (session_id)
            </p>
          </CardContent>
        </Card>

        {/* Views Today */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Views Today</span>
              <div className="rounded-full bg-amber-500/10 p-2 text-amber-500">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-7 w-20 mt-2" />
            ) : (
              <div className="mt-2">
                <span className="text-2xl font-bold tracking-tight">
                  {summary?.todayViews.toLocaleString() ?? 0}
                </span>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-1">
              Traffic recorded since midnight (00:00)
            </p>
          </CardContent>
        </Card>

        {/* Previous Period Comparison */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Previous Period</span>
              <div className="rounded-full bg-purple-500/10 p-2 text-purple-500">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-7 w-20 mt-2" />
            ) : (
              <div className="mt-2">
                <span className="text-2xl font-bold tracking-tight">
                  {summary?.previousPeriodViews.toLocaleString() ?? 0}
                </span>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-1">
              Page views in prior equivalent period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Views Over Time Area Chart */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Traffic Trend (Views Over Time)
            </CardTitle>
            <Badge variant="outline" className="text-xs font-normal">
              {preset === "today" ? "24 Hours" : preset}
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Daily distribution of page views and unique sessions over the selected timeframe.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72 pt-4">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : viewsOverTime.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-muted/20 rounded-lg border border-dashed">
              <Eye className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-xs font-semibold text-muted-foreground">
                No traffic data recorded for this period yet.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsOverTime}>
                <defs>
                  <linearGradient id="pageViewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="uniqueSessionsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" textAnchor="end" height={45} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  name="Page Views"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#pageViewsGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="uniqueSessions"
                  name="Unique Sessions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#uniqueSessionsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Pages & Device Breakdown Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Pages Table */}
        <Card className="border shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Most Visited Pages
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Top requested URL paths ranked by total view volume.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : topPages.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No page views recorded in this period.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Page Path</TableHead>
                    <TableHead className="text-xs text-right">Page Views</TableHead>
                    <TableHead className="text-xs text-right">Unique Sessions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPages.slice(0, 10).map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-xs max-w-[280px] truncate">
                        {row.path}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-xs">
                        {row.pageViews.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {row.uniqueSessions.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Devices Breakdown Chart */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-purple-500" />
              Devices
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Visitor distribution by device type.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : devices.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No device data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={devices} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="deviceType" type="category" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="pageViews" name="Views" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Country & Browser Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Country Breakdown */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-amber-500" />
              Traffic by Country
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Geographic breakdown of page views.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : countries.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No country location data available.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Country</TableHead>
                    <TableHead className="text-xs text-right">Page Views</TableHead>
                    <TableHead className="text-xs text-right">Sessions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countries.slice(0, 7).map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs font-medium flex items-center gap-2">
                        <span>{row.country}</span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-xs">
                        {row.pageViews.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {row.uniqueSessions.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Browsers & Referrers */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Laptop className="h-4 w-4 text-indigo-500" />
              Browsers & Referrers
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Top web browsers and traffic referral sources.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Browser / Referrer</TableHead>
                    <TableHead className="text-xs text-right">Views</TableHead>
                    <TableHead className="text-xs text-right">Sessions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {browsers.slice(0, 4).map((row, idx) => (
                    <TableRow key={`b-${idx}`}>
                      <TableCell className="text-xs font-medium flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] py-0">
                          Browser
                        </Badge>
                        <span>{row.browser}</span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-xs">
                        {row.pageViews.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {row.uniqueSessions.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {referrers.slice(0, 3).map((row, idx) => (
                    <TableRow key={`r-${idx}`}>
                      <TableCell className="text-xs font-medium flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] py-0">
                          Referrer
                        </Badge>
                        <span className="font-mono truncate max-w-[180px]">{row.referrer}</span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-xs">
                        {row.pageViews.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {row.uniqueSessions.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Campaigns / UTM Sources (Only rendered if campaigns exist) */}
      {campaigns.length > 0 && (
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-500" />
              UTM Campaign Statistics
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Performance by campaign, medium, and traffic source tags.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-xs">UTM Source</TableHead>
                  <TableHead className="text-xs">UTM Medium</TableHead>
                  <TableHead className="text-xs">UTM Campaign</TableHead>
                  <TableHead className="text-xs text-right">Page Views</TableHead>
                  <TableHead className="text-xs text-right">Sessions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-xs font-mono">{row.utmSource}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.utmMedium}
                    </TableCell>
                    <TableCell className="text-xs font-medium">{row.utmCampaign}</TableCell>
                    <TableCell className="text-right font-semibold text-xs">
                      {row.pageViews.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {row.uniqueSessions.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
