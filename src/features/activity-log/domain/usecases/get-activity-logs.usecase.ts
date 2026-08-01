// ==============================================================================
// features/activity-log/domain/usecases/get-activity-logs.usecase.ts
// ==============================================================================
import type { IActivityLogRepository, ActivityLogFilters, PaginatedActivityLogs } from "../repositories/i-activity-log.repository";

export class GetActivityLogsUseCase {
  constructor(private readonly repository: IActivityLogRepository) {}

  async execute(filters: ActivityLogFilters = {}): Promise<PaginatedActivityLogs> {
    return this.repository.getActivityLogs(filters);
  }
}
