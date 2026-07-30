"use client";
// ==============================================================================
// features/homepage/presentation/hooks/use-homepage-hero.ts
// TanStack Query hooks and mutations for Hero Section management
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseHomepageRepository } from "../../data/repository/supabase-homepage.repository";
import {
  GetHeroSlidesUseCase,
  CreateHeroSlideUseCase,
  UpdateHeroSlideUseCase,
  DeleteHeroSlideUseCase,
  ReorderHeroSlidesUseCase,
} from "../../domain/usecases/manage-hero.usecase";
import type { HeroSlideEntity } from "../../domain/entities/homepage.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseHomepageRepository(supabase);
}

export function useHeroSlides() {
  return useQuery({
    queryKey: queryKeys.homepage.hero(),
    queryFn: () => new GetHeroSlidesUseCase(getRepo()).execute(),
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
