// ==============================================================================
// features/activity-log/domain/repositories/i-activity-log.repository.ts
// IActivityLogRepository Contract Interface
// ==============================================================================
import type { ActivityLogEntity } from "../entities/activity-log.entity";

export interface ActivityLogFilters {
  search?: string;
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "created_at" | "action" | "entity_type" | "user_email";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedActivityLogs {
  items: ActivityLogEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IActivityLogRepository {
  getActivityLogs(filters: ActivityLogFilters): Promise<PaginatedActivityLogs>;
  getActivityLogById(id: string): Promise<ActivityLogEntity | null>;
}
