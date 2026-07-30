"use client";
// ==============================================================================
// features/about/presentation/hooks/use-core-values.ts
// TanStack Query hooks for Core Values
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseAboutRepository } from "../../data/repository/supabase-about.repository";
import {
  GetCoreValuesUseCase,
  CreateCoreValueUseCase,
  UpdateCoreValueUseCase,
  DeleteCoreValueUseCase,
  ReorderCoreValuesUseCase,
  BulkDeleteCoreValuesUseCase,
  BulkUpdateCoreValuesStatusUseCase,
} from "../../domain/usecases/manage-core-values.usecase";
import type { CoreValueEntity } from "../../domain/entities/about.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseAboutRepository(supabase);
}

export function useCoreValues() {
  return useQuery({
    queryKey: queryKeys.about.coreValues(),
    queryFn: () => new GetCoreValuesUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useCreateCoreValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: Omit<CoreValueEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateCoreValueUseCase(getRepo()).execute(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Core value created successfully");
    },
  });
}

export function useUpdateCoreValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: Partial<CoreValueEntity> }) =>
      new UpdateCoreValueUseCase(getRepo()).execute(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Core value updated successfully");
    },
  });
}

export function useDeleteCoreValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteCoreValueUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Core value deleted successfully");
    },
  });
}

export function useReorderCoreValues() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderCoreValuesUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Core values reordered successfully");
    },
  });
}

export function useBulkDeleteCoreValues() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteCoreValuesUseCase(getRepo()).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Selected core values deleted");
    },
  });
}

export function useBulkUpdateCoreValuesStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "draft" }) =>
      new BulkUpdateCoreValuesStatusUseCase(getRepo()).execute(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Selected core values status updated");
    },
  });
}
