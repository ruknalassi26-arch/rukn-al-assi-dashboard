// ==============================================================================
// features/contact-messages/domain/usecases/update-message-status.usecase.ts
// ==============================================================================
import type { IContactMessagesRepository } from "../repositories/i-contact-messages.repository";
import type { ContactMessageEntity, ContactMessageStatus } from "../entities/contact-message.entity";

export class UpdateMessageStatusUseCase {
  constructor(private readonly repository: IContactMessagesRepository) {}

  async execute(id: string, status: ContactMessageStatus, notes?: string): Promise<ContactMessageEntity> {
    return this.repository.updateMessageStatus(id, status, notes);
  }
}
