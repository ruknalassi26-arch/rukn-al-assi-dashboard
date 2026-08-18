// ==============================================================================
// features/vacation/data/dto/vacation.dto.ts
// Vacation & Leave Data Transfer Objects
// ==============================================================================

import type { EmployeeProfileDto } from "./employee.dto";

export interface VacationTypeDto {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  unit: "day" | "hour";
  uses_balance?: boolean;
  usesBalance?: boolean;
  requires_approval?: boolean;
  requiresApproval?: boolean;
  is_active?: boolean;
  isActive?: boolean;
  sort_order?: number;
  sortOrder?: number;
}

export interface VacationBalanceDto {
  id: string;
  vacationTypeId?: string;
  vacation_type_id?: string;
  vacationType?: {
    code: string;
    name: string;
  };
  periodStart?: string;
  period_start?: string;
  periodEnd?: string;
  period_end?: string;
  allocated?: number;
  allocated_amount?: number;
  used?: number;
  pending?: number;
  remaining?: number;
}

export interface VacationRequestDto {
  id: string;
  employeeId?: string;
  employee_id?: string;
  employee?: {
    id: string;
    fullName?: string;
    full_name?: string;
    email: string;
    department?: string | null;
    jobTitle?: string | null;
    job_title?: string | null;
    avatarUrl?: string | null;
    avatar_url?: string | null;
  } | null;
  vacationTypeId?: string;
  vacation_type_id?: string;
  vacationType?:
    | {
        id?: string;
        code?: string;
        name: string;
      }
    | string;
  alternativeEmployeeId?: string | null;
  alternative_employee_id?: string | null;
  requestedDays?: number;
  requested_days?: number;
  requestedHours?: number;
  requested_hours?: number;
  fromDate?: string;
  from_date?: string;
  toDate?: string;
  to_date?: string;
  returnToWorkDate?: string;
  return_to_work_date?: string;
  note?: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  reviewedBy?: string | null;
  reviewed_by?: string | null;
  reviewedAt?: string | null;
  reviewed_at?: string | null;
  reviewerNote?: string | null;
  reviewer_note?: string | null;
  createdAt?: string;
  created_at?: string;
}

export interface MyVacationDashboardDto {
  employee: EmployeeProfileDto;
  summary: {
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
  };
  balances: VacationBalanceDto[];
  recentRequests: VacationRequestDto[];
}
