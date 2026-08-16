// ==============================================================================
// features/leave-management/domain/entities/leave-policy.entity.ts
// Domain entity for leave policy
// ==============================================================================

import type { LeaveUnit } from "../enums/leave.enums";
import type { LeaveTypeEntity } from "./leave-type.entity";

export interface LeavePolicyEntity {
  id: string;
  leaveTypeId: string;
  allocationAmount: number;
  allocationUnit: LeaveUnit;
  periodMonths: number;
  hoursPerDay: number;
  isActive: boolean;
  leaveType?: LeaveTypeEntity | null;
}
