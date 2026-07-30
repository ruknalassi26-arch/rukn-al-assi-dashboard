// ==============================================================================
// features/dashboard/data/mapper/dashboard.mapper.ts
// Mappers converting DTOs to Dashboard Entity Classes
// ==============================================================================
import {
  DashboardStatsEntity,
  ActivityLogEntity,
  LatestRfqEntity,
  LatestContactEntity,
  type DashboardStatsProps,
} from "../../domain/entities/dashboard.entity";
import type { ActivityLogDTO, LatestRfqDTO, LatestContactDTO } from "../dto/dashboard.dto";

export function toDashboardStatsEntity(props: DashboardStatsProps): DashboardStatsEntity {
  return new DashboardStatsEntity(props);
}

export function toActivityLogEntity(dto: ActivityLogDTO): ActivityLogEntity {
  return new ActivityLogEntity({
    id: dto.id,
    action: dto.action,
    entityType: dto.entity_type,
    entityTitle: dto.entity_title,
    userId: dto.user_id,
    userEmail: dto.user_email,
    metadata: (dto.metadata as Record<string, unknown>) ?? null,
    createdAt: new Date(dto.created_at),
  });
}

export function toLatestRfqEntity(dto: LatestRfqDTO): LatestRfqEntity {
  return new LatestRfqEntity({
    id: dto.id,
    fullName: dto.contact_name,
    companyName: dto.company_name,
    email: dto.email,
    status: dto.status,
    createdAt: new Date(dto.created_at),
  });
}

export function toLatestContactEntity(dto: LatestContactDTO): LatestContactEntity {
  return new LatestContactEntity({
    id: dto.id,
    name: dto.name,
    email: dto.email,
    subject: dto.subject,
    status: dto.status,
    createdAt: new Date(dto.created_at),
  });
}
