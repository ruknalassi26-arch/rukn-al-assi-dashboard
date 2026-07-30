// ==============================================================================
// features/dashboard/domain/usecases/get-recent-activity.usecase.ts
// Fetches recent admin activity log entries for the timeline
// ==============================================================================
import type { ActivityLogEntity } from "../entities/dashboard.entity";
import type { IDashboardRepository } from "../repositories/i-dashboard.repository";

export class GetRecentActivityUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute(limit: number = 10): Promise<ActivityLogEntity[]> {
    return this.repository.getRecentActivity(limit);
  }
}
