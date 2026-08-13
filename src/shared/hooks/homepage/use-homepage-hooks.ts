"use client";
// ==============================================================================
// shared/hooks/homepage/use-homepage-hooks.ts
// Centralized React Query hooks for Homepage Management
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseHomepageRepository } from "@features/homepage/data/repository/supabase-homepage.repository";
import {
  GetHeroSlidesUseCase,
  CreateHeroSlideUseCase,
  UpdateHeroSlideUseCase,
  DeleteHeroSlideUseCase,
  ReorderHeroSlidesUseCase,
  GetAboutPreviewUseCase,
  UpdateAboutPreviewUseCase,
  GetCompanyStatsUseCase,
  CreateCompanyStatUseCase,
  UpdateCompanyStatUseCase,
  DeleteCompanyStatUseCase,
  ReorderCompanyStatsUseCase,
  BulkDeleteCompanyStatsUseCase,
  BulkUpdateCompanyStatsStatusUseCase,
  GetFeaturedServicesUseCase,
  ToggleFeaturedServiceUseCase,
  GetFeaturedProductsUseCase,
  ToggleFeaturedProductUseCase,
  GetFeaturedProjectsUseCase,
  ToggleFeaturedProjectUseCase,
  GetClientsUseCase,
  CreateClientUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
  ReorderClientsUseCase,
  BulkDeleteClientsUseCase,
  BulkUpdateClientsStatusUseCase,
  GetCertificatesUseCase,
  CreateCertificateUseCase,
  UpdateCertificateUseCase,
  DeleteCertificateUseCase,
  ReorderCertificatesUseCase,
  BulkDeleteCertificatesUseCase,
  BulkUpdateCertificatesStatusUseCase,
  GetContactCtaUseCase,
  UpdateContactCtaUseCase,
} from "@features/homepage/domain/usecases";
import type {
  HeroSlideEntity,
  AboutPreviewEntity,
  CompanyStatEntity,
  ClientEntity,
  CertificateEntity,
  ContactCtaEntity,
} from "@features/homepage/domain/entities/homepage.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseHomepageRepository(supabase);
}

// ---------- Hero Section ----------
export function useHeroSlides() {
  return useQuery({
    queryKey: queryKeys.homepage.hero(),
    queryFn: () => new GetHeroSlidesUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useHeroSlideById(id: string) {
  return useQuery({
    queryKey: [...queryKeys.homepage.hero(), id],
    queryFn: () => getRepo().getHeroSlideById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useCreateHeroSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slide: Omit<HeroSlideEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateHeroSlideUseCase(getRepo()).execute(slide),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.hero() });
      toast.success("Hero slide created successfully");
    },
  });
}

export function useUpdateHeroSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, slide }: { id: string; slide: Partial<HeroSlideEntity> }) =>
      new UpdateHeroSlideUseCase(getRepo()).execute(id, slide),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.hero() });
      toast.success("Hero slide updated successfully");
    },
  });
}

export function useDeleteHeroSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteHeroSlideUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.hero() });
      toast.success("Hero slide deleted successfully");
    },
  });
}

export function useReorderHeroSlides() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderHeroSlidesUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.hero() });
      toast.success("Hero slides reordered successfully");
    },
  });
}

// ---------- About Section ----------
export function useAboutPreview() {
  return useQuery({
    queryKey: queryKeys.homepage.about(),
    queryFn: () => new GetAboutPreviewUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useUpdateAboutPreview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AboutPreviewEntity>) => new UpdateAboutPreviewUseCase(getRepo()).execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.about() });
      toast.success("About section updated successfully");
    },
  });
}

// ---------- Company Statistics ----------
export function useCompanyStats() {
  return useQuery({
    queryKey: queryKeys.homepage.statistics(),
    queryFn: () => new GetCompanyStatsUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useCreateCompanyStat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stat: Omit<CompanyStatEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateCompanyStatUseCase(getRepo()).execute(stat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.statistics() });
      toast.success("Statistic added successfully");
    },
  });
}

export function useUpdateCompanyStat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stat }: { id: string; stat: Partial<CompanyStatEntity> }) =>
      new UpdateCompanyStatUseCase(getRepo()).execute(id, stat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.statistics() });
      toast.success("Statistic updated successfully");
    },
  });
}

export function useDeleteCompanyStat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteCompanyStatUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.statistics() });
      toast.success("Statistic deleted successfully");
    },
  });
}

export function useReorderCompanyStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderCompanyStatsUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.statistics() });
      toast.success("Statistics reordered successfully");
    },
  });
}

export function useBulkDeleteCompanyStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteCompanyStatsUseCase(getRepo()).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.statistics() });
      toast.success("Selected statistics deleted");
    },
  });
}

export function useBulkUpdateCompanyStatsStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "draft" }) =>
      new BulkUpdateCompanyStatsStatusUseCase(getRepo()).execute(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.statistics() });
      toast.success("Selected statistics status updated");
    },
  });
}

// ---------- Featured Items ----------
export function useFeaturedServices() {
  return useQuery({
    queryKey: queryKeys.homepage.featuredServices(),
    queryFn: () => new GetFeaturedServicesUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useToggleFeaturedService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured, sortOrder }: { id: string; isFeatured: boolean; sortOrder?: number }) =>
      new ToggleFeaturedServiceUseCase(getRepo()).execute(id, isFeatured, sortOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.featuredServices() });
      toast.success("Featured service status updated");
    },
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.homepage.featuredProducts(),
    queryFn: () => new GetFeaturedProductsUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useToggleFeaturedProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured, sortOrder }: { id: string; isFeatured: boolean; sortOrder?: number }) =>
      new ToggleFeaturedProductUseCase(getRepo()).execute(id, isFeatured, sortOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.featuredProducts() });
      toast.success("Featured product status updated");
    },
  });
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: queryKeys.homepage.featuredProjects(),
    queryFn: () => new GetFeaturedProjectsUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useToggleFeaturedProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured, sortOrder }: { id: string; isFeatured: boolean; sortOrder?: number }) =>
      new ToggleFeaturedProjectUseCase(getRepo()).execute(id, isFeatured, sortOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.featuredProjects() });
      toast.success("Featured project status updated");
    },
  });
}

// ---------- Clients ----------
export function useClients() {
  return useQuery({
    queryKey: queryKeys.homepage.clients(),
    queryFn: () => new GetClientsUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (client: Omit<ClientEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateClientUseCase(getRepo()).execute(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Client partner added successfully");
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, client }: { id: string; client: Partial<ClientEntity> }) =>
      new UpdateClientUseCase(getRepo()).execute(id, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Client partner updated successfully");
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteClientUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Client partner deleted successfully");
    },
  });
}

export function useReorderClients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderClientsUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Clients reordered successfully");
    },
  });
}

export function useBulkDeleteClients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteClientsUseCase(getRepo()).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Selected clients deleted");
    },
  });
}

export function useBulkUpdateClientsStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "draft" }) =>
      new BulkUpdateClientsStatusUseCase(getRepo()).execute(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Selected clients status updated");
    },
  });
}

// ---------- Certificates ----------
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

// ---------- Contact CTA ----------
export function useContactCta() {
  return useQuery({
    queryKey: queryKeys.homepage.contactCta(),
    queryFn: () => new GetContactCtaUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useUpdateContactCta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ContactCtaEntity>) => new UpdateContactCtaUseCase(getRepo()).execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.contactCta() });
      toast.success("Contact CTA section updated successfully");
    },
  });
}
