// ==============================================================================
// features/leave-management/domain/entities/leave-balance.entity.ts
// Domain entity for leave balance
// ==============================================================================

import type { LeaveTypeEntity } from "./leave-type.entity";
import type { EmployeeProfileEntity } from "./employee-profile.entity";

export interface LeaveBalanceEntity {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  periodStart: string;
  periodEnd: string;
  allocatedAmount: number;
  usedAmount: number;
  pendingAmount: number;
  remainingAmount: number;
  leaveType?: LeaveTypeEntity | null;
  employee?: EmployeeProfileEntity | null;
}
