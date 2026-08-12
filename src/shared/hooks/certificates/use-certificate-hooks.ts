"use client";
// ==============================================================================
// shared/hooks/certificates/use-certificate-hooks.ts
// TanStack Query Hooks for Certificates Feature
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseCertificateRepository } from "@features/certificates/data/repositories/supabase-certificate.repository";
import {
  GetCertificatesUseCase,
  GetCertificateByIdUseCase,
  CreateCertificateUseCase,
  UpdateCertificateUseCase,
  DeleteCertificateUseCase,
  DuplicateCertificateUseCase,
  BulkDeleteCertificatesUseCase,
  BulkUpdateCertificateStatusUseCase,
} from "@features/certificates/domain/usecases";
import type {
  CertificateFilterParams,
  CreateCertificateInput,
  UpdateCertificateInput,
} from "@features/certificates/domain/repositories/i-certificate.repository";
import type { CertificateStatus } from "@features/certificates/domain/entities/certificate.entity";

const repository = new SupabaseCertificateRepository();
const getCertificatesUseCase = new GetCertificatesUseCase(repository);
const getCertificateByIdUseCase = new GetCertificateByIdUseCase(repository);
const createCertificateUseCase = new CreateCertificateUseCase(repository);
const updateCertificateUseCase = new UpdateCertificateUseCase(repository);
const deleteCertificateUseCase = new DeleteCertificateUseCase(repository);
const duplicateCertificateUseCase = new DuplicateCertificateUseCase(repository);
const bulkDeleteCertificatesUseCase = new BulkDeleteCertificatesUseCase(repository);
const bulkUpdateCertificateStatusUseCase = new BulkUpdateCertificateStatusUseCase(repository);

export function useCertificates(params?: CertificateFilterParams) {
  return useQuery({
    queryKey: queryKeys.certificates.list((params ?? {}) as Record<string, unknown>),
    queryFn: () => getCertificatesUseCase.execute(params),
  });
}

export function useCertificate(id: string) {
  return useQuery({
    queryKey: queryKeys.certificates.detail(id),
    queryFn: () => getCertificateByIdUseCase.execute(id),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCertificateInput) => createCertificateUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create certificate");
    },
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCertificateInput) => updateCertificateUseCase.execute(input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update certificate");
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCertificateUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete certificate");
    },
  });
}

export function useDuplicateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => duplicateCertificateUseCase.execute(id),
    onMutate: () => {
      const toastId = toast.loading("Duplicating certificate...");
      return { toastId };
    },
    onSuccess: (duplicated, _variables, context) => {
      if (context?.toastId) toast.dismiss(context.toastId);
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success(`Duplicated certificate "${duplicated.titleEn}" successfully`);
    },
    onError: (error: Error, _variables, context) => {
      if (context?.toastId) toast.dismiss(context.toastId);
      toast.error(error.message || "Failed to duplicate certificate");
    },
  });
}

export function useBulkDeleteCertificates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteCertificatesUseCase.execute(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success(`Deleted ${ids.length} certificates`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk delete certificates");
    },
  });
}

export function useBulkUpdateCertificateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: CertificateStatus }) =>
      bulkUpdateCertificateStatusUseCase.execute(ids, status),
    onSuccess: (_, { ids, status }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success(`Updated status to "${status}" for ${ids.length} certificates`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk update status");
    },
  });
}
