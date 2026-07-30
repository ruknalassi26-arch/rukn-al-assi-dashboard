// ==============================================================================
// features/dashboard/domain/usecases/get-latest-rfqs.usecase.ts
// Fetches latest RFQ requests for the dashboard table
// ==============================================================================
import type { LatestRfqEntity } from "../entities/dashboard.entity";
import type { IDashboardRepository } from "../repositories/i-dashboard.repository";

export class GetLatestRfqsUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute(limit: number = 5): Promise<LatestRfqEntity[]> {
    return this.repository.getLatestRfqs(limit);
  }
}
