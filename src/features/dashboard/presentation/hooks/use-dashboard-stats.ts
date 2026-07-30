"use client";
// ==============================================================================
// features/dashboard/presentation/hooks/use-dashboard-stats.ts
// TanStack Query hook for dashboard statistics
// ==============================================================================
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseDashboardRepository } from "../../data/repository/supabase-dashboard.repository";
import { GetDashboardStatsUseCase } from "../../domain/usecases/get-dashboard-stats.usecase";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      const supabase = createClient();
      const repository = new SupabaseDashboardRepository(supabase);
      const useCase = new GetDashboardStatsUseCase(repository);
      return useCase.execute();
    },
    staleTime: 30 * 1000,
  });
}
