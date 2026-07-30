"use client";
// ==============================================================================
// features/homepage/presentation/hooks/use-company-stats.ts
// TanStack Query hooks and mutations for Company Statistics management
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseHomepageRepository } from "../../data/repository/supabase-homepage.repository";
import {
  GetCompanyStatsUseCase,
  CreateCompanyStatUseCase,
  UpdateCompanyStatUseCase,
  DeleteCompanyStatUseCase,
  ReorderCompanyStatsUseCase,
  BulkDeleteCompanyStatsUseCase,
  BulkUpdateCompanyStatsStatusUseCase,
} from "../../domain/usecases/manage-stats.usecase";
import type { CompanyStatEntity } from "../../domain/entities/homepage.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseHomepageRepository(supabase);
}

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
