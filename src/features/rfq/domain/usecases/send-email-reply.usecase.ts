// ==============================================================================
// features/rfq/domain/usecases/send-email-reply.usecase.ts
// ==============================================================================
import type { IRfqRepository, SendEmailReplyInput } from "../repositories/i-rfq.repository";

export class SendEmailReplyUseCase {
  constructor(private readonly repository: IRfqRepository) {}

  async execute(input: SendEmailReplyInput): Promise<void> {
    return this.repository.sendEmailReply(input);
  }
}
