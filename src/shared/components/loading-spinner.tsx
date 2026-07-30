// ==============================================================================
// shared/components/loading-spinner.tsx
// ==============================================================================
import { cn } from "@core/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-solid border-primary border-t-transparent",
        sizeMap[size],
        className
      )}
    />
  );
}

/** Full-page loading overlay */
export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

/** Inline section loader */
export function SectionLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-h-[200px] items-center justify-center", className)}>
      <LoadingSpinner size="md" />
    </div>
  );
}
