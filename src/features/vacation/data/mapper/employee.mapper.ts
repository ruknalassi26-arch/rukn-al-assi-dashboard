// ==============================================================================
// features/vacation/data/mapper/employee.mapper.ts
// Employee Data Mappers
// ==============================================================================

import { EmployeeProfileEntity } from "../../domain/entities/employee.entity";
import type { EmployeeProfileDto } from "../dto/employee.dto";

export function toEmployeeProfileEntity(dto: EmployeeProfileDto): EmployeeProfileEntity {
  const anyDto = dto as unknown as Record<string, unknown>;
  const startDate =
    dto.employmentStartDate ??
    dto.employment_start_date ??
    (anyDto?.startDate as string | undefined) ??
    (anyDto?.start_date as string | undefined) ??
    null;

  return new EmployeeProfileEntity({
    id: dto.id,
    authUserId: dto.authUserId ?? dto.auth_user_id ?? "",
    fullName: dto.fullName ?? dto.full_name ?? "Employee",
    email: dto.email,
    phone: dto.phone ?? null,
    department: dto.department ?? null,
    jobTitle: dto.jobTitle ?? dto.job_title ?? null,
    employmentStartDate: startDate,
    avatarUrl: dto.avatarUrl ?? dto.avatar_url ?? null,
    isActive: dto.isActive ?? dto.is_active ?? true,
    createdAt: dto.createdAt ?? dto.created_at ?? undefined,
  });
}
