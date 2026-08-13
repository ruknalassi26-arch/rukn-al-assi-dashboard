// ==============================================================================
// features/activity-log/data/mapper/activity-log.mapper.ts
// Maps between Supabase ActivityLogDTO and ActivityLogEntity
// ==============================================================================
import { ActivityLogEntity } from "../../domain/entities/activity-log.entity";
import type { ActivityLogDTO } from "../dto/activity-log.dto";

export function toActivityLogEntity(dto: ActivityLogDTO): ActivityLogEntity {
  const details = dto.details ?? null;
  const profile = dto.admin_profiles;
  const userName = profile?.full_name || (details?.user_full_name as string) || (details?.user_name as string) || "Administrator";
  const userEmail = (details?.user_email as string) || null;
  const userAvatarUrl = profile?.avatar_url || null;
  const entityTitle = (details?.entity_title as string) || (details?.title as string) || (details?.name as string) || "System Activity";

  return new ActivityLogEntity({
    id: dto.id,
    action: dto.action,
    entityType: dto.entity_type,
    entityId: dto.entity_id ?? null,
    entityTitle,
    userId: dto.admin_user_id ?? null,
    userName,
    userEmail,
    userAvatarUrl,
    ipAddress: dto.ip_address ?? null,
    metadata: details,
    createdAt: new Date(dto.created_at),
  });
}
