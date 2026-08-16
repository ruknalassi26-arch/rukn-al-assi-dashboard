// ==============================================================================
// features/leave-management/domain/repositories/i-leave.repository.ts
// Repository interface for leave requests, types, balances, policies, and dashboard
// ==============================================================================

import type {
  LeaveTypeEntity,
  LeavePolicyEntity,
  LeaveBalanceEntity,
  LeaveRequestEntity,
  LeaveDashboardEntity,
} from "../entities";
import type { LeaveReviewDecision, LeaveUnit } from "../enums/leave.enums";

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

export interface AdminReviewLeaveRequestInput {
  requestId: string;
  decision: LeaveReviewDecision;
  reviewerNote?: string | null;
}

export interface GetAdminLeaveRequestsFilter {
  search?: string;
  status?: string;
  leaveTypeId?: string;
  fromDate?: string;
  toDate?: string;
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

  /**
   * Admin: Get all leave requests across the company with optional filters
   * Calls admin_get_leave_requests() RPC
   */
  adminGetLeaveRequests(filter?: GetAdminLeaveRequestsFilter): Promise<LeaveRequestEntity[]>;

  /**
   * Admin: Review (approve / reject) a leave request
   * Calls admin_review_leave_request() RPC
   */
  adminReviewLeaveRequest(input: AdminReviewLeaveRequestInput): Promise<void>;

  /**
   * Admin: Get all leave balances
   */
  adminGetLeaveBalances(): Promise<LeaveBalanceEntity[]>;
}
