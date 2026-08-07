// ==============================================================================
// shared/hooks/careers/use-career-hooks.ts
// React Query Hooks for Job Postings and Career Applications
// ==============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SupabaseJobPostingRepository } from "@features/careers/data/repositories/supabase-job-posting.repository";
import { SupabaseCareerApplicationRepository } from "@features/careers/data/repositories/supabase-career-application.repository";
import { JobPostingUseCases } from "@features/careers/domain/use-cases/job-posting.use-case";
import { CareerApplicationUseCases } from "@features/careers/domain/use-cases/career-application.use-case";
import type { GetJobPostingsOptions } from "@features/careers/domain/repositories/job-posting.repository";
import type { GetCareerApplicationsOptions } from "@features/careers/domain/repositories/career-application.repository";
import type { JobPostingEntity, CareerApplicationEntity } from "@features/careers/domain/entities/career.entity";
import type { JobPostingStatus, ApplicationStatus } from "@features/careers/domain/enums/career.enum";

const jobPostingRepo = new SupabaseJobPostingRepository();
const jobPostingUseCases = new JobPostingUseCases(jobPostingRepo);

const applicationRepo = new SupabaseCareerApplicationRepository();
const applicationUseCases = new CareerApplicationUseCases(applicationRepo);

export const CAREER_QUERY_KEYS = {
  jobPostings: (options?: GetJobPostingsOptions) => ["job-postings", options],
  jobPostingDetail: (idOrSlug: string) => ["job-posting-detail", idOrSlug],
  publishedJobPostings: () => ["published-job-postings"],
  careerApplications: (options?: GetCareerApplicationsOptions) => ["career-applications", options],
  careerApplicationDetail: (id: string) => ["career-application-detail", id],
};

// --- Job Posting Hooks ---

export function useJobPostings(options?: GetJobPostingsOptions) {
  return useQuery({
    queryKey: CAREER_QUERY_KEYS.jobPostings(options),
    queryFn: () => jobPostingUseCases.getPostings(options),
  });
}

export function useJobPostingBySlug(slug: string) {
  return useQuery({
    queryKey: CAREER_QUERY_KEYS.jobPostingDetail(slug),
    queryFn: () => jobPostingUseCases.getPostingBySlug(slug),
    enabled: !!slug,
  });
}

export function useJobPostingById(id: string) {
  return useQuery({
    queryKey: CAREER_QUERY_KEYS.jobPostingDetail(id),
    queryFn: () => jobPostingUseCases.getPostingById(id),
    enabled: !!id,
  });
}

export function usePublishedJobPostings() {
  return useQuery({
    queryKey: CAREER_QUERY_KEYS.publishedJobPostings(),
    queryFn: () => jobPostingUseCases.getPublishedPostings(),
  });
}

export function useCreateJobPosting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (posting: Omit<JobPostingEntity, "id" | "createdAt" | "updatedAt">) =>
      jobPostingUseCases.createPosting(posting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-postings"] });
      queryClient.invalidateQueries({ queryKey: CAREER_QUERY_KEYS.publishedJobPostings() });
      toast.success("Job posting created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create job posting.");
    },
  });
}

export function useUpdateJobPosting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<JobPostingEntity, "id" | "createdAt" | "updatedAt">>;
    }) => jobPostingUseCases.updatePosting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-postings"] });
      queryClient.invalidateQueries({ queryKey: CAREER_QUERY_KEYS.publishedJobPostings() });
      toast.success("Job posting updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update job posting.");
    },
  });
}

export function useDeleteJobPosting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobPostingUseCases.deletePosting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-postings"] });
      queryClient.invalidateQueries({ queryKey: CAREER_QUERY_KEYS.publishedJobPostings() });
      toast.success("Job posting deleted.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete job posting.");
    },
  });
}

export function useUpdateJobPostingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobPostingStatus }) =>
      jobPostingUseCases.updatePostingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-postings"] });
      queryClient.invalidateQueries({ queryKey: CAREER_QUERY_KEYS.publishedJobPostings() });
      toast.success("Job status updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update job status.");
    },
  });
}

// --- Career Application Hooks ---

export function useCareerApplications(options?: GetCareerApplicationsOptions) {
  return useQuery({
    queryKey: CAREER_QUERY_KEYS.careerApplications(options),
    queryFn: () => applicationUseCases.getApplications(options),
  });
}

export function useCareerApplicationById(id: string) {
  return useQuery({
    queryKey: CAREER_QUERY_KEYS.careerApplicationDetail(id),
    queryFn: () => applicationUseCases.getApplicationById(id),
    enabled: !!id,
  });
}

export function useSubmitCareerApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (app: Omit<CareerApplicationEntity, "id" | "createdAt" | "updatedAt">) =>
      applicationUseCases.submitApplication(app),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-applications"] });
      toast.success("Application submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit application.");
    },
  });
}

export function useUpdateCareerApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: ApplicationStatus;
      notes?: string | null;
    }) => applicationUseCases.updateApplicationStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-applications"] });
      toast.success("Application status updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update application status.");
    },
  });
}

export function useDeleteCareerApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationUseCases.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-applications"] });
      toast.success("Application deleted.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete application.");
    },
  });
}

export function useUploadCv() {
  return useMutation({
    mutationFn: (file: File) => applicationUseCases.uploadCv(file),
    onError: (error: Error) => {
      toast.error(error.message || "CV Upload failed.");
    },
  });
}
