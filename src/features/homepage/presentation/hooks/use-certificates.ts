"use client";
// ==============================================================================
// features/homepage/presentation/hooks/use-certificates.ts
// TanStack Query hooks and mutations for Certificates section management
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseHomepageRepository } from "../../data/repository/supabase-homepage.repository";
import {
  GetCertificatesUseCase,
  CreateCertificateUseCase,
  UpdateCertificateUseCase,
  DeleteCertificateUseCase,
  ReorderCertificatesUseCase,
  BulkDeleteCertificatesUseCase,
  BulkUpdateCertificatesStatusUseCase,
} from "../../domain/usecases/manage-certificates.usecase";
import type { CertificateEntity } from "../../domain/entities/homepage.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseHomepageRepository(supabase);
}

export function useCertificates() {
  return useQuery({
    queryKey: queryKeys.homepage.certificates(),
    queryFn: () => new GetCertificatesUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (certificate: Omit<CertificateEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateCertificateUseCase(getRepo()).execute(certificate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      toast.success("Certificate added successfully");
    },
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, certificate }: { id: string; certificate: Partial<CertificateEntity> }) =>
      new UpdateCertificateUseCase(getRepo()).execute(id, certificate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      toast.success("Certificate updated successfully");
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteCertificateUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      toast.success("Certificate deleted successfully");
    },
  });
}

export function useReorderCertificates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderCertificatesUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      toast.success("Certificates reordered successfully");
    },
  });
}

export function useBulkDeleteCertificates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteCertificatesUseCase(getRepo()).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      toast.success("Selected certificates deleted");
    },
  });
}

export function useBulkUpdateCertificatesStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "draft" }) =>
      new BulkUpdateCertificatesStatusUseCase(getRepo()).execute(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.certificates() });
      toast.success("Selected certificates status updated");
    },
  });
}
