// ==============================================================================
// features/homepage/domain/usecases/manage-featured.usecase.ts
// Use cases for Featured Services, Featured Products, and Featured Projects
// ==============================================================================
import type {
  FeaturedServiceEntity,
  FeaturedProductEntity,
  FeaturedProjectEntity,
} from "../entities/homepage.entity";
import type { IHomepageRepository } from "../repositories/i-homepage.repository";

export class GetFeaturedServicesUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(): Promise<FeaturedServiceEntity[]> {
    return this.repo.getFeaturedServices();
  }
}

export class ToggleFeaturedServiceUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {
    await this.repo.toggleServiceFeatured(id, isFeatured, sortOrder);
    await this.repo.logActivity("updated", "service", `Service Featured Toggle (${isFeatured ? "Enabled" : "Disabled"})`);
  }
}

export class GetFeaturedProductsUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(): Promise<FeaturedProductEntity[]> {
    return this.repo.getFeaturedProducts();
  }
}

export class ToggleFeaturedProductUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {
    await this.repo.toggleProductFeatured(id, isFeatured, sortOrder);
    await this.repo.logActivity("updated", "product", `Product Featured Toggle (${isFeatured ? "Enabled" : "Disabled"})`);
  }
}

export class GetFeaturedProjectsUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(): Promise<FeaturedProjectEntity[]> {
    return this.repo.getFeaturedProjects();
  }
}

export class ToggleFeaturedProjectUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {
    await this.repo.toggleProjectFeatured(id, isFeatured, sortOrder);
    await this.repo.logActivity("updated", "project", `Project Featured Toggle (${isFeatured ? "Enabled" : "Disabled"})`);
  }
}
