"use client";
// ==============================================================================
// features/dashboard/presentation/hooks/use-recent-activity.ts
// TanStack Query hook for recent admin activity
// ==============================================================================
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseDashboardRepository } from "../../data/repository/supabase-dashboard.repository";
import { GetRecentActivityUseCase } from "../../domain/usecases/get-recent-activity.usecase";

export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivity(limit),
    queryFn: async () => {
      const supabase = createClient();
      const repository = new SupabaseDashboardRepository(supabase);
      const useCase = new GetRecentActivityUseCase(repository);
      return useCase.execute(limit);
    },
    staleTime: 30 * 1000,
  });
}
