"use client";
// ==============================================================================
// shared/hooks/dashboard/use-dashboard-hooks.ts
// Centralized React Query hooks for Dashboard feature
// ==============================================================================
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseDashboardRepository } from "@features/dashboard/data/repository/supabase-dashboard.repository";
import {
  GetDashboardStatsUseCase,
  GetDashboardChartsUseCase,
  GetLatestRfqsUseCase,
  GetLatestContactsUseCase,
  GetRecentActivityUseCase,
} from "@features/dashboard/domain/usecases";

function getRepo() {
  const supabase = createClient();
  return new SupabaseDashboardRepository(supabase);
}

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => new GetDashboardStatsUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useDashboardCharts() {
  return useQuery({
    queryKey: queryKeys.dashboard.charts(),
    queryFn: () => new GetDashboardChartsUseCase(getRepo()).execute(),
    staleTime: 60 * 1000,
  });
}

export function useLatestRfqs(limit = 5) {
  return useQuery({
    queryKey: queryKeys.dashboard.latestRfqs(limit),
    queryFn: () => new GetLatestRfqsUseCase(getRepo()).execute(limit),
    staleTime: 30 * 1000,
  });
}

export function useLatestContacts(limit = 5) {
  return useQuery({
    queryKey: queryKeys.dashboard.latestContacts(limit),
    queryFn: () => new GetLatestContactsUseCase(getRepo()).execute(limit),
    staleTime: 30 * 1000,
  });
}

export function useRecentActivity(limit = 10) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivity(limit),
    queryFn: () => new GetRecentActivityUseCase(getRepo()).execute(limit),
    staleTime: 15 * 1000,
  });
}

export function useRefetchDashboard() {
  const queryClient = useQueryClient();
  return () => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.all,
    });
  };
}
