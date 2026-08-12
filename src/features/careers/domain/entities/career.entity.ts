// ==============================================================================
// features/careers/domain/entities/career.entity.ts
// Career Domain Entities (JobPosting & CareerApplication)
// ==============================================================================

import type { EmploymentType, JobPostingStatus, ApplicationStatus } from "../enums/career.enum";

export interface JobPostingEntity {
  id: string;
  slug: string;
  titleEn: string;
  titleAr?: string | null;
  titleKu?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  descriptionKu?: string | null;
  requirementsEn?: string | null;
  requirementsAr?: string | null;
  requirementsKu?: string | null;
  department?: string | null;
  employmentType: EmploymentType;
  location?: string | null;
  closingDate?: string | null;
  sortOrder: number;
  status: JobPostingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CareerApplicationEntity {
  id: string;
  jobId?: string | null;
  jobTitle?: string | null;
  applicantName: string;
  email: string;
  phone: string;
  coverMessage?: string | null;
  cvFileUrl: string;
  cvFileName: string;
  status: ApplicationStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}
