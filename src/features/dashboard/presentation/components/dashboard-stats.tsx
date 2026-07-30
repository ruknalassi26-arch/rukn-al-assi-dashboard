"use client";
// ==============================================================================
// features/dashboard/presentation/components/dashboard-stats.tsx
// Grid of KPI Stat Cards for Dashboard
// ==============================================================================
import {
  Package,
  Wrench,
  FolderKanban,
  FileText,
  Mail,
  Award,
  Users,
  Building,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@shared/ui";
import { useDashboardStats } from "@shared/hooks/dashboard/use-dashboard-hooks";
import { ErrorState } from "@shared/components/error-state";

export function DashboardStats() {
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard statistics"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  const statCards = [
    { title: "Total Products", value: stats?.totalProducts ?? 0, icon: Package, color: "text-blue-600", desc: `${stats?.activeProducts ?? 0} Active` },
    { title: "Total Services", value: stats?.totalServices ?? 0, icon: Wrench, color: "text-emerald-600", desc: `${stats?.activeServices ?? 0} Active` },
    { title: "Total Projects", value: stats?.totalProjects ?? 0, icon: FolderKanban, color: "text-violet-600", desc: `${stats?.completedProjects ?? 0} Completed` },
    { title: "RFQ Requests", value: stats?.totalRfqs ?? 0, icon: FileText, color: "text-amber-600", desc: `${stats?.pendingRfqs ?? 0} Pending` },
    { title: "Contact Messages", value: stats?.totalContacts ?? 0, icon: Mail, color: "text-rose-600", desc: `${stats?.unreadContacts ?? 0} Unread` },
    { title: "Certificates", value: stats?.totalCertificates ?? 0, icon: Award, color: "text-teal-600", desc: "Active ISO & Badges" },
    { title: "Client Partners", value: stats?.totalClients ?? 0, icon: Users, color: "text-indigo-600", desc: "Active Clients" },
    { title: "Company Stats", value: stats?.totalCompanyStats ?? 0, icon: Building, color: "text-cyan-600", desc: "KPI Counter Badges" },
    { title: "Growth Rate", value: "+18%", icon: TrendingUp, color: "text-green-600", desc: "Vs previous month" },
    { title: "Avg Response", value: "< 24h", icon: Clock, color: "text-orange-600", desc: "For RFQs & inquiries" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.desc}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
