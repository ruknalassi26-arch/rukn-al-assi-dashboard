// ==============================================================================
// features/vacation/data/mapper/vacation.mapper.ts
// Vacation & Leave Data Mappers
// ==============================================================================

import {
  VacationTypeEntity,
  VacationBalanceEntity,
  VacationRequestEntity,
  MyVacationDashboardEntity,
} from "../../domain/entities/vacation.entity";
import type {
  VacationTypeDto,
  VacationBalanceDto,
  VacationRequestDto,
  MyVacationDashboardDto,
} from "../dto/vacation.dto";

export function toVacationTypeEntity(dto: VacationTypeDto): VacationTypeEntity {
  return new VacationTypeEntity({
    id: dto.id,
    code: dto.code,
    name: dto.name,
    description: dto.description ?? null,
    unit: dto.unit,
    usesBalance: dto.usesBalance ?? dto.uses_balance ?? true,
    requiresApproval: dto.requiresApproval ?? dto.requires_approval ?? true,
    isActive: dto.isActive ?? dto.is_active ?? true,
    sortOrder: dto.sortOrder ?? dto.sort_order ?? 0,
  });
}

export function toVacationBalanceEntity(dto: VacationBalanceDto): VacationBalanceEntity {
  return new VacationBalanceEntity({
    id: dto.id,
    vacationTypeId: dto.vacationTypeId ?? dto.vacation_type_id ?? "",
    vacationType: dto.vacationType ?? { code: "vacation", name: "Vacation" },
    periodStart: dto.periodStart ?? dto.period_start ?? "",
    periodEnd: dto.periodEnd ?? dto.period_end ?? "",
    allocated: Number(dto.allocated ?? dto.allocated_amount ?? 0),
    used: Number(dto.used ?? 0),
    pending: Number(dto.pending ?? 0),
    remaining: Number(dto.remaining ?? 0),
  });
}

export function toVacationRequestEntity(dto: VacationRequestDto): VacationRequestEntity {
  return new VacationRequestEntity({
    id: dto.id,
    employeeId: dto.employeeId ?? dto.employee_id ?? dto.employee?.id ?? undefined,
    employee: dto.employee
      ? {
          id: dto.employee.id,
          fullName: dto.employee.fullName ?? dto.employee.full_name ?? "Employee",
          email: dto.employee.email,
          department: dto.employee.department ?? null,
          jobTitle: dto.employee.jobTitle ?? dto.employee.job_title ?? null,
          avatarUrl: dto.employee.avatarUrl ?? dto.employee.avatar_url ?? null,
        }
      : null,
    vacationTypeId: dto.vacationTypeId ?? dto.vacation_type_id ?? undefined,
    vacationType: dto.vacationType,
    alternativeEmployeeId: dto.alternativeEmployeeId ?? dto.alternative_employee_id ?? null,
    requestedDays: Number(dto.requestedDays ?? dto.requested_days ?? 0),
    requestedHours: Number(dto.requestedHours ?? dto.requested_hours ?? 0),
    fromDate: dto.fromDate ?? dto.from_date ?? "",
    toDate: dto.toDate ?? dto.to_date ?? "",
    returnToWorkDate: dto.returnToWorkDate ?? dto.return_to_work_date ?? "",
    note: dto.note ?? null,
    status: dto.status,
    reviewedBy: dto.reviewedBy ?? dto.reviewed_by ?? null,
    reviewedAt: dto.reviewedAt ?? dto.reviewed_at ?? null,
    reviewerNote: dto.reviewerNote ?? dto.reviewer_note ?? null,
    createdAt: dto.createdAt ?? dto.created_at ?? "",
  });
}

export function toMyVacationDashboardEntity(
  dto: MyVacationDashboardDto
): MyVacationDashboardEntity {
  return new MyVacationDashboardEntity({
    employee: {
      id: dto.employee.id,
      fullName: dto.employee.fullName ?? dto.employee.full_name ?? "Employee",
      email: dto.employee.email,
      department: dto.employee.department ?? null,
      jobTitle: dto.employee.jobTitle ?? dto.employee.job_title ?? null,
      avatarUrl: dto.employee.avatarUrl ?? dto.employee.avatar_url ?? null,
    },
    summary: {
      pending: Number(dto.summary?.pending ?? 0),
      approved: Number(dto.summary?.approved ?? 0),
      rejected: Number(dto.summary?.rejected ?? 0),
      cancelled: Number(dto.summary?.cancelled ?? 0),
    },
    balances: (dto.balances || []).map(toVacationBalanceEntity),
    recentRequests: (dto.recentRequests || []).map(toVacationRequestEntity),
  });
}
