// ==============================================================================
// features/profile/domain/usecases/change-password.usecase.ts
// ==============================================================================
import type { IProfileRepository, ChangePasswordInput } from "../repositories/i-profile.repository";

export class ChangeProfilePasswordUseCase {
  constructor(private readonly repository: IProfileRepository) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    return this.repository.changePassword(input);
  }
}
