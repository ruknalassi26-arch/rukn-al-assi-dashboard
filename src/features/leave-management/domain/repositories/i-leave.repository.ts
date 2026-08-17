// ==============================================================================
// features/leave-management/domain/repositories/i-leave.repository.ts
// Repository interface for employee vacation & leave operations
// ==============================================================================

import type {
  LeaveTypeEntity,
  LeavePolicyEntity,
  LeaveRequestEntity,
  LeaveDashboardEntity,
} from "../entities";
import type { LeaveUnit } from "../enums/leave.enums";

export interface CreateLeaveRequestInput {
  leaveTypeId: string;
  alternativeEmployeeId?: string | null;
  requestUnit: LeaveUnit;
  requestedDays?: number | null;
  requestedHours?: number | null;
  fromDate: string;
  toDate: string;
  returnToWorkDate: string;
  note?: string | null;
}

export interface ILeaveRepository {
  /**
   * Get dashboard data for the authenticated employee
   * Calls get_my_leave_dashboard() RPC
   */
  getMyLeaveDashboard(): Promise<LeaveDashboardEntity>;

  /**
   * Get leave history for the authenticated employee
   */
  getMyLeaveHistory(): Promise<LeaveRequestEntity[]>;

  /**
   * Create a new leave request for the authenticated employee
   * Calls create_leave_request() RPC
   */
  createLeaveRequest(input: CreateLeaveRequestInput): Promise<LeaveRequestEntity>;

  /**
   * Cancel a pending leave request belonging to current employee
   * Calls cancel_my_leave_request() RPC
   */
  cancelMyLeaveRequest(requestId: string): Promise<void>;

  /**
   * Get all active leave types
   */
  getActiveLeaveTypes(): Promise<LeaveTypeEntity[]>;

  /**
   * Get all active leave policies
   */
  getActiveLeavePolicies(): Promise<LeavePolicyEntity[]>;
}
