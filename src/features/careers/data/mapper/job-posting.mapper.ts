// ==============================================================================
// features/careers/data/mapper/job-posting.mapper.ts
// Maps Supabase JobPostingJoinDTO to JobPostingEntity
// ==============================================================================

import type { JobPostingJoinDTO, JobPostingTranslationDTO } from "../dto/job-posting.dto";
import type { JobPostingEntity } from "../../domain/entities/career.entity";
import type { EmploymentType, JobPostingStatus } from "../../domain/enums/career.enum";

export function toJobPostingEntity(dto: JobPostingJoinDTO): JobPostingEntity {
  const transList = dto.job_posting_translations || [];
  const emptyTrans: Partial<JobPostingTranslationDTO> = {};
  const en = transList.find((t) => t.language_code === "en") || emptyTrans;
  const ar = transList.find((t) => t.language_code === "ar") || emptyTrans;
  const ku = transList.find((t) => t.language_code === "ku" || t.language_code === "ckb") || emptyTrans;

  const primarySlug = en.slug || ar.slug || ku.slug || "";
  const primaryTitle = en.title || ar.title || ku.title || "Untitled Job";

  return {
    id: dto.id,
    slug: primarySlug,
    titleEn: en.title || primaryTitle,
    titleAr: ar.title || null,
    titleKu: ku.title || null,
    descriptionEn: en.description || null,
    descriptionAr: ar.description || null,
    descriptionKu: ku.description || null,
    requirementsEn: en.requirements || null,
    requirementsAr: ar.requirements || null,
    requirementsKu: ku.requirements || null,
    department: dto.department ?? null,
    employmentType: (dto.employment_type as EmploymentType) || "full_time",
    location: dto.location ?? null,
    closingDate: dto.closes_at ?? null,
    sortOrder: dto.sort_order ?? 0,
    status: (dto.status as JobPostingStatus) || "draft",
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
