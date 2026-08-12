// ==============================================================================
// features/careers/data/dto/career-application.dto.ts
// DTO matching public.career_applications database schema
// ==============================================================================

export interface CareerApplicationDTO {
  id: string;
  job_posting_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  cover_message: string | null;
  cv_file_url: string;
  cv_file_name: string;
  status: "new" | "reviewed" | "shortlisted" | "rejected" | "hired";
  created_at: string;
  job_postings?: {
    id: string;
    job_posting_translations?: Array<{
      language_code: string;
      title: string;
    }>;
  } | null;
}
