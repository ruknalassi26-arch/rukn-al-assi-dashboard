// ==============================================================================
// features/notifications/domain/usecases/delete-notification.usecase.ts
// ==============================================================================
import type { INotificationRepository } from "../repositories/i-notification.repository";

export class DeleteNotificationUseCase {
  constructor(private readonly repository: INotificationRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteNotification(id);
  }
}
