// ==============================================================================
// features/leave-management/domain/entities/leave-request.entity.ts
// Domain entity for leave request
// ==============================================================================

import type { LeaveRequestStatus, LeaveUnit } from "../enums/leave.enums";
import type { LeaveTypeEntity } from "./leave-type.entity";
import type { EmployeeProfileEntity } from "./employee-profile.entity";

export interface LeaveRequestEntity {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  alternativeEmployeeId?: string | null;
  requestUnit: LeaveUnit;
  requestedDays?: number | null;
  requestedHours?: number | null;
  fromDate: string;
  toDate: string;
  returnToWorkDate: string;
  note?: string | null;
  status: LeaveRequestStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewerNote?: string | null;
  createdAt: string;
  updatedAt: string;

  // Joined/Hydrated entities
  leaveType?: LeaveTypeEntity | null;
  employee?: EmployeeProfileEntity | null;
  alternativeEmployee?: EmployeeProfileEntity | null;
}
