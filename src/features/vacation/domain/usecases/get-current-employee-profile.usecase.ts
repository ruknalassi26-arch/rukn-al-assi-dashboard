// ==============================================================================
// features/vacation/domain/usecases/get-current-employee-profile.usecase.ts
// ==============================================================================

import type { IEmployeeRepository } from "../repositories/i-employee.repository";
import type { EmployeeProfileEntity } from "../entities/employee.entity";

export class GetCurrentEmployeeProfileUseCase {
  constructor(private readonly employeeRepo: IEmployeeRepository) {}

  async execute(): Promise<EmployeeProfileEntity> {
    return this.employeeRepo.getCurrentEmployeeProfile();
  }
}
