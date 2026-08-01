// ==============================================================================
// features/activity-log/data/mapper/activity-log.mapper.ts
// Maps between Supabase ActivityLogDTO and ActivityLogEntity
// ==============================================================================
import { ActivityLogEntity } from "../../domain/entities/activity-log.entity";
import type { ActivityLogDTO } from "../dto/activity-log.dto";

export function toActivityLogEntity(dto: ActivityLogDTO): ActivityLogEntity {
  const metadata = dto.metadata ?? null;
  const ipAddress = dto.ip_address ?? (metadata && "ip_address" in metadata ? String(metadata.ip_address) : null);
  const oldValue = dto.old_value ?? (metadata && "old_value" in metadata ? metadata.old_value : null);
  const newValue = dto.new_value ?? (metadata && "new_value" in metadata ? metadata.new_value : null);

  return new ActivityLogEntity({
    id: dto.id,
    action: dto.action,
    entityType: dto.entity_type,
    entityId: dto.entity_id ?? null,
    entityTitle: dto.entity_title ?? null,
    userId: dto.user_id ?? null,
    userEmail: dto.user_email ?? null,
    ipAddress: ipAddress ?? null,
    oldValue: oldValue ?? null,
    newValue: newValue ?? null,
    metadata,
    createdAt: new Date(dto.created_at),
  });
}
