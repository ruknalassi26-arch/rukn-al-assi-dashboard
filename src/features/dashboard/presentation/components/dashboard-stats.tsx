"use client";
// ==============================================================================
// features/dashboard/presentation/components/dashboard-stats.tsx
// 8 KPI Stat Widgets Card Grid
// ==============================================================================
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Package,
  FolderKanban,
  Wrench,
  FolderOpen,
  ShieldCheck,
  Users,
  FileText,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, Skeleton, Badge } from "@shared/ui";
import { useDashboardStats } from "@shared/hooks/dashboard/use-dashboard-hooks";
import { ErrorState } from "@shared/components/error-state";

export function DashboardStats() {
  const locale = useLocale();
  const t = useTranslations("dashboard.stats");
  const tCommon = useTranslations("common");
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="border shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <ErrorState
        title={t("errorTitle")}
        error={error ?? new Error("No stats data")}
        onRetry={() => refetch()}
      />
    );
  }

  const statCards = [
    {
      title: t("totalProducts"),
      value: stats.totalProducts,
      subtext: `${stats.activeProducts} ${tCommon("active")}`,
      icon: Package,
      color: "text-blue-500 bg-blue-500/10",
      href: `/${locale}/admin/products`,
    },
    {
      title: t("totalCategories"),
      value: stats.totalCategories,
      subtext: tCommon("all"),
      icon: FolderKanban,
      color: "text-indigo-500 bg-indigo-500/10",
      href: `/${locale}/admin/categories`,
    },
    {
      title: t("totalServices"),
      value: stats.totalServices,
      subtext: `${stats.activeServices} ${tCommon("active")}`,
      icon: Wrench,
      color: "text-cyan-500 bg-cyan-500/10",
      href: `/${locale}/admin/services`,
    },
    {
      title: t("totalProjects"),
      value: stats.totalProjects,
      subtext: `${stats.completedProjects} ${tCommon("completed")}`,
      icon: FolderOpen,
      color: "text-emerald-500 bg-emerald-500/10",
      href: `/${locale}/admin/projects`,
    },
    {
      title: t("certificates"),
      value: stats.totalCertificates,
      subtext: tCommon("active"),
      icon: ShieldCheck,
      color: "text-amber-500 bg-amber-500/10",
      href: `/${locale}/admin/certificates`,
    },
    {
      title: tCommon("team") || "Team Members",
      value: stats.totalTeamMembers,
      subtext: tCommon("active"),
      icon: Users,
      color: "text-purple-500 bg-purple-500/10",
      href: `/${locale}/admin/team`,
    },
    {
      title: t("totalRfqs"),
      value: stats.totalRfqs,
      badge: stats.pendingRfqs > 0 ? `${stats.pendingRfqs}` : null,
      subtext: t("unreadRfqs"),
      icon: FileText,
      color: "text-orange-500 bg-orange-500/10",
      href: `/${locale}/admin/rfq`,
    },
    {
      title: t("totalContacts"),
      value: stats.totalContacts,
      badge: stats.unreadContacts > 0 ? `${stats.unreadContacts}` : null,
      subtext: t("unreadContacts"),
      icon: Mail,
      color: "text-rose-500 bg-rose-500/10",
      href: `/${locale}/admin/contact-messages`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value.toLocaleString()}
                </span>
                {card.badge && (
                  <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                    {card.badge}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
                <span className="truncate">{card.subtext}</span>
                <Link
                  href={card.href}
                  className="text-primary hover:underline flex items-center gap-0.5 font-medium shrink-0"
                >
                  <span>{tCommon("viewAll")}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
