"use client";
// ==============================================================================
// core/providers/query-provider.tsx
// TanStack Query provider with smart retry & global error handling
// Includes Sonner Toaster component
// ==============================================================================
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

import { logger } from "@core/services/logger.service";
import { toast } from "@core/utils/toast";
import { AppError, AuthError, PermissionError, ValidationError } from "@core/utils/error";

/**
 * Smart retry decision maker.
 * Avoids retrying 401, 403, 404, or validation errors.
 */
function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 3) return false;

  if (error instanceof AppError) {
    if (
      error instanceof AuthError ||
      error instanceof PermissionError ||
      error instanceof ValidationError ||
      error.statusCode === 404 ||
      error.statusCode === 401 ||
      error.statusCode === 403 ||
      error.statusCode === 422
    ) {
      return false;
    }
  }

  // Also check generic error status property
  if (typeof error === "object" && error !== null) {
    const status = (error as { statusCode?: number; status?: number }).statusCode ?? (error as { status?: number }).status;
    if (status === 401 || status === 403 || status === 404 || status === 422) {
      return false;
    }
  }

  return true;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            logger.error(`[QueryCache] Query error on key: ${JSON.stringify(query.queryKey)}`, error);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            logger.error(`[MutationCache] Mutation error on key: ${JSON.stringify(mutation.options.mutationKey)}`, error);
            // Display toast notification automatically for unhandled mutation failures
            toast.error(error);
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: shouldRetryQuery,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors closeButton duration={4000} />
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
