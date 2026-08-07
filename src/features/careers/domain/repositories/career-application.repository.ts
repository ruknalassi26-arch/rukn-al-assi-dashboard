// ==============================================================================
// features/careers/domain/repositories/career-application.repository.ts
// Career Application Repository Interface
// ==============================================================================

import type { CareerApplicationEntity } from "../entities/career.entity";
import type { ApplicationStatus } from "../enums/career.enum";

export interface GetCareerApplicationsOptions {
  search?: string;
  status?: ApplicationStatus | "all";
  jobId?: string;
  limit?: number;
  offset?: number;
}

export interface CareerApplicationRepository {
  getApplications(options?: GetCareerApplicationsOptions): Promise<{ data: CareerApplicationEntity[]; total: number }>;
  getApplicationById(id: string): Promise<CareerApplicationEntity | null>;
  submitApplication(application: Omit<CareerApplicationEntity, "id" | "createdAt" | "updatedAt">): Promise<CareerApplicationEntity>;
  updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string | null): Promise<CareerApplicationEntity>;
  deleteApplication(id: string): Promise<void>;
  uploadCv(file: File): Promise<{ url: string; fileName: string }>;
}
