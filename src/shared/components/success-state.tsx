// ==============================================================================
// shared/components/success-state.tsx
// Reusable success confirmation state component
// ==============================================================================
import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@core/utils/cn";

interface SuccessStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SuccessState({
  title,
  description,
  action,
  className,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[250px] flex-col items-center justify-center gap-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-8 text-center",
        className
      )}
    >
      <div className="rounded-full bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div className="space-y-1 max-w-md">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
