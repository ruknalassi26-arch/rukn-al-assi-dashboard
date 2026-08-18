// ==============================================================================
// features/vacation/domain/usecases/get-active-colleagues.usecase.ts
// ==============================================================================

import type { IVacationRepository } from "../repositories/i-vacation.repository";
import type { EmployeeProfileEntity } from "../entities/employee.entity";

export class GetActiveColleaguesUseCase {
  constructor(private readonly vacationRepo: IVacationRepository) {}

  async execute(): Promise<EmployeeProfileEntity[]> {
    return this.vacationRepo.getActiveColleagues();
  }
}
