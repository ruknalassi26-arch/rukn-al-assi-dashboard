// ==============================================================================
// features/activity-log/data/repositories/supabase-activity-log.repository.ts
// Supabase Data Repository Implementation for System Activity Log
// Strictly matching official SQL Schema (activity_log) & joining admin_profiles
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
      let query = (this.supabase.from("activity_log" as any) as any).select(
        "*, admin_profiles(id, full_name, avatar_url)",
        { count: "exact" }
      );

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

      const items = data.map((item: Record<string, unknown>) => {
        const rawProfile = item.admin_profiles;
        const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
        const adminUserId = (item.admin_user_id as string) || null;
        const detailsObj = (item.details as Record<string, unknown>) || null;

        const profileFullName = (profile as { full_name?: string })?.full_name;
        const userName =
          (profileFullName && profileFullName.trim().length > 0 ? profileFullName : null) ||
          (detailsObj?.user_full_name as string) ||
          (detailsObj?.user_name as string) ||
          (detailsObj?.user_email as string) ||
          (adminUserId ? "Admin User" : "System / Unknown User");

        const userAvatarUrl = (profile as { avatar_url?: string })?.avatar_url || null;
        const entityTitle =
          (detailsObj?.entity_title as string) ||
          (detailsObj?.title as string) ||
          (detailsObj?.name as string) ||
          "System Activity";

        return new ActivityLogEntity({
          id: item.id as string,
          action: (item.action as string) || "updated",
          entityType: (item.entity_type as string) || "system",
          entityId: (item.entity_id as string) || null,
          entityTitle,
          userId: adminUserId,
          userName,
          userEmail: (detailsObj?.user_email as string) || userName,
          userAvatarUrl,
          metadata: detailsObj,
          createdAt: item.created_at ? new Date(item.created_at as string) : new Date(),
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
      const adminUserId = (data.admin_user_id as string) || null;
      const detailsObj = (data.details as Record<string, unknown>) || null;
      const profileFullName = profile?.full_name;

      const userName =
        (profileFullName && profileFullName.trim().length > 0 ? profileFullName : null) ||
        (detailsObj?.user_full_name as string) ||
        (detailsObj?.user_name as string) ||
        (detailsObj?.user_email as string) ||
        (adminUserId ? "Admin User" : "System / Unknown User");

      const userAvatarUrl = profile?.avatar_url || null;
      const entityTitle =
        (detailsObj?.entity_title as string) ||
        (detailsObj?.title as string) ||
        (detailsObj?.name as string) ||
        "System Activity";

      return new ActivityLogEntity({
        id: data.id as string,
        action: (data.action as string) || "updated",
        entityType: (data.entity_type as string) || "system",
        entityId: (data.entity_id as string) || null,
        entityTitle,
        userId: adminUserId,
        userName,
        userEmail: (detailsObj?.user_email as string) || userName,
        userAvatarUrl,
        metadata: detailsObj,
        createdAt: data.created_at ? new Date(data.created_at as string) : new Date(),
      });
    } catch {
      return null;
    }
  }
}
