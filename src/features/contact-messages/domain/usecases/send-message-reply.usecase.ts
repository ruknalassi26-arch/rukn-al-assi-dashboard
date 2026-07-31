// ==============================================================================
// features/contact-messages/domain/usecases/send-message-reply.usecase.ts
// ==============================================================================
import type { IContactMessagesRepository, SendMessageReplyInput } from "../repositories/i-contact-messages.repository";

export class SendMessageReplyUseCase {
  constructor(private readonly repository: IContactMessagesRepository) {}

  async execute(input: SendMessageReplyInput): Promise<void> {
    return this.repository.sendMessageReply(input);
  }
}
