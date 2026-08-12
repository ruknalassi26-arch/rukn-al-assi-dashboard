// ==============================================================================
// features/dashboard/data/repository/supabase-dashboard.repository.ts
// Concrete Supabase implementation of IDashboardRepository
// Real database queries with strict TypeScript DTOs
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

interface ActivityLogRowDTO {
  id: string;
  admin_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: { entity_title?: string; [key: string]: unknown } | null;
  created_at: string;
}

export class SupabaseDashboardRepository implements IDashboardRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getStats(): Promise<DashboardStatsEntity> {
    try {
      const [
        productsResult,
        activeProductsResult,
        categoriesResult,
        servicesResult,
        activeServicesResult,
        projectsResult,
        completedProjectsResult,
        rfqsResult,
        pendingRfqsResult,
        contactsResult,
        unreadContactsResult,
        certificatesResult,
        teamMembersResult,
        clientsResult,
        statsResult,
      ] = await Promise.all([
        this.supabase.from("products").select("*", { count: "exact", head: true }),
        this.supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "active"),
        this.supabase.from("product_categories").select("*", { count: "exact", head: true }),
        this.supabase.from("services").select("*", { count: "exact", head: true }),
        this.supabase.from("services").select("*", { count: "exact", head: true }).eq("status", "active"),
        this.supabase.from("projects").select("*", { count: "exact", head: true }),
        this.supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "completed"),
        this.supabase.from("rfq_requests").select("*", { count: "exact", head: true }),
        this.supabase.from("rfq_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
        this.supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        this.supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
        this.supabase.from("certifications").select("*", { count: "exact", head: true }),
        this.supabase.from("team_members").select("*", { count: "exact", head: true }),
        this.supabase.from("clients").select("*", { count: "exact", head: true }),
        this.supabase.from("company_profile").select("*", { count: "exact", head: true }),
      ]);

      return new DashboardStatsEntity({
        totalProducts: productsResult.count ?? 0,
        activeProducts: activeProductsResult.count ?? 0,
        totalCategories: categoriesResult.count ?? 0,
        totalServices: servicesResult.count ?? 0,
        activeServices: activeServicesResult.count ?? 0,
        totalProjects: projectsResult.count ?? 0,
        completedProjects: completedProjectsResult.count ?? 0,
        totalRfqs: rfqsResult.count ?? 0,
        pendingRfqs: pendingRfqsResult.count ?? 0,
        totalContacts: contactsResult.count ?? 0,
        unreadContacts: unreadContactsResult.count ?? 0,
        totalCertificates: certificatesResult.count ?? 0,
        totalTeamMembers: teamMembersResult.count ?? 0,
        totalClients: clientsResult.count ?? 0,
        totalCompanyStats: statsResult.count ?? 0,
      });
    } catch {
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

  async getCharts(months: number = 6): Promise<DashboardChartsEntity> {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - (months - 1));
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const [rfqRes, contactRes] = await Promise.all([
        this.supabase
          .from("rfq_requests")
          .select("created_at")
          .gte("created_at", startDate.toISOString())
          .order("created_at", { ascending: true }),
        this.supabase
          .from("contact_messages")
          .select("created_at")
          .gte("created_at", startDate.toISOString())
          .order("created_at", { ascending: true }),
      ]);

      const rfqData = rfqRes.data ?? [];
      const contactData = contactRes.data ?? [];

      const monthBuckets: { month: string; yearMonth: string }[] = [];
      const monthFormatter = new Intl.DateTimeFormat("en", { month: "short" });

      for (let i = months - 1; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthBuckets.push({
          month: monthFormatter.format(d),
          yearMonth,
        });
      }

      const rfqCounts: Record<string, number> = {};
      const contactCounts: Record<string, number> = {};

      monthBuckets.forEach((b) => {
        rfqCounts[b.yearMonth] = 0;
        contactCounts[b.yearMonth] = 0;
      });

      rfqData.forEach((row) => {
        if (row.created_at) {
          const d = new Date(row.created_at);
          const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          if (rfqCounts[ym] !== undefined) {
            rfqCounts[ym]++;
          }
        }
      });

      contactData.forEach((row) => {
        if (row.created_at) {
          const d = new Date(row.created_at);
          const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          if (contactCounts[ym] !== undefined) {
            contactCounts[ym]++;
          }
        }
      });

      const rfqTrend = monthBuckets.map((b) => ({
        month: b.month,
        count: rfqCounts[b.yearMonth] ?? 0,
      }));

      const contactTrend = monthBuckets.map((b) => ({
        month: b.month,
        count: contactCounts[b.yearMonth] ?? 0,
      }));

      return new DashboardChartsEntity({ rfqTrend, contactTrend });
    } catch {
      return new DashboardChartsEntity({ rfqTrend: [], contactTrend: [] });
    }
  }

  async getLatestRfqs(limit: number = 5): Promise<LatestRfqEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from("rfq_requests")
        .select("id, full_name, company_name, status, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error || !data) return [];
      return data.map(
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
    } catch {
      return [];
    }
  }

  async getLatestContacts(limit: number = 5): Promise<LatestContactEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from("contact_messages")
        .select("id, full_name, email, subject, status, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error || !data) return [];
      return data.map(
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
    } catch {
      return [];
    }
  }

  async getRecentActivity(limit: number = 10): Promise<ActivityLogEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error || !data) return [];
      const rawRows = data as unknown as ActivityLogRowDTO[];
      return rawRows.map(
        (item) =>
          new ActivityLogEntity({
            id: item.id,
            action: item.action || "updated",
            entityType: item.entity_type || "system",
            entityTitle: item.details?.entity_title || "System Activity",
            userId: item.admin_user_id || null,
            userEmail: "admin@ruknalassi.com",
            metadata: (item.details as Record<string, unknown>) || null,
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          })
      );
    } catch {
      return [];
    }
  }
}
