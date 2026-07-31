// ==============================================================================
// features/authentication/domain/usecases/send-password-reset.usecase.ts
// ==============================================================================
import type { IAuthRepository, SendPasswordResetInput } from "../repositories/i-auth.repository";

export class SendPasswordResetUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(input: SendPasswordResetInput): Promise<void> {
    return this.repository.sendPasswordResetEmail(input);
  }
}
