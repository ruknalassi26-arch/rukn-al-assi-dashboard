// ==============================================================================
// features/contact-messages/domain/usecases/delete-contact-message.usecase.ts
// ==============================================================================
import type { IContactMessagesRepository } from "../repositories/i-contact-messages.repository";

export class DeleteContactMessageUseCase {
  constructor(private readonly repository: IContactMessagesRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteContactMessage(id);
  }
}
