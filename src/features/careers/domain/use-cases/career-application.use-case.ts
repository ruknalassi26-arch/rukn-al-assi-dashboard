// ==============================================================================
// features/careers/domain/use-cases/career-application.use-case.ts
// Career Application Domain Use Cases (Encapsulates business logic & validation)
// ==============================================================================

import type { CareerApplicationRepository, GetCareerApplicationsOptions } from "../repositories/career-application.repository";
import type { CareerApplicationEntity } from "../entities/career.entity";
import type { ApplicationStatus } from "../enums/career.enum";

export class CareerApplicationUseCases {
  constructor(private readonly repository: CareerApplicationRepository) {}

  async getApplications(options?: GetCareerApplicationsOptions) {
    return this.repository.getApplications(options);
  }

  async getApplicationById(id: string) {
    if (!id) throw new Error("Application ID is required");
    return this.repository.getApplicationById(id);
  }

  async submitApplication(application: Omit<CareerApplicationEntity, "id" | "createdAt" | "updatedAt">) {
    if (!application.applicantName?.trim()) {
      throw new Error("Applicant name is required");
    }
    if (!application.email?.trim() || !application.email.includes("@")) {
      throw new Error("Valid email address is required");
    }
    if (!application.phone?.trim()) {
      throw new Error("Phone number is required");
    }
    if (!application.cvFileUrl) {
      throw new Error("CV file attachment is required");
    }
    return this.repository.submitApplication(application);
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string | null) {
    if (!id) throw new Error("Application ID is required");
    return this.repository.updateApplicationStatus(id, status, notes);
  }

  async deleteApplication(id: string) {
    if (!id) throw new Error("Application ID is required");
    return this.repository.deleteApplication(id);
  }

  async uploadCv(file: File) {
    if (!file) throw new Error("File is required");
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed.");
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit.");
    }
    return this.repository.uploadCv(file);
  }
}
