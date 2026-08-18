// ==============================================================================
// features/homepage/domain/usecases/manage-hero.usecase.ts
// Use cases for single Homepage Hero Section management
// ==============================================================================
import type { HeroSectionEntity } from "../entities/homepage.entity";
import type { IHomepageRepository } from "../repositories/i-homepage.repository";

export class GetHeroSectionUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(): Promise<HeroSectionEntity> {
    return this.repo.getHeroSection();
  }
}

export class UpdateHeroSectionUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(data: Partial<HeroSectionEntity>): Promise<HeroSectionEntity> {
    const result = await this.repo.updateHeroSection(data);
    await this.repo.logActivity("updated", "homepage_sections", `Hero Section: ${data.titleEn ?? "Hero"}`);
    return result;
  }
}
