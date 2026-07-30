// ==============================================================================
// features/dashboard/domain/repositories/i-dashboard.repository.ts
// Repository CONTRACT (interface) for Dashboard statistics
// ==============================================================================
import type {
  DashboardStatsEntity,
  DashboardChartsEntity,
  LatestRfqEntity,
  LatestContactEntity,
  ActivityLogEntity,
} from "../entities/dashboard.entity";

export interface IDashboardRepository {
  getStats(): Promise<DashboardStatsEntity>;
  getCharts(months?: number): Promise<DashboardChartsEntity>;
  getLatestRfqs(limit?: number): Promise<LatestRfqEntity[]>;
  getLatestContacts(limit?: number): Promise<LatestContactEntity[]>;
  getRecentActivity(limit?: number): Promise<ActivityLogEntity[]>;
}
