// ==============================================================================
// features/vacation/domain/usecases/get-my-vacation-dashboard.usecase.ts
// ==============================================================================

import type { IVacationRepository } from "../repositories/i-vacation.repository";
import type { MyVacationDashboardEntity } from "../entities/vacation.entity";

export class GetMyVacationDashboardUseCase {
  constructor(private readonly vacationRepo: IVacationRepository) {}

  async execute(): Promise<MyVacationDashboardEntity> {
    return this.vacationRepo.getMyVacationDashboard();
  }
}
