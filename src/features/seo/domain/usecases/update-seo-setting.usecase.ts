// ==============================================================================
// features/seo/domain/usecases/update-seo-setting.usecase.ts
// ==============================================================================
import type { ISeoRepository, UpdateSeoSettingInput } from "../repositories/i-seo.repository";
import type { SeoSettingEntity } from "../entities/seo-setting.entity";

export class UpdateSeoSettingUseCase {
  constructor(private readonly repository: ISeoRepository) {}

  async execute(input: UpdateSeoSettingInput): Promise<SeoSettingEntity> {
    return this.repository.updateSeoSetting(input);
  }
}
