// ==============================================================================
// features/dashboard/domain/usecases/get-latest-contacts.usecase.ts
// Fetches latest contact submissions for the dashboard table
// ==============================================================================
import type { LatestContactEntity } from "../entities/dashboard.entity";
import type { IDashboardRepository } from "../repositories/i-dashboard.repository";

export class GetLatestContactsUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute(limit: number = 5): Promise<LatestContactEntity[]> {
    return this.repository.getLatestContacts(limit);
  }
}
