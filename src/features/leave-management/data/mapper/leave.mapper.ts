// ==============================================================================
// features/leave-management/data/mapper/leave.mapper.ts
// Mappers between Supabase DTOs and Domain Entities
// ==============================================================================

import type {
  EmployeeProfileDto,
  LeaveTypeDto,
  LeavePolicyDto,
  LeaveBalanceDto,
  LeaveRequestDto,
  LeaveDashboardRpcDto,
} from "../dto/leave.dto";
import type {
  EmployeeProfileEntity,
  LeaveTypeEntity,
  LeavePolicyEntity,
  LeaveBalanceEntity,
  LeaveRequestEntity,
  LeaveDashboardEntity,
} from "../../domain/entities";
import type { LeaveRequestStatus, LeaveUnit } from "../../domain/enums/leave.enums";

export function toEmployeeProfileEntity(dto: EmployeeProfileDto): EmployeeProfileEntity {
  return {
    id: dto.id,
    authUserId: dto.auth_user_id ?? null,
    fullName: dto.full_name || "Employee",
    email: dto.email || "",
    phone: dto.phone ?? null,
    department: dto.department ?? null,
    jobTitle: dto.job_title ?? null,
    employmentStartDate: dto.employment_start_date ?? null,
    isActive: dto.is_active ?? true,
  };
}

export function toLeaveTypeEntity(dto: LeaveTypeDto): LeaveTypeEntity {
  const unit = (dto.unit?.toLowerCase() === "hour" ? "hour" : "day") as LeaveUnit;
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    description: dto.description ?? null,
    unit,
    isPaid: Boolean(dto.is_paid),
    isActive: Boolean(dto.is_active),
    sortOrder: dto.sort_order ?? 0,
  };
}

export function toLeavePolicyEntity(dto: LeavePolicyDto): LeavePolicyEntity {
  const allocationUnit = (dto.allocation_unit?.toLowerCase() === "hour" ? "hour" : "day") as LeaveUnit;
  return {
    id: dto.id,
    leaveTypeId: dto.leave_type_id,
    allocationAmount: Number(dto.allocation_amount ?? 0),
    allocationUnit,
    periodMonths: Number(dto.period_months ?? 12),
    hoursPerDay: Number(dto.hours_per_day ?? 8),
    isActive: Boolean(dto.is_active),
    leaveType: dto.leave_types ? toLeaveTypeEntity(dto.leave_types) : null,
  };
}

export function toLeaveBalanceEntity(dto: LeaveBalanceDto): LeaveBalanceEntity {
  const allocated = Number(dto.allocated_amount ?? 0);
  const used = Number(dto.used_amount ?? 0);
  const pending = Number(dto.pending_amount ?? 0);
  const remaining = Math.max(0, allocated - used - pending);

  return {
    id: dto.id,
    employeeId: dto.employee_id,
    leaveTypeId: dto.leave_type_id,
    periodStart: dto.period_start,
    periodEnd: dto.period_end,
    allocatedAmount: allocated,
    usedAmount: used,
    pendingAmount: pending,
    remainingAmount: remaining,
    leaveType: dto.leave_types ? toLeaveTypeEntity(dto.leave_types) : null,
    employee: dto.employee_profiles ? toEmployeeProfileEntity(dto.employee_profiles) : null,
  };
}

export function toLeaveRequestEntity(dto: LeaveRequestDto): LeaveRequestEntity {
  const requestUnit = (dto.request_unit?.toLowerCase() === "hour" ? "hour" : "day") as LeaveUnit;
  const rawStatus = (dto.status || "pending").toLowerCase();
  const status: LeaveRequestStatus =
    rawStatus === "approved"
      ? "approved"
      : rawStatus === "rejected"
        ? "rejected"
        : rawStatus === "cancelled"
          ? "cancelled"
          : "pending";

  let leaveType: LeaveTypeEntity | null = null;
  if (dto.leave_types) {
    leaveType = toLeaveTypeEntity(dto.leave_types);
  } else if (dto.leave_type_name) {
    leaveType = {
      id: dto.leave_type_id,
      code: dto.leave_type_code || "",
      name: dto.leave_type_name,
      unit: (dto.leave_type_unit?.toLowerCase() === "hour" ? "hour" : "day") as LeaveUnit,
      isPaid: true,
      isActive: true,
      sortOrder: 0,
    };
  }

  let employee: EmployeeProfileEntity | null = null;
  if (dto.employee_profiles) {
    employee = toEmployeeProfileEntity(dto.employee_profiles);
  } else if (dto.employee_name) {
    employee = {
      id: dto.employee_id,
      fullName: dto.employee_name,
      email: dto.employee_email || "",
      department: dto.employee_department || null,
      isActive: true,
    };
  }

  let alternativeEmployee: EmployeeProfileEntity | null = null;
  if (dto.alternative_employee) {
    alternativeEmployee = toEmployeeProfileEntity(dto.alternative_employee);
  } else if (dto.alternative_employee_name && dto.alternative_employee_id) {
    alternativeEmployee = {
      id: dto.alternative_employee_id,
      fullName: dto.alternative_employee_name,
      email: "",
      isActive: true,
    };
  }

  return {
    id: dto.id,
    employeeId: dto.employee_id,
    leaveTypeId: dto.leave_type_id,
    alternativeEmployeeId: dto.alternative_employee_id ?? null,
    requestUnit,
    requestedDays: dto.requested_days !== null && dto.requested_days !== undefined ? Number(dto.requested_days) : null,
    requestedHours: dto.requested_hours !== null && dto.requested_hours !== undefined ? Number(dto.requested_hours) : null,
    fromDate: dto.from_date,
    toDate: dto.to_date,
    returnToWorkDate: dto.return_to_work_date,
    note: dto.note ?? null,
    status,
    reviewedBy: dto.reviewed_by ?? null,
    reviewedAt: dto.reviewed_at ?? null,
    reviewerNote: dto.reviewer_note ?? null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at || dto.created_at,
    leaveType,
    employee,
    alternativeEmployee,
  };
}

export function toLeaveDashboardEntity(dto: LeaveDashboardRpcDto): LeaveDashboardEntity {
  // Extract summary stats gracefully
  const summaryObj = dto.summary || {};
  const remainingBalance =
    summaryObj.remaining_balance ??
    summaryObj.remainingBalance ??
    dto.remaining_balance ??
    dto.remainingBalance ??
    0;

  const approvedCount =
    summaryObj.approved ??
    summaryObj.approved_count ??
    summaryObj.approvedCount ??
    dto.approved ??
    dto.approved_count ??
    dto.approvedCount ??
    0;

  const pendingCount =
    summaryObj.pending ??
    summaryObj.pending_count ??
    summaryObj.pendingCount ??
    dto.pending ??
    dto.pending_count ??
    dto.pendingCount ??
    0;

  const rejectedCount =
    summaryObj.rejected ??
    summaryObj.rejected_count ??
    summaryObj.rejectedCount ??
    dto.rejected ??
    dto.rejected_count ??
    dto.rejectedCount ??
    0;

  const balances = (dto.balances || []).map(toLeaveBalanceEntity);

  const rawRequests = dto.recent_requests || dto.recentRequests || dto.requests || [];
  const recentRequests = rawRequests.map(toLeaveRequestEntity);

  const rawEmployee = dto.employee || dto.profile || null;
  const employee = rawEmployee ? toEmployeeProfileEntity(rawEmployee) : null;

  return {
    summary: {
      remainingBalance: Number(remainingBalance),
      approvedCount: Number(approvedCount),
      pendingCount: Number(pendingCount),
      rejectedCount: Number(rejectedCount),
    },
    balances,
    recentRequests,
    employee,
  };
}
