// ==============================================================================
// features/authentication/domain/usecases/get-current-user.usecase.ts
// ==============================================================================
import type { IAuthRepository } from "../repositories/i-auth.repository";
import type { UserProfileEntity } from "../entities/user-profile.entity";

export class GetCurrentUserUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(): Promise<UserProfileEntity | null> {
    return this.repository.getCurrentUser();
  }
}
