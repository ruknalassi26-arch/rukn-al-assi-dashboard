"use client";

// ==============================================================================
// features/analytics/presentation/hooks/use-website-analytics.ts
// React Hook for managing website analytics state, date ranges, and RPC fetching
// ==============================================================================
import { useState, useEffect, useCallback, useMemo } from "react";
import { SupabaseWebsiteAnalyticsRepository } from "../../data/repositories/supabase-website-analytics.repository";
import { GetWebsiteAnalyticsUseCase } from "../../domain/usecases/get-website-analytics.usecase";
import type { WebsiteAnalyticsEntity } from "../../domain/entities/website-analytics.entity";

export type DateRangePreset = "today" | "7d" | "30d" | "90d";

export function useWebsiteAnalytics() {
  const [preset, setPreset] = useState<DateRangePreset>("30d");
  const [languageCode, setLanguageCode] = useState<string>("all");
  const [data, setData] = useState<WebsiteAnalyticsEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const repo = useMemo(() => new SupabaseWebsiteAnalyticsRepository(), []);
  const useCase = useMemo(() => new GetWebsiteAnalyticsUseCase(repo), [repo]);

  const getDateRange = useCallback((presetKey: DateRangePreset) => {
    const end = new Date();
    const start = new Date();

    if (presetKey === "today") {
      start.setHours(0, 0, 0, 0);
    } else if (presetKey === "7d") {
      start.setDate(end.getDate() - 7);
    } else if (presetKey === "30d") {
      start.setDate(end.getDate() - 30);
    } else if (presetKey === "90d") {
      start.setDate(end.getDate() - 90);
    }

    return { startDate: start, endDate: end };
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = getDateRange(preset);
      const langParam = languageCode === "all" ? undefined : languageCode;

      const result = await useCase.execute({
        startDate,
        endDate,
        languageCode: langParam,
      });

      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [preset, languageCode, getDateRange, useCase]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    preset,
    setPreset,
    languageCode,
    setLanguageCode,
    data,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
}
