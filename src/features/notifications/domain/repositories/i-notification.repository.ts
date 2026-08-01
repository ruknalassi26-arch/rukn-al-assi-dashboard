// ==============================================================================
// features/notifications/domain/repositories/i-notification.repository.ts
// INotificationRepository Contract Interface
// ==============================================================================
import type { NotificationEntity } from "../entities/notification.entity";

export interface NotificationFilters {
  search?: string;
  type?: string;
  readStatus?: "all" | "unread" | "read";
  page?: number;
  pageSize?: number;
}

export interface PaginatedNotifications {
  items: NotificationEntity[];
  total: number;
  unreadCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface INotificationRepository {
  getNotifications(filters?: NotificationFilters): Promise<PaginatedNotifications>;
  getUnreadCount(): Promise<number>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  deleteNotification(id: string): Promise<void>;
}
