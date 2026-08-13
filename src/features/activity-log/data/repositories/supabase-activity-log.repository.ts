// ==============================================================================
// features/activity-log/data/repositories/supabase-activity-log.repository.ts
// Supabase Data Repository Implementation for System Activity Log
// Strictly matching official SQL Schema (activity_log)
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IActivityLogRepository,
  ActivityLogFilters,
  PaginatedActivityLogs,
} from "../../domain/repositories/i-activity-log.repository";
import { ActivityLogEntity } from "../../domain/entities/activity-log.entity";

export class SupabaseActivityLogRepository implements IActivityLogRepository {
  private get supabase() {
    return createClient();
  }

  async getActivityLogs(filters: ActivityLogFilters = {}): Promise<PaginatedActivityLogs> {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, filters.pageSize ?? 10));
    const from = (page - 1) * pageSize;

    try {
      let query = (this.supabase.from("activity_log" as any) as any)
        .select("*, admin_profiles(id, full_name, avatar_url)", { count: "exact" });

      if (filters.action && filters.action !== "all") {
        if (filters.action === "rfq_status_changed") {
          query = query.eq("action", "updated").eq("entity_type", "rfq");
        } else if (filters.action === "seo_updated") {
          query = query.eq("action", "updated").eq("entity_type", "seo");
        } else if (filters.action === "settings_updated") {
          query = query.eq("action", "updated").eq("entity_type", "settings");
        } else if (filters.action === "contact_updated") {
          query = query.eq("action", "updated").eq("entity_type", "contact");
        } else if (filters.action === "password_changed") {
          query = query.eq("action", "updated");
        } else {
          query = query.eq("action", filters.action);
        }
      }

      if (filters.entityType && filters.entityType !== "all") {
        query = query.eq("entity_type", filters.entityType);
      }

      if (filters.startDate) {
        query = query.gte("created_at", `${filters.startDate}T00:00:00.000Z`);
      }

      if (filters.endDate) {
        query = query.lte("created_at", `${filters.endDate}T23:59:59.999Z`);
      }

      const { data, count, error } = await query
        .order("created_at", { ascending: false })
        .range(from, from + pageSize - 1);

      if (error || !data) {
        return { items: [], total: 0, page, pageSize, totalPages: 0 };
      }

      const items = data.map((item: any) => {
        const profile = Array.isArray(item.admin_profiles) ? item.admin_profiles[0] : item.admin_profiles;
        const userName = profile?.full_name || item.details?.user_full_name || item.details?.user_name || "Administrator";
        const userEmail = item.details?.user_email || null;
        const userAvatarUrl = profile?.avatar_url || null;

        return new ActivityLogEntity({
          id: item.id,
          action: item.action || "updated",
          entityType: item.entity_type || "system",
          entityId: item.entity_id || null,
          entityTitle: item.details?.entity_title || item.details?.title || item.details?.name || "System Activity",
          userId: item.admin_user_id || null,
          userName,
          userEmail,
          userAvatarUrl,
          ipAddress: item.ip_address ? String(item.ip_address) : null,
          metadata: item.details || null,
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        });
      });

      const total = count ?? items.length;
      const totalPages = Math.ceil(total / pageSize);

      return { items, total, page, pageSize, totalPages };
    } catch {
      return { items: [], total: 0, page, pageSize, totalPages: 0 };
    }
  }

  async getActivityLogById(id: string): Promise<ActivityLogEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("activity_log" as any) as any)
        .select("*, admin_profiles(id, full_name, avatar_url)")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) return null;

      const profile = Array.isArray(data.admin_profiles) ? data.admin_profiles[0] : data.admin_profiles;
      const userName = profile?.full_name || data.details?.user_full_name || data.details?.user_name || "Administrator";
      const userEmail = data.details?.user_email || null;
      const userAvatarUrl = profile?.avatar_url || null;

      return new ActivityLogEntity({
        id: data.id,
        action: data.action || "updated",
        entityType: data.entity_type || "system",
        entityId: data.entity_id || null,
        entityTitle: data.details?.entity_title || data.details?.title || data.details?.name || "System Activity",
        userId: data.admin_user_id || null,
        userName,
        userEmail,
        userAvatarUrl,
        ipAddress: data.ip_address ? String(data.ip_address) : null,
        metadata: data.details || null,
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      });
    } catch {
      return null;
    }
  }
}
