// ==============================================================================
// features/authentication/domain/usecases/change-password.usecase.ts
// ==============================================================================
import type { IAuthRepository, ChangePasswordInput } from "../repositories/i-auth.repository";

export class ChangePasswordUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    return this.repository.changePassword(input);
  }
}
