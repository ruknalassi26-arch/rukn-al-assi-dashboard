// ==============================================================================
// features/careers/domain/use-cases/job-posting.use-case.ts
// Job Posting Domain Use Cases (Encapsulates business logic & validation)
// ==============================================================================

import type { JobPostingRepository, GetJobPostingsOptions } from "../repositories/job-posting.repository";
import type { JobPostingEntity } from "../entities/career.entity";
import type { JobPostingStatus } from "../enums/career.enum";

export class JobPostingUseCases {
  constructor(private readonly repository: JobPostingRepository) {}

  async getPostings(options?: GetJobPostingsOptions) {
    return this.repository.getPostings(options);
  }

  async getPostingById(id: string) {
    if (!id) throw new Error("Job Posting ID is required");
    return this.repository.getPostingById(id);
  }

  async getPostingBySlug(slug: string) {
    if (!slug) throw new Error("Job Posting slug is required");
    return this.repository.getPostingBySlug(slug);
  }

  async getPublishedPostings() {
    return this.repository.getPublishedPostings();
  }

  async createPosting(posting: Omit<JobPostingEntity, "id" | "createdAt" | "updatedAt">) {
    if (!posting.titleEn || !posting.titleAr) {
      throw new Error("Job title in English and Arabic are required");
    }
    if (!posting.slug) {
      throw new Error("Slug is required");
    }
    return this.repository.createPosting(posting);
  }

  async updatePosting(id: string, posting: Partial<Omit<JobPostingEntity, "id" | "createdAt" | "updatedAt">>) {
    if (!id) throw new Error("Job Posting ID is required");
    return this.repository.updatePosting(id, posting);
  }

  async deletePosting(id: string) {
    if (!id) throw new Error("Job Posting ID is required");
    return this.repository.deletePosting(id);
  }

  async updatePostingStatus(id: string, status: JobPostingStatus) {
    if (!id) throw new Error("Job Posting ID is required");
    return this.repository.updatePostingStatus(id, status);
  }
}
