// ==============================================================================
// features/activity-log/data/dto/activity-log.dto.ts
// Data Transfer Object for activity_logs table
// ==============================================================================

export interface ActivityLogDTO {
  id: string;
  admin_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  details?: Record<string, unknown> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
  admin_profiles?: {
    id?: string;
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
}
