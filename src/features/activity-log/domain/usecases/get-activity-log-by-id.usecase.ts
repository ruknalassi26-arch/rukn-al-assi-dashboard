// ==============================================================================
// features/activity-log/domain/usecases/get-activity-log-by-id.usecase.ts
// ==============================================================================
import type { IActivityLogRepository } from "../repositories/i-activity-log.repository";
import type { ActivityLogEntity } from "../entities/activity-log.entity";

export class GetActivityLogByIdUseCase {
  constructor(private readonly repository: IActivityLogRepository) {}

  async execute(id: string): Promise<ActivityLogEntity | null> {
    return this.repository.getActivityLogById(id);
  }
}
