// ==============================================================================
// features/settings/domain/usecases/get-settings.usecase.ts
// ==============================================================================
import type { ISettingsRepository } from "../repositories/i-settings.repository";
import type { WebsiteSettingsEntity } from "../entities/website-settings.entity";

export class GetSettingsUseCase {
  constructor(private readonly repository: ISettingsRepository) {}

  async execute(): Promise<WebsiteSettingsEntity | null> {
    return this.repository.getSettings();
  }
}
