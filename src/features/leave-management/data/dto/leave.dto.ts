// ==============================================================================
// features/leave-management/data/dto/leave.dto.ts
// Supabase Data Transfer Objects (DTOs) for leave management
// ==============================================================================

export interface EmployeeProfileDto {
  id: string;
  auth_user_id?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  department?: string | null;
  job_title?: string | null;
  employment_start_date?: string | null;
  is_active: boolean;
}

export interface LeaveTypeDto {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  unit: "day" | "hour" | string;
  is_paid: boolean;
  is_active: boolean;
  sort_order?: number | null;
}

export interface LeavePolicyDto {
  id: string;
  leave_type_id: string;
  allocation_amount: number;
  allocation_unit: "day" | "hour" | string;
  period_months: number;
  hours_per_day: number;
  is_active: boolean;
  leave_types?: LeaveTypeDto | null;
}

export interface LeaveBalanceDto {
  id: string;
  employee_id: string;
  leave_type_id: string;
  period_start: string;
  period_end: string;
  allocated_amount: number;
  used_amount: number;
  pending_amount: number;
  leave_types?: LeaveTypeDto | null;
  employee_profiles?: EmployeeProfileDto | null;
}

export interface LeaveRequestDto {
  id: string;
  employee_id: string;
  leave_type_id: string;
  alternative_employee_id?: string | null;
  request_unit: "day" | "hour" | string;
  requested_days?: number | null;
  requested_hours?: number | null;
  from_date: string;
  to_date: string;
  return_to_work_date: string;
  note?: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled" | string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  reviewer_note?: string | null;
  created_at: string;
  updated_at?: string;

  // Joined fields from Supabase / RPC
  leave_types?: LeaveTypeDto | null;
  employee_profiles?: EmployeeProfileDto | null;
  alternative_employee?: EmployeeProfileDto | null;

  // Potential flat fields from RPC
  leave_type_name?: string | null;
  leave_type_code?: string | null;
  leave_type_unit?: string | null;
  employee_name?: string | null;
  employee_email?: string | null;
  employee_department?: string | null;
  alternative_employee_name?: string | null;
}

export interface LeaveDashboardRpcDto {
  // Support either single object or array of cards/balances
  summary?: {
    remaining_balance?: number;
    remainingBalance?: number;
    approved?: number;
    approved_count?: number;
    approvedCount?: number;
    pending?: number;
    pending_count?: number;
    pendingCount?: number;
    rejected?: number;
    rejected_count?: number;
    rejectedCount?: number;
  };
  // Flat properties on root
  remaining_balance?: number;
  remainingBalance?: number;
  approved?: number;
  approved_count?: number;
  approvedCount?: number;
  pending?: number;
  pending_count?: number;
  pendingCount?: number;
  rejected?: number;
  rejected_count?: number;
  rejectedCount?: number;

  balances?: LeaveBalanceDto[];
  recent_requests?: LeaveRequestDto[];
  recentRequests?: LeaveRequestDto[];
  requests?: LeaveRequestDto[];
  employee?: EmployeeProfileDto;
  profile?: EmployeeProfileDto;
}
