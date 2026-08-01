// ==============================================================================
// features/profile/domain/usecases/update-profile.usecase.ts
// ==============================================================================
import type { IProfileRepository, UpdateProfileInput } from "../repositories/i-profile.repository";
import type { UserProfileEntity } from "@features/authentication/domain/entities/user-profile.entity";

export class UpdateProfileUseCase {
  constructor(private readonly repository: IProfileRepository) {}

  async execute(input: UpdateProfileInput): Promise<UserProfileEntity> {
    return this.repository.updateProfile(input);
  }
}
