// ==============================================================================
// features/leave-management/domain/entities/leave-type.entity.ts
// Domain entity for leave type
// ==============================================================================

import type { LeaveUnit } from "../enums/leave.enums";

export interface LeaveTypeEntity {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  unit: LeaveUnit;
  isPaid: boolean;
  isActive: boolean;
  sortOrder: number;
}
