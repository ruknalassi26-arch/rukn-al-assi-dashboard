"use client";
// ==============================================================================
// features/homepage/presentation/hooks/use-featured-items.ts
// TanStack Query hooks and mutations for Featured Services, Products, & Projects
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseHomepageRepository } from "../../data/repository/supabase-homepage.repository";
import {
  GetFeaturedServicesUseCase,
  ToggleFeaturedServiceUseCase,
  GetFeaturedProductsUseCase,
  ToggleFeaturedProductUseCase,
  GetFeaturedProjectsUseCase,
  ToggleFeaturedProjectUseCase,
} from "../../domain/usecases/manage-featured.usecase";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseHomepageRepository(supabase);
}

// ---------- Featured Services ----------
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
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success("Featured service status updated");
    },
  });
}

// ---------- Featured Products ----------
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
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success("Featured product status updated");
    },
  });
}

// ---------- Featured Projects ----------
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
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success("Featured project status updated");
    },
  });
}
