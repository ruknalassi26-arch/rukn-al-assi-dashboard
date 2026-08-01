// ==============================================================================
// features/notifications/domain/usecases/mark-all-notifications-as-read.usecase.ts
// ==============================================================================
import type { INotificationRepository } from "../repositories/i-notification.repository";

export class MarkAllNotificationsAsReadUseCase {
  constructor(private readonly repository: INotificationRepository) {}

  async execute(): Promise<void> {
    return this.repository.markAllAsRead();
  }
}
