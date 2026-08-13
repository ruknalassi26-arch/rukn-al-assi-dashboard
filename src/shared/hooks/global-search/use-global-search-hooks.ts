"use client";
// ==============================================================================
// shared/hooks/global-search/use-global-search-hooks.ts
// TanStack Query & Debounced Input Hooks for Global Search
// ==============================================================================
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseGlobalSearchRepository } from "@features/global-search/data/repositories/supabase-global-search.repository";
import { SearchAllUseCase } from "@features/global-search/domain/usecases/search-all.usecase";

const repository = new SupabaseGlobalSearchRepository();
const searchAllUseCase = new SearchAllUseCase(repository);

/**
 * Custom Debounce Hook to delay state updates
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
  moduleFilter = "all",
  page = 1,
  pageSize = 10
) {
  const debouncedQuery = useDebounce(query, 400);

  return useQuery({
    queryKey: queryKeys.globalSearch.query(debouncedQuery, moduleFilter, page),
    queryFn: () =>
      searchAllUseCase.execute({
        query: debouncedQuery,
        moduleFilter,
        page,
        pageSize,
      }),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 60 * 1000,
  });
}
