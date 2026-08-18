"use client";
// ==============================================================================
// features/homepage/presentation/hooks/use-homepage-hero.ts
// TanStack Query hooks and mutations for single Hero Section management
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseHomepageRepository } from "../../data/repository/supabase-homepage.repository";
import {
  GetHeroSectionUseCase,
  UpdateHeroSectionUseCase,
} from "../../domain/usecases/manage-hero.usecase";
import type { HeroSectionEntity } from "../../domain/entities/homepage.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseHomepageRepository(supabase);
}

export function useHeroSection() {
  return useQuery({
    queryKey: queryKeys.homepage.hero(),
    queryFn: () => new GetHeroSectionUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useUpdateHeroSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<HeroSectionEntity>) =>
      new UpdateHeroSectionUseCase(getRepo()).execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.hero() });
      toast.success("Hero section updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update hero section");
    },
  });
}
