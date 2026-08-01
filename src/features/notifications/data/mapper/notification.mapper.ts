// ==============================================================================
// features/notifications/data/mapper/notification.mapper.ts
// Maps between Supabase NotificationDTO and NotificationEntity
// ==============================================================================
import { NotificationEntity } from "../../domain/entities/notification.entity";
import type { NotificationDTO } from "../dto/notification.dto";

export function toNotificationEntity(dto: NotificationDTO): NotificationEntity {
  return new NotificationEntity({
    id: dto.id,
    type: dto.type,
    title: dto.title,
    message: dto.message,
    link: dto.link ?? null,
    isRead: dto.is_read,
    userId: dto.user_id ?? null,
    metadata: dto.metadata ?? null,
    createdAt: new Date(dto.created_at),
  });
}
