// ==============================================================================
// features/contact-messages/domain/usecases/get-contact-message-by-id.usecase.ts
// ==============================================================================
import type { IContactMessagesRepository } from "../repositories/i-contact-messages.repository";
import type { ContactMessageEntity } from "../entities/contact-message.entity";

export class GetContactMessageByIdUseCase {
  constructor(private readonly repository: IContactMessagesRepository) {}

  async execute(id: string): Promise<ContactMessageEntity | null> {
    return this.repository.getContactMessageById(id);
  }
}
