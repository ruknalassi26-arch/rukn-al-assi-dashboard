"use client";
// ==============================================================================
// features/dashboard/presentation/hooks/use-latest-contacts.ts
// TanStack Query hook for latest contact submissions
// ==============================================================================
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseDashboardRepository } from "../../data/repository/supabase-dashboard.repository";
import { GetLatestContactsUseCase } from "../../domain/usecases/get-latest-contacts.usecase";

export function useLatestContacts(limit: number = 5) {
  return useQuery({
    queryKey: queryKeys.dashboard.latestContacts(limit),
    queryFn: async () => {
      const supabase = createClient();
      const repository = new SupabaseDashboardRepository(supabase);
      const useCase = new GetLatestContactsUseCase(repository);
      return useCase.execute(limit);
    },
    staleTime: 30 * 1000,
  });
}
