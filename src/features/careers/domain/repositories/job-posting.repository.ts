// ==============================================================================
// features/careers/domain/repositories/job-posting.repository.ts
// Job Posting Repository Interface
// ==============================================================================

import type { JobPostingEntity } from "../entities/career.entity";
import type { JobPostingStatus } from "../enums/career.enum";

export interface GetJobPostingsOptions {
  search?: string;
  status?: JobPostingStatus | "all";
  limit?: number;
  offset?: number;
}

export interface JobPostingRepository {
  getPostings(options?: GetJobPostingsOptions): Promise<{ data: JobPostingEntity[]; total: number }>;
  getPostingById(id: string): Promise<JobPostingEntity | null>;
  getPostingBySlug(slug: string): Promise<JobPostingEntity | null>;
  getPublishedPostings(): Promise<JobPostingEntity[]>;
  createPosting(posting: Omit<JobPostingEntity, "id" | "createdAt" | "updatedAt">): Promise<JobPostingEntity>;
  updatePosting(id: string, posting: Partial<Omit<JobPostingEntity, "id" | "createdAt" | "updatedAt">>): Promise<JobPostingEntity>;
  deletePosting(id: string): Promise<void>;
  updatePostingStatus(id: string, status: JobPostingStatus): Promise<JobPostingEntity>;
}
