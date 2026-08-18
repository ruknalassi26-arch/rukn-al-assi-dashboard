// ==============================================================================
// features/vacation/domain/usecases/admin-get-vacation-requests.usecase.ts
// ==============================================================================

import type { IVacationRepository } from "../repositories/i-vacation.repository";
import type { VacationRequestEntity } from "../entities/vacation.entity";

export class AdminGetVacationRequestsUseCase {
  constructor(private readonly vacationRepo: IVacationRepository) {}

  async execute(
    status?: string,
    employeeId?: string
  ): Promise<VacationRequestEntity[]> {
    return this.vacationRepo.adminGetVacationRequests(status, employeeId);
  }
}
