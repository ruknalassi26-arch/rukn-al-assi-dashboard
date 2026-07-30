"use client";
// ==============================================================================
// features/dashboard/presentation/views/components/dashboard-chart.tsx
// Reusable area chart component using Recharts
// ==============================================================================
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { MonthlyChartData } from "../../../domain/entities/dashboard.entity";
import { cn } from "@core/utils/cn";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@shared/ui";

interface DashboardChartProps {
  title: string;
  data: MonthlyChartData[];
  color: string;
  gradientId: string;
  className?: string;
}

export function DashboardChart({
  title,
  data,
  color,
  gradientId,
  className,
}: DashboardChartProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                itemStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={{ r: 3, fill: color, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: "hsl(var(--background))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardChartSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
