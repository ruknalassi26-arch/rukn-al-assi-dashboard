"use client";
// ==============================================================================
// src/app/[locale]/error.tsx
// Route segment Error Boundary — catches unhandled errors within the locale subtree
// ==============================================================================
import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

import { logger } from "@core/services/logger.service";
import { getFriendlyErrorMessage } from "@core/utils/error";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    logger.error("[RouteError] Unhandled route error", error, { digest: error.digest });
  }, [error]);

  const friendlyMessage = getFriendlyErrorMessage(error, "RouteErrorBoundary");

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="rounded-full bg-destructive/10 p-5 text-destructive mb-4">
        <AlertCircle className="h-12 w-12" />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Something Went Wrong
      </h1>
      <p className="mt-3 max-w-md text-base text-muted-foreground">
        {friendlyMessage}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
        <Link
          href="/en"
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Home className="h-4 w-4" /> Return Home
        </Link>
      </div>
    </main>
  );
}
