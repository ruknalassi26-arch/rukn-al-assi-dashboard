// ==============================================================================
// shared/components/skeleton-card.tsx
// Generic skeleton loader for card layouts
// ==============================================================================
import { cn } from "@core/utils/cn";

interface SkeletonProps {
  className?: string;
}

/** Base skeleton block */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} />
  );
}

/** Skeleton for a standard content card */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 shadow-sm", className)}>
      <Skeleton className="mb-4 h-48 w-full rounded-md" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

/** Skeleton grid — renders n placeholder cards */
export function SkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
