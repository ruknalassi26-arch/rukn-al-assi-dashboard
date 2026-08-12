// ==============================================================================
// features/careers/data/dto/job-posting.dto.ts
// DTOs matching job_postings and job_posting_translations database schema
// ==============================================================================

export interface JobPostingTranslationDTO {
  job_posting_id: string;
  language_code: string;
  slug: string;
  title: string;
  description?: string | null;
  requirements?: string | null;
}

export interface JobPostingJoinDTO {
  id: string;
  department: string | null;
  employment_type: string;
  location: string | null;
  status: string;
  closes_at: string | null;
  sort_order: number;
  deleted_at: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
  job_posting_translations: JobPostingTranslationDTO[] | null;
}
