// ==============================================================================
// features/settings/domain/usecases/update-settings.usecase.ts
// ==============================================================================
import type { ISettingsRepository, UpdateWebsiteSettingsInput } from "../repositories/i-settings.repository";
import type { WebsiteSettingsEntity } from "../entities/website-settings.entity";

export class UpdateSettingsUseCase {
  constructor(private readonly repository: ISettingsRepository) {}

  async execute(input: UpdateWebsiteSettingsInput): Promise<WebsiteSettingsEntity> {
    return this.repository.updateSettings(input);
  }
}
