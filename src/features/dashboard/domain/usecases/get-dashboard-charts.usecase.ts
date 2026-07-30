// ==============================================================================
// features/dashboard/domain/usecases/get-dashboard-charts.usecase.ts
// Fetches monthly chart data for the dashboard
// ==============================================================================
import type { DashboardCharts } from "../entities/dashboard.entity";
import type { IDashboardRepository } from "../repositories/i-dashboard.repository";

export class GetDashboardChartsUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute(months: number = 6): Promise<DashboardCharts> {
    return this.repository.getCharts(months);
  }
}
