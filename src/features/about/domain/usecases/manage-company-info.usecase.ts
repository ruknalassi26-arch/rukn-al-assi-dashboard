// ==============================================================================
// features/about/domain/usecases/manage-company-info.usecase.ts
// Use cases for Company Information management
// ==============================================================================
import type { CompanyInfoEntity } from "../entities/about.entity";
import type { IAboutRepository } from "../repositories/i-about.repository";

export class GetCompanyInfoUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<CompanyInfoEntity | null> {
    return this.repo.getCompanyInfo();
  }
}

export class UpdateCompanyInfoUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(data: Partial<CompanyInfoEntity>): Promise<CompanyInfoEntity> {
    const result = await this.repo.updateCompanyInfo(data);
    await this.repo.logActivity("updated", "settings", "Company Info Updated");
    return result;
  }
}
