// ==============================================================================
// features/dashboard/domain/usecases/get-dashboard-stats.usecase.ts
// Fetches aggregated dashboard statistics
// ==============================================================================
import type { DashboardStats } from "../entities/dashboard.entity";
import type { IDashboardRepository } from "../repositories/i-dashboard.repository";

export class GetDashboardStatsUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute(): Promise<DashboardStats> {
    return this.repository.getStats();
  }
}
