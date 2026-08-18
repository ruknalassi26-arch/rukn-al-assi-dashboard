// ==============================================================================
// features/vacation/domain/repositories/i-employee.repository.ts
// Interface for Employee Domain Repository
// ==============================================================================

import type { EmployeeProfileEntity } from "../entities/employee.entity";

export interface IEmployeeRepository {
  getCurrentEmployeeProfile(): Promise<EmployeeProfileEntity>;
  adminGetEmployees(search?: string): Promise<EmployeeProfileEntity[]>;
}
