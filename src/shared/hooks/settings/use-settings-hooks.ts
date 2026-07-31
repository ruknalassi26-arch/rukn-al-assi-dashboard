"use client";
// ==============================================================================
// shared/hooks/settings/use-settings-hooks.ts
// TanStack Query Hooks for Website Settings & Branding Feature
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseSettingsRepository } from "@features/settings/data/repositories/supabase-settings.repository";
import {
  GetSettingsUseCase,
  UpdateSettingsUseCase,
} from "@features/settings/domain/usecases";
import type { UpdateWebsiteSettingsInput } from "@features/settings/domain/repositories/i-settings.repository";

const repository = new SupabaseSettingsRepository();
const getSettingsUseCase = new GetSettingsUseCase(repository);
const updateSettingsUseCase = new UpdateSettingsUseCase(repository);

export function useWebsiteSettings() {
  return useQuery({
    queryKey: queryKeys.settings.website(),
    queryFn: () => getSettingsUseCase.execute(),
  });
}

export function useUpdateWebsiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateWebsiteSettingsInput) => updateSettingsUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      toast.success("Website settings updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update website settings");
    },
  });
}
