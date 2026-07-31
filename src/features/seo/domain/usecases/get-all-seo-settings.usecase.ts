// ==============================================================================
// features/seo/domain/usecases/get-all-seo-settings.usecase.ts
// ==============================================================================
import type { ISeoRepository } from "../repositories/i-seo.repository";
import type { SeoSettingEntity } from "../entities/seo-setting.entity";

export class GetAllSeoSettingsUseCase {
  constructor(private readonly repository: ISeoRepository) {}

  async execute(): Promise<SeoSettingEntity[]> {
    return this.repository.getAllSeoSettings();
  }
}
