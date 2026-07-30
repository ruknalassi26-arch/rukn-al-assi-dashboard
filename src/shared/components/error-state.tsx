// ==============================================================================
// shared/components/error-state.tsx
// Reusable error state component for sections, cards, or pages
// ==============================================================================
import type { ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@core/utils/cn";
import { getFriendlyErrorMessage } from "@core/utils/error";

interface ErrorStateProps {
  title?: string;
  error?: unknown;
  message?: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = "Unable to load data",
  error,
  message,
  onRetry,
  action,
  className,
  compact = false,
}: ErrorStateProps) {
  const displayMessage = message ?? (error ? getFriendlyErrorMessage(error, "ErrorState") : "An unexpected error occurred.");

  if (compact) {
    return (
      <div className={cn("flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive", className)}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{displayMessage}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-xs font-semibold underline hover:no-underline"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex min-h-[250px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-destructive/30 bg-destructive/5 p-8 text-center", className)}>
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{displayMessage}</p>
      </div>

      <div className="flex items-center gap-3 mt-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        )}
        {action}
      </div>
    </div>
  );
}
