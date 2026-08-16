// ==============================================================================
// features/leave-management/domain/repositories/i-employee.repository.ts
// Repository interface for employee profile operations
// ==============================================================================

import type { EmployeeProfileEntity } from "../entities";

export interface IEmployeeRepository {
  /**
   * Get current authenticated employee ID
   * Calls get_current_employee_id() RPC
   */
  getCurrentEmployeeId(): Promise<string | null>;

  /**
   * Get all active employees for selection (e.g. alternative employee dropdown)
   * Calls get_active_employees() RPC with ZERO parameters
   */
  getActiveEmployees(): Promise<EmployeeProfileEntity[]>;

  /**
   * Get current employee profile if exists
   */
  getCurrentEmployeeProfile(): Promise<EmployeeProfileEntity | null>;
}
