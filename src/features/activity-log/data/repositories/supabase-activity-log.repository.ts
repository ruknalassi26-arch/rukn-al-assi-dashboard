// ==============================================================================
// features/activity-log/data/repositories/supabase-activity-log.repository.ts
// Supabase Data Repository Implementation for Activity Logs
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IActivityLogRepository,
  ActivityLogFilters,
  PaginatedActivityLogs,
} from "../../domain/repositories/i-activity-log.repository";
import { ActivityLogEntity } from "../../domain/entities/activity-log.entity";
import { toActivityLogEntity } from "../mapper/activity-log.mapper";
import type { ActivityLogDTO } from "../dto/activity-log.dto";

export class SupabaseActivityLogRepository implements IActivityLogRepository {
  private get supabase() {
    return createClient();
  }

  async getActivityLogs(filters: ActivityLogFilters = {}): Promise<PaginatedActivityLogs> {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, filters.pageSize ?? 10));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const sortBy = filters.sortBy ?? "created_at";
    const ascending = filters.sortOrder === "asc";

    let query = this.supabase
      .from("activity_logs")
      .select("*", { count: "exact" });

    // Search filter across user_email, entity_title, action
    if (filters.search && filters.search.trim() !== "") {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`user_email.ilike.${term},entity_title.ilike.${term},action.ilike.${term}`);
    }

    // Action type filter
    if (filters.action && filters.action !== "all") {
      query = query.eq("action", filters.action as any);
    }

    // Entity type filter
    if (filters.entityType && filters.entityType !== "all") {
      query = query.eq("entity_type", filters.entityType as any);
    }

    // Date range filters
    if (filters.startDate) {
      query = query.gte("created_at", new Date(filters.startDate).toISOString());
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      query = query.lte("created_at", end.toISOString());
    }

    // Sorting & Pagination
    query = query.order(sortBy, { ascending }).range(from, to);

    const { data, count, error } = await query;

    if (error || !data) {
      return {
        items: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / pageSize);
    const items = (data as unknown as ActivityLogDTO[]).map(toActivityLogEntity);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getActivityLogById(id: string): Promise<ActivityLogEntity | null> {
    const { data, error } = await this.supabase
      .from("activity_logs")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;

    return toActivityLogEntity(data as unknown as ActivityLogDTO);
  }
}
