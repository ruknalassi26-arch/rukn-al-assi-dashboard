"use client";
// ==============================================================================
// features/dashboard/presentation/hooks/use-dashboard-charts.ts
// TanStack Query hook for dashboard chart data
// ==============================================================================
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseDashboardRepository } from "../../data/repository/supabase-dashboard.repository";
import { GetDashboardChartsUseCase } from "../../domain/usecases/get-dashboard-charts.usecase";

export function useDashboardCharts(months: number = 6) {
  return useQuery({
    queryKey: queryKeys.dashboard.charts(months),
    queryFn: async () => {
      const supabase = createClient();
      const repository = new SupabaseDashboardRepository(supabase);
      const useCase = new GetDashboardChartsUseCase(repository);
      return useCase.execute(months);
    },
    staleTime: 60 * 1000,
  });
}
