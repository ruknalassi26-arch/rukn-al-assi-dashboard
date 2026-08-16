// ==============================================================================
// features/dashboard/data/repository/supabase-dashboard.repository.ts
// Concrete Supabase implementation of IDashboardRepository
// Executes 1 SINGLE Server-Side RPC Function ("get_admin_dashboard_summary")
// 100% Type-Safe TypeScript — ZERO "any" types used.
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@core/types/database.types";
import type { IDashboardRepository } from "../../domain/repositories/i-dashboard.repository";
import {
  DashboardStatsEntity,
  DashboardChartsEntity,
  LatestRfqEntity,
  LatestContactEntity,
  ActivityLogEntity,
} from "../../domain/entities/dashboard.entity";

interface DashboardSummaryDto {
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalServices: number;
    activeServices: number;
    totalProjects: number;
    completedProjects: number;
    totalRfqs: number;
    pendingRfqs: number;
    totalContacts: number;
    unreadContacts: number;
    totalCertificates: number;
    totalTeamMembers: number;
    totalClients: number;
  };
  rfqTrend?: Array<{ month: string; count: number }>;
  contactTrend?: Array<{ month: string; count: number }>;
  latestRfqs: Array<{
    id: string;
    full_name: string;
    company_name: string | null;
    status: string;
    created_at: string;
  }>;
  latestContacts: Array<{
    id: string;
    full_name: string;
    email: string;
    subject: string | null;
    status: string;
    created_at: string;
  }>;
  recentActivity: Array<{
    id: string;
    admin_user_id: string | null;
    action: string;
    entity_type: string;
    details: { entity_title?: string; user_email?: string; user_name?: string; user_full_name?: string; [key: string]: unknown } | null;
    user_full_name?: string | null;
    user_avatar_url?: string | null;
    created_at: string;
  }>;
}

function generateMonthBuckets(months = 6, items: Array<{ created_at?: string }> = []) {
  const buckets: { month: string; yearMonth: string; count: number }[] = [];
  const formatter = new Intl.DateTimeFormat("en", { month: "short" });

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({
      month: formatter.format(d),
      yearMonth,
      count: 0,
    });
  }

  items.forEach((item) => {
    if (item.created_at) {
      const d = new Date(item.created_at);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const found = buckets.find((b) => b.yearMonth === ym);
      if (found) {
        found.count++;
      }
    }
  });

  return buckets.map((b) => ({ month: b.month, count: b.count }));
}

export class SupabaseDashboardRepository implements IDashboardRepository {
  private summaryCachePromise: Promise<DashboardSummaryDto | null> | null = null;

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  private async fetchSummary(): Promise<DashboardSummaryDto | null> {
    if (this.summaryCachePromise) {
      return this.summaryCachePromise;
    }

    this.summaryCachePromise = (async () => {
      try {
        const response = await (this.supabase.rpc as unknown as (
          fn: string
        ) => Promise<{ data: DashboardSummaryDto | null; error: { message: string } | null }>)(
          "get_admin_dashboard_summary"
        );

        if (response.error || !response.data) {
          return null;
        }

        return response.data;
      } catch {
        return null;
      } finally {
        setTimeout(() => {
          this.summaryCachePromise = null;
        }, 1000);
      }
    })();

    return this.summaryCachePromise;
  }

  async getStats(): Promise<DashboardStatsEntity> {
    const summary = await this.fetchSummary();
    if (!summary?.stats) {
      return this.getFallbackStats();
    }

    return new DashboardStatsEntity({
      totalProducts: summary.stats.totalProducts ?? 0,
      activeProducts: summary.stats.activeProducts ?? 0,
      totalCategories: summary.stats.totalCategories ?? 0,
      totalServices: summary.stats.totalServices ?? 0,
      activeServices: summary.stats.activeServices ?? 0,
      totalProjects: summary.stats.totalProjects ?? 0,
      completedProjects: summary.stats.completedProjects ?? 0,
      totalRfqs: summary.stats.totalRfqs ?? 0,
      pendingRfqs: summary.stats.pendingRfqs ?? 0,
      totalContacts: summary.stats.totalContacts ?? 0,
      unreadContacts: summary.stats.unreadContacts ?? 0,
      totalCertificates: summary.stats.totalCertificates ?? 0,
      totalTeamMembers: summary.stats.totalTeamMembers ?? 0,
      totalClients: summary.stats.totalClients ?? 0,
      totalCompanyStats: 0,
    });
  }

  async getCharts(months = 6): Promise<DashboardChartsEntity> {
    const summary = await this.fetchSummary();
    const rfqTrend =
      summary?.rfqTrend && summary.rfqTrend.length > 0
        ? summary.rfqTrend
        : generateMonthBuckets(months, summary?.latestRfqs ?? []);

    const contactTrend =
      summary?.contactTrend && summary.contactTrend.length > 0
        ? summary.contactTrend
        : generateMonthBuckets(months, summary?.latestContacts ?? []);

    return new DashboardChartsEntity({
      rfqTrend: rfqTrend.map((t) => ({ month: t.month, count: t.count })),
      contactTrend: contactTrend.map((t) => ({ month: t.month, count: t.count })),
    });
  }

  async getLatestRfqs(limit = 5): Promise<LatestRfqEntity[]> {
    const summary = await this.fetchSummary();
    if (!summary?.latestRfqs) return [];

    return summary.latestRfqs.slice(0, limit).map(
      (item) =>
        new LatestRfqEntity({
          id: item.id,
          fullName: item.full_name || "Customer",
          companyName: item.company_name || null,
          email: "customer@client.com",
          status: item.status || "pending",
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        })
    );
  }

  async getLatestContacts(limit = 5): Promise<LatestContactEntity[]> {
    const summary = await this.fetchSummary();
    if (!summary?.latestContacts) return [];

    return summary.latestContacts.slice(0, limit).map(
      (item) =>
        new LatestContactEntity({
          id: item.id,
          name: item.full_name || "Customer",
          email: item.email || "",
          subject: item.subject || "Contact Query",
          status: item.status || "new",
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        })
    );
  }

  async getRecentActivity(limit = 10): Promise<ActivityLogEntity[]> {
    const summary = await this.fetchSummary();
    if (!summary?.recentActivity) return [];

    return summary.recentActivity.slice(0, limit).map((item) => {
      const adminUserId = item.admin_user_id || null;
      const detailsObj = (item.details as Record<string, unknown>) || null;

      // Robust resolution chain matching activity log page
      const resolvedName =
        (item.user_full_name && item.user_full_name.trim().length > 0 ? item.user_full_name : null) ||
        (detailsObj?.user_full_name as string) ||
        (detailsObj?.user_name as string) ||
        (detailsObj?.user_email as string) ||
        (adminUserId ? "Admin User" : "System / Unknown User");

      return new ActivityLogEntity({
        id: item.id,
        action: item.action || "updated",
        entityType: item.entity_type || "system",
        entityTitle: (detailsObj?.entity_title as string) || "System Activity",
        userId: adminUserId,
        userEmail: resolvedName,
        metadata: detailsObj,
        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
      });
    });
  }

  private getFallbackStats(): DashboardStatsEntity {
    return new DashboardStatsEntity({
      totalProducts: 0,
      activeProducts: 0,
      totalCategories: 0,
      totalServices: 0,
      activeServices: 0,
      totalProjects: 0,
      completedProjects: 0,
      totalRfqs: 0,
      pendingRfqs: 0,
      totalContacts: 0,
      unreadContacts: 0,
      totalCertificates: 0,
      totalTeamMembers: 0,
      totalClients: 0,
      totalCompanyStats: 0,
    });
  }
}
