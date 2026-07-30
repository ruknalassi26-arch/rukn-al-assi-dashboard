// ==============================================================================
// features/homepage/domain/usecases/manage-hero.usecase.ts
// Use cases for Hero Section management
// ==============================================================================
import type { HeroSlideEntity } from "../entities/homepage.entity";
import type { IHomepageRepository } from "../repositories/i-homepage.repository";

export class GetHeroSlidesUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(): Promise<HeroSlideEntity[]> {
    return this.repo.getHeroSlides();
  }
}

export class CreateHeroSlideUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(slide: Omit<HeroSlideEntity, "id" | "createdAt" | "updatedAt">): Promise<HeroSlideEntity> {
    const result = await this.repo.createHeroSlide(slide);
    await this.repo.logActivity("created", "homepage", `Hero Slide: ${slide.titleEn}`);
    return result;
  }
}

export class UpdateHeroSlideUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(id: string, slide: Partial<HeroSlideEntity>): Promise<HeroSlideEntity> {
    const result = await this.repo.updateHeroSlide(id, slide);
    await this.repo.logActivity("updated", "homepage", `Hero Slide Updated: ${slide.titleEn ?? id}`);
    return result;
  }
}

export class DeleteHeroSlideUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteHeroSlide(id);
    await this.repo.logActivity("deleted", "homepage", `Hero Slide Deleted`);
  }
}

export class ReorderHeroSlidesUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderHeroSlides(orderedIds);
    await this.repo.logActivity("updated", "homepage", "Hero Slides Order Changed");
  }
}
