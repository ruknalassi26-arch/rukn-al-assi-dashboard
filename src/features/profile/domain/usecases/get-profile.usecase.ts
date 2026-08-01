// ==============================================================================
// features/profile/domain/usecases/get-profile.usecase.ts
// ==============================================================================
import type { IProfileRepository } from "../repositories/i-profile.repository";
import type { UserProfileEntity } from "@features/authentication/domain/entities/user-profile.entity";

export class GetProfileUseCase {
  constructor(private readonly repository: IProfileRepository) {}

  async execute(): Promise<UserProfileEntity> {
    return this.repository.getProfile();
  }
}
