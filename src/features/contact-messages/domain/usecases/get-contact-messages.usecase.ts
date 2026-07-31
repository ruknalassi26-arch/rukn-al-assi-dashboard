// ==============================================================================
// features/contact-messages/domain/usecases/get-contact-messages.usecase.ts
// ==============================================================================
import type { IContactMessagesRepository, ContactMessageFilterParams, PaginatedContactMessages } from "../repositories/i-contact-messages.repository";

export class GetContactMessagesUseCase {
  constructor(private readonly repository: IContactMessagesRepository) {}

  async execute(params?: ContactMessageFilterParams): Promise<PaginatedContactMessages> {
    return this.repository.getContactMessages(params);
  }
}
