"use client";
// ==============================================================================
// features/about/presentation/hooks/use-about-certificates.ts
// TanStack Query hooks for About Module Certificates
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseAboutRepository } from "../../data/repository/supabase-about.repository";
import {
  GetAboutCertificatesUseCase,
  CreateAboutCertificateUseCase,
  UpdateAboutCertificateUseCase,
  DeleteAboutCertificateUseCase,
  ReorderAboutCertificatesUseCase,
  BulkDeleteAboutCertificatesUseCase,
  BulkUpdateAboutCertificatesStatusUseCase,
} from "../../domain/usecases/manage-about-certificates.usecase";
import type { AboutCertificateEntity } from "../../domain/entities/about.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseAboutRepository(supabase);
}

export function useAboutCertificates() {
  return useQuery({
    queryKey: queryKeys.about.certificates(),
    queryFn: () => new GetAboutCertificatesUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useCreateAboutCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cert: Omit<AboutCertificateEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateAboutCertificateUseCase(getRepo()).execute(cert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate created successfully");
    },
  });
}

export function useUpdateAboutCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, cert }: { id: string; cert: Partial<AboutCertificateEntity> }) =>
      new UpdateAboutCertificateUseCase(getRepo()).execute(id, cert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate updated successfully");
    },
  });
}

export function useDeleteAboutCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteAboutCertificateUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate deleted successfully");
    },
  });
}

export function useReorderAboutCertificates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderAboutCertificatesUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificates reordered successfully");
    },
  });
}

export function useBulkDeleteAboutCertificates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteAboutCertificatesUseCase(getRepo()).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Selected certificates deleted");
    },
  });
}

export function useBulkUpdateAboutCertificatesStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "draft" }) =>
      new BulkUpdateAboutCertificatesStatusUseCase(getRepo()).execute(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Selected certificates status updated");
    },
  });
}
