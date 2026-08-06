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
      const { data, count, error } = await (this.supabase.from("activity_log" as any) as any)
        .select("*, admin_profiles(full_name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, from + pageSize - 1);

      if (error || !data) {
        return { items: [], total: 0, page, pageSize, totalPages: 0 };
      }

      const items = data.map((item: any) => new ActivityLogEntity({
        id: item.id,
        action: item.action || "updated",
        entityType: item.entity_type || "system",
        entityId: item.entity_id || null,
        entityTitle: item.details?.entity_title || "System Activity",
        userId: item.admin_user_id || "admin",
        userEmail: "admin@ruknalassi.com",
        ipAddress: item.ip_address ? String(item.ip_address) : null,
        metadata: item.details || null,
        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
      }));

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
        .select("*, admin_profiles(full_name)")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) return null;

      return new ActivityLogEntity({
        id: data.id,
        action: data.action || "updated",
        entityType: data.entity_type || "system",
        entityId: data.entity_id || null,
        entityTitle: data.details?.entity_title || "System Activity",
        userId: data.admin_user_id || "admin",
        userEmail: "admin@ruknalassi.com",
        ipAddress: data.ip_address ? String(data.ip_address) : null,
        metadata: data.details || null,
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      });
    } catch {
      return null;
    }
  }
}
