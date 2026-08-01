// ==============================================================================
// features/notifications/data/dto/notification.dto.ts
// Data Transfer Object for notifications table
// ==============================================================================
import type { NotificationType } from "../../domain/entities/notification.entity";

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  is_read: boolean;
  user_id?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}
