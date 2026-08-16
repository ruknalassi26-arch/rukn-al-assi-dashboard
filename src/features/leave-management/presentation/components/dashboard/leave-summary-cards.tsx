// ==============================================================================
// features/leave-management/presentation/components/dashboard/leave-summary-cards.tsx
// Summary KPI cards for employee leave dashboard
// ==============================================================================

import { Card, CardContent, Skeleton } from "@shared/ui";
import { Calendar, CheckCircle2, Clock, XCircle, Sparkles } from "lucide-react";
import type { LeaveDashboardSummary } from "../../../domain/entities";

interface LeaveSummaryCardsProps {
  summary?: LeaveDashboardSummary;
  isLoading?: boolean;
}

export function LeaveSummaryCards({ summary, isLoading }: LeaveSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-28 mb-3" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-36" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Remaining Balance",
      value: `${summary?.remainingBalance ?? 0} Days`,
      subtitle: "Available paid time off",
      icon: Calendar,
      iconColor: "text-primary",
      bgGradient: "from-primary/10 via-primary/5 to-transparent border-primary/20",
      accent: Sparkles,
    },
    {
      title: "Approved",
      value: summary?.approvedCount ?? 0,
      subtitle: "Successfully granted leaves",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      bgGradient: "from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20",
    },
    {
      title: "Pending",
      value: summary?.pendingCount ?? 0,
      subtitle: "Awaiting manager review",
      icon: Clock,
      iconColor: "text-amber-500",
      bgGradient: "from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20",
    },
    {
      title: "Rejected",
      value: summary?.rejectedCount ?? 0,
      subtitle: "Declined requests",
      icon: XCircle,
      iconColor: "text-rose-500",
      bgGradient: "from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className={`relative overflow-hidden border bg-gradient-to-br ${card.bgGradient} transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </p>
                <div className="p-2.5 rounded-xl bg-background/80 shadow-xs border">
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {card.value}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground truncate">{card.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
