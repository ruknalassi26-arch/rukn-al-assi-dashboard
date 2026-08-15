"use client";
// ==============================================================================
// shared/hooks/global-search/use-global-search-hooks.ts
// TanStack Query & Debounced Input Hooks for Global Search
// Clean Architecture — Uses SearchAllUseCase to perform searches
// ==============================================================================
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseGlobalSearchRepository } from "@features/global-search/data/repositories/supabase-global-search.repository";
import { SearchAllUseCase } from "@features/global-search/domain/usecases/search-all.usecase";
import type { SearchModuleType } from "@features/global-search/domain/entities/global-search.entity";

const repository = new SupabaseGlobalSearchRepository();
const searchAllUseCase = new SearchAllUseCase(repository);

/**
 * Custom Debounce Hook to delay state updates by specified ms
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useGlobalSearchQuery(
  query: string,
  moduleFilter: SearchModuleType | "all" = "all",
  page = 1,
  pageSize = 10,
  isEnabled = true
) {
  const debouncedQuery = useDebounce(query, 350);
  const isValidLength = debouncedQuery.trim().length >= 2;

  return useQuery({
    queryKey: queryKeys.globalSearch.query(debouncedQuery, moduleFilter, page),
    queryFn: async () => {
      return searchAllUseCase.execute({
        query: debouncedQuery,
        moduleFilter,
        page,
        pageSize,
      });
    },
    enabled: isEnabled && isValidLength,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });
}
