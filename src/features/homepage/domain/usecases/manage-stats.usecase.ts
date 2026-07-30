// ==============================================================================
// features/homepage/domain/usecases/manage-stats.usecase.ts
// Use cases for Company Statistics management
// ==============================================================================
import type { CompanyStatEntity } from "../entities/homepage.entity";
import type { IHomepageRepository } from "../repositories/i-homepage.repository";

export class GetCompanyStatsUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(): Promise<CompanyStatEntity[]> {
    return this.repo.getCompanyStats();
  }
}

export class CreateCompanyStatUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(stat: Omit<CompanyStatEntity, "id" | "createdAt" | "updatedAt">): Promise<CompanyStatEntity> {
    const result = await this.repo.createCompanyStat(stat);
    await this.repo.logActivity("created", "homepage", `Company Stat: ${stat.titleEn}`);
    return result;
  }
}

export class UpdateCompanyStatUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(id: string, stat: Partial<CompanyStatEntity>): Promise<CompanyStatEntity> {
    const result = await this.repo.updateCompanyStat(id, stat);
    await this.repo.logActivity("updated", "homepage", `Company Stat Updated: ${stat.titleEn ?? id}`);
    return result;
  }
}

export class DeleteCompanyStatUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteCompanyStat(id);
    await this.repo.logActivity("deleted", "homepage", "Company Stat Deleted");
  }
}

export class ReorderCompanyStatsUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderCompanyStats(orderedIds);
    await this.repo.logActivity("updated", "homepage", "Statistics Order Changed");
  }
}

export class BulkDeleteCompanyStatsUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(ids: string[]): Promise<void> {
    await this.repo.bulkDeleteCompanyStats(ids);
    await this.repo.logActivity("deleted", "homepage", `Bulk Deleted ${ids.length} Company Stats`);
  }
}

export class BulkUpdateCompanyStatsStatusUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(ids: string[], status: "active" | "draft"): Promise<void> {
    await this.repo.bulkUpdateCompanyStatsStatus(ids, status);
    await this.repo.logActivity("updated", "homepage", `Bulk Updated ${ids.length} Stats to ${status}`);
  }
}
