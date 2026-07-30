// ==============================================================================
// features/homepage/domain/usecases/manage-about.usecase.ts
// Use cases for About Preview section management
// ==============================================================================
import type { AboutPreviewEntity } from "../entities/homepage.entity";
import type { IHomepageRepository } from "../repositories/i-homepage.repository";

export class GetAboutPreviewUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(): Promise<AboutPreviewEntity | null> {
    return this.repo.getAboutPreview();
  }
}

export class UpdateAboutPreviewUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(data: Partial<AboutPreviewEntity>): Promise<AboutPreviewEntity> {
    const result = await this.repo.updateAboutPreview(data);
    await this.repo.logActivity("updated", "homepage", "About Preview Section Updated");
    return result;
  }
}
