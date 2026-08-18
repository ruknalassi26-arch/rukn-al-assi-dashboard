// ==============================================================================
// features/vacation/domain/usecases/admin-get-employees.usecase.ts
// ==============================================================================

import type { IEmployeeRepository } from "../repositories/i-employee.repository";
import type { EmployeeProfileEntity } from "../entities/employee.entity";

export class AdminGetEmployeesUseCase {
  constructor(private readonly employeeRepo: IEmployeeRepository) {}

  async execute(search?: string): Promise<EmployeeProfileEntity[]> {
    return this.employeeRepo.adminGetEmployees(search);
  }
}
