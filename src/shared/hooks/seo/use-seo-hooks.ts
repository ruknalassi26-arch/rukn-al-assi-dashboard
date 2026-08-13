"use client";
// ==============================================================================
// shared/hooks/seo/use-seo-hooks.ts
// TanStack Query Hooks for Public Pages SEO Feature
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseSeoRepository } from "@features/seo/data/repositories/supabase-seo.repository";
import {
  GetAllSeoSettingsUseCase,
  GetSeoSettingByPageKeyUseCase,
  UpdateSeoSettingUseCase,
} from "@features/seo/domain/usecases";
import type { UpdateSeoSettingInput } from "@features/seo/domain/repositories/i-seo.repository";
import type { SeoPageKey } from "@features/seo/domain/entities/seo-setting.entity";

const repository = new SupabaseSeoRepository();
const getAllSeoSettingsUseCase = new GetAllSeoSettingsUseCase(repository);
const getSeoSettingByPageKeyUseCase = new GetSeoSettingByPageKeyUseCase(repository);
const updateSeoSettingUseCase = new UpdateSeoSettingUseCase(repository);

export function useAllSeoSettings() {
  return useQuery({
    queryKey: queryKeys.seo.pages(),
    queryFn: () => getAllSeoSettingsUseCase.execute(),
  });
}

export function useSeoSetting(pageKey: SeoPageKey) {
  return useQuery({
    queryKey: queryKeys.seo.byPage(pageKey),
    queryFn: () => getSeoSettingByPageKeyUseCase.execute(pageKey),
    enabled: !!pageKey,
  });
}

export function useUpdateSeoSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSeoSettingInput) => updateSeoSettingUseCase.execute(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.seo.byPage(updated.pageKey), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.seo.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.seo.byPage(updated.pageKey) });
      toast.success(`SEO metadata updated for ${updated.pageKey} page`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update SEO setting");
    },
  });
}
