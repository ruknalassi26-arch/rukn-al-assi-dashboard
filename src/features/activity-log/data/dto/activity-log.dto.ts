// ==============================================================================
// features/activity-log/data/dto/activity-log.dto.ts
// Data Transfer Object for activity_logs table
// ==============================================================================

export interface ActivityLogDTO {
  id: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  entity_title?: string | null;
  user_id?: string | null;
  user_email?: string | null;
  ip_address?: string | null;
  old_value?: unknown;
  new_value?: unknown;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}
