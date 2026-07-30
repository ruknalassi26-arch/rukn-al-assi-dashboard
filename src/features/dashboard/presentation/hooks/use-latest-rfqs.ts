"use client";
// ==============================================================================
// features/dashboard/presentation/hooks/use-latest-rfqs.ts
// TanStack Query hook for latest RFQ requests
// ==============================================================================
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseDashboardRepository } from "../../data/repository/supabase-dashboard.repository";
import { GetLatestRfqsUseCase } from "../../domain/usecases/get-latest-rfqs.usecase";

export function useLatestRfqs(limit: number = 5) {
  return useQuery({
    queryKey: queryKeys.dashboard.latestRfqs(limit),
    queryFn: async () => {
      const supabase = createClient();
      const repository = new SupabaseDashboardRepository(supabase);
      const useCase = new GetLatestRfqsUseCase(repository);
      return useCase.execute(limit);
    },
    staleTime: 30 * 1000,
  });
}
