"use client";
// ==============================================================================
// features/homepage/presentation/hooks/use-homepage-about.ts
// TanStack Query hooks and mutations for About Section management
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseHomepageRepository } from "../../data/repository/supabase-homepage.repository";
import { GetAboutPreviewUseCase, UpdateAboutPreviewUseCase } from "../../domain/usecases/manage-about.usecase";
import type { AboutPreviewEntity } from "../../domain/entities/homepage.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseHomepageRepository(supabase);
}

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
