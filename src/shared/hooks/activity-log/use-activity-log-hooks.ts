"use client";
// ==============================================================================
// shared/hooks/activity-log/use-activity-log-hooks.ts
// TanStack Query Hooks for Activity Log Feature
// ==============================================================================
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseActivityLogRepository } from "@features/activity-log/data/repositories/supabase-activity-log.repository";
import { GetActivityLogsUseCase } from "@features/activity-log/domain/usecases/get-activity-logs.usecase";
import { GetActivityLogByIdUseCase } from "@features/activity-log/domain/usecases/get-activity-log-by-id.usecase";
import type { ActivityLogFilters } from "@features/activity-log/domain/repositories/i-activity-log.repository";

const repository = new SupabaseActivityLogRepository();
const getActivityLogsUseCase = new GetActivityLogsUseCase(repository);
const getActivityLogByIdUseCase = new GetActivityLogByIdUseCase(repository);

export function useActivityLogsQuery(filters: ActivityLogFilters = {}) {
  return useQuery({
    queryKey: queryKeys.activityLog.list(filters as Record<string, unknown>),
    queryFn: () => getActivityLogsUseCase.execute(filters),
    staleTime: 15 * 1000,
  });
}

export function useActivityLogDetailQuery(id: string | null) {
  return useQuery({
    queryKey: queryKeys.activityLog.detail(id ?? ""),
    queryFn: () => (id ? getActivityLogByIdUseCase.execute(id) : null),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}
