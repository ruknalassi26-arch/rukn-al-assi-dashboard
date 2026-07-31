// ==============================================================================
// features/seo/domain/usecases/get-seo-setting-by-page-key.usecase.ts
// ==============================================================================
import type { ISeoRepository } from "../repositories/i-seo.repository";
import type { SeoSettingEntity, SeoPageKey } from "../entities/seo-setting.entity";

export class GetSeoSettingByPageKeyUseCase {
  constructor(private readonly repository: ISeoRepository) {}

  async execute(pageKey: SeoPageKey): Promise<SeoSettingEntity | null> {
    return this.repository.getSeoSettingByPageKey(pageKey);
  }
}
