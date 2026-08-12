// ==============================================================================
// features/careers/data/mapper/career-application.mapper.ts
// Maps Supabase CareerApplicationDTO to CareerApplicationEntity and vice-versa
// ==============================================================================

import type { CareerApplicationDTO } from "../dto/career-application.dto";
import type { CareerApplicationEntity } from "../../domain/entities/career.entity";
import type { ApplicationStatus } from "../../domain/enums/career.enum";

export function toCareerApplicationEntity(dto: CareerApplicationDTO): CareerApplicationEntity {
  let jobTitle: string | null = null;
  if (dto.job_postings?.job_posting_translations?.length) {
    const enTrans = dto.job_postings.job_posting_translations.find((t) => t.language_code === "en");
    jobTitle = enTrans?.title || dto.job_postings.job_posting_translations[0]?.title || null;
  }

  return {
    id: dto.id,
    jobId: dto.job_posting_id ?? null,
    jobTitle,
    applicantName: dto.full_name,
    email: dto.email,
    phone: dto.phone,
    coverMessage: dto.cover_message ?? null,
    cvFileUrl: dto.cv_file_url,
    cvFileName: dto.cv_file_name,
    status: (dto.status as ApplicationStatus) ?? "new",
    createdAt: dto.created_at,
    updatedAt: dto.created_at,
  };
}

export function toCareerApplicationInsertPayload(
  application: Omit<CareerApplicationEntity, "id" | "createdAt" | "updatedAt">
) {
  return {
    job_posting_id: application.jobId ?? null,
    full_name: application.applicantName,
    email: application.email,
    phone: application.phone,
    cover_message: application.coverMessage ?? null,
    cv_file_url: application.cvFileUrl,
    cv_file_name: application.cvFileName,
    status: application.status ?? "new",
  };
}
