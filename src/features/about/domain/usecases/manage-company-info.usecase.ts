// ==============================================================================
// features/about/domain/usecases/manage-company-info.usecase.ts
// Use cases for Company Information management
// ==============================================================================
import type { CompanyInfoEntity } from "../entities/about.entity";
import type { IAboutRepository, UpdateCompanyInfoTranslationInput } from "../repositories/i-about.repository";

export class GetCompanyInfoUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<CompanyInfoEntity | null> {
    return this.repo.getCompanyInfo();
  }
}

export class UpdateCompanyInfoTranslationUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(input: UpdateCompanyInfoTranslationInput): Promise<CompanyInfoEntity> {
    const result = await this.repo.updateCompanyInfoTranslation(input);
    await this.repo.logActivity("updated", "company_profile", `Company Info (${input.language_code})`);
    return result;
  }
}
