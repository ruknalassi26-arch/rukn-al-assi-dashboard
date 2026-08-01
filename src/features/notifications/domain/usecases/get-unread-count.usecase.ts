// ==============================================================================
// features/notifications/domain/usecases/get-unread-count.usecase.ts
// ==============================================================================
import type { INotificationRepository } from "../repositories/i-notification.repository";

export class GetUnreadCountUseCase {
  constructor(private readonly repository: INotificationRepository) {}

  async execute(): Promise<number> {
    return this.repository.getUnreadCount();
  }
}
