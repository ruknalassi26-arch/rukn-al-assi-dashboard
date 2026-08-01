// ==============================================================================
// features/profile/domain/usecases/upload-avatar.usecase.ts
// ==============================================================================
import type { IProfileRepository } from "../repositories/i-profile.repository";

export class UploadAvatarUseCase {
  constructor(private readonly repository: IProfileRepository) {}

  async execute(file: File): Promise<string> {
    return this.repository.uploadAvatar(file);
  }
}
