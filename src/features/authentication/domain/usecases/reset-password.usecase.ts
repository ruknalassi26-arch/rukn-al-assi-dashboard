// ==============================================================================
// features/authentication/domain/usecases/reset-password.usecase.ts
// ==============================================================================
import type { IAuthRepository, ResetPasswordInput } from "../repositories/i-auth.repository";

export class ResetPasswordUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    return this.repository.resetPassword(input);
  }
}
