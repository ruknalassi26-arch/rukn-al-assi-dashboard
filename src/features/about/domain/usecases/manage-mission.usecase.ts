// ==============================================================================
// features/about/domain/usecases/manage-mission.usecase.ts
// Use cases for Company Mission management
// ==============================================================================
import type { MissionEntity } from "../entities/about.entity";
import type { IAboutRepository } from "../repositories/i-about.repository";

export class GetMissionUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<MissionEntity | null> {
    return this.repo.getMission();
  }
}

export class UpdateMissionUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(data: Partial<MissionEntity>): Promise<MissionEntity> {
    const result = await this.repo.updateMission(data);
    await this.repo.logActivity("updated", "settings", "Company Mission Updated");
    return result;
  }
}
