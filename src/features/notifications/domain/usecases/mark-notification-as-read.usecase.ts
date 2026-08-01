// ==============================================================================
// features/notifications/domain/usecases/mark-notification-as-read.usecase.ts
// ==============================================================================
import type { INotificationRepository } from "../repositories/i-notification.repository";

export class MarkNotificationAsReadUseCase {
  constructor(private readonly repository: INotificationRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.markAsRead(id);
  }
}
