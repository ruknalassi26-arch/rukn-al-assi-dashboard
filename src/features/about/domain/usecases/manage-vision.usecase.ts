// ==============================================================================
// features/about/domain/usecases/manage-vision.usecase.ts
// Use cases for Company Vision management
// ==============================================================================
import type { VisionEntity } from "../entities/about.entity";
import type { IAboutRepository } from "../repositories/i-about.repository";

export class GetVisionUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<VisionEntity | null> {
    return this.repo.getVision();
  }
}

export class UpdateVisionUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(data: Partial<VisionEntity>): Promise<VisionEntity> {
    const result = await this.repo.updateVision(data);
    await this.repo.logActivity("updated", "settings", "Company Vision Updated");
    return result;
  }
}
