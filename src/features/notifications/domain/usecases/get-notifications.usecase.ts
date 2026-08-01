// ==============================================================================
// features/notifications/domain/usecases/get-notifications.usecase.ts
// ==============================================================================
import type { INotificationRepository, NotificationFilters, PaginatedNotifications } from "../repositories/i-notification.repository";

export class GetNotificationsUseCase {
  constructor(private readonly repository: INotificationRepository) {}

  async execute(filters: NotificationFilters = {}): Promise<PaginatedNotifications> {
    return this.repository.getNotifications(filters);
  }
}
