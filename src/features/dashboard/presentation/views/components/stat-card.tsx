"use client";
// ==============================================================================
// features/dashboard/presentation/views/components/stat-card.tsx
// Individual statistic card with icon, value, label, and trend
// ==============================================================================
import type { LucideIcon } from "lucide-react";
import { cn } from "@core/utils/cn";
import { Card, CardContent, Skeleton } from "@shared/ui";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  description,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden transition-all duration-200 hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {value.toLocaleString()}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={cn("rounded-xl p-3", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
      </CardContent>
      {/* Decorative gradient accent */}
      <div className={cn("absolute bottom-0 left-0 right-0 h-1", iconBg)} />
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-11 w-11 rounded-xl" />
        </div>
      </CardContent>
      <Skeleton className="h-1 w-full" />
    </Card>
  );
}
