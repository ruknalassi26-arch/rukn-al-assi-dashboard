// ==============================================================================
// features/leave-management/domain/entities/leave-dashboard.entity.ts
// Domain entity for employee leave dashboard data
// ==============================================================================

import type { LeaveBalanceEntity } from "./leave-balance.entity";
import type { LeaveRequestEntity } from "./leave-request.entity";
import type { EmployeeProfileEntity } from "./employee-profile.entity";

export interface LeaveDashboardSummary {
  remainingBalance: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export interface LeaveDashboardEntity {
  summary: LeaveDashboardSummary;
  balances: LeaveBalanceEntity[];
  recentRequests: LeaveRequestEntity[];
  employee?: EmployeeProfileEntity | null;
}
