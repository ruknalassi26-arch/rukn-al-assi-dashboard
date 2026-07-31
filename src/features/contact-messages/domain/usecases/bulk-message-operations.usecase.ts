// ==============================================================================
// features/contact-messages/domain/usecases/bulk-message-operations.usecase.ts
// ==============================================================================
import type { IContactMessagesRepository } from "../repositories/i-contact-messages.repository";
import type { ContactMessageStatus } from "../entities/contact-message.entity";

export class BulkDeleteMessagesUseCase {
  constructor(private readonly repository: IContactMessagesRepository) {}

  async execute(ids: string[]): Promise<void> {
    return this.repository.bulkDeleteContactMessages(ids);
  }
}

export class BulkUpdateMessageStatusUseCase {
  constructor(private readonly repository: IContactMessagesRepository) {}

  async execute(ids: string[], status: ContactMessageStatus): Promise<void> {
    return this.repository.bulkUpdateMessageStatus(ids, status);
  }
}
