"use client";
// ==============================================================================
// src/app/global-error.tsx
// Root-level Error Boundary for Next.js App Router
// Catches errors thrown in the root layout.tsx
// ==============================================================================
import { useEffect } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { logger } from "@core/services/logger.service";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    logger.fatal("[GlobalError] Root layout exception", error, { digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground font-sans">
        <div className="flex max-w-md flex-col items-center justify-center text-center">
          <div className="rounded-full bg-destructive/10 p-4 text-destructive mb-4">
            <AlertOctagon className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Critical System Error</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A critical error occurred while initializing the application layout. Our technical team has been notified automatically.
          </p>
          <button
            onClick={reset}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
