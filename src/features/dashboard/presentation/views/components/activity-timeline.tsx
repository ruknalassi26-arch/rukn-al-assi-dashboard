"use client";
// ==============================================================================
// features/dashboard/presentation/views/components/activity-timeline.tsx
// Recent admin activity timeline with icons per action type
// ==============================================================================
import { useTranslations } from "next-intl";
import {
  Plus,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  Settings,
  Search,
  Clock,
  Activity,
} from "lucide-react";
import { cn } from "@core/utils/cn";
import { Card, CardContent, CardHeader, CardTitle, Skeleton, ScrollArea } from "@shared/ui";
import { EmptyState } from "@shared/components";
import { ErrorState } from "@shared/components";
import { useRecentActivity } from "../../hooks";
import type { ActivityLogEntity } from "../../../domain/entities/dashboard.entity";

const ACTION_CONFIG: Record<
  ActivityLogEntity["action"],
  { icon: React.ElementType; color: string; bg: string }
> = {
  created: { icon: Plus, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  updated: { icon: Pencil, color: "text-blue-600", bg: "bg-blue-500/10" },
  deleted: { icon: Trash2, color: "text-red-600", bg: "bg-red-500/10" },
  login: { icon: LogIn, color: "text-violet-600", bg: "bg-violet-500/10" },
  logout: { icon: LogOut, color: "text-gray-600", bg: "bg-gray-500/10" },
  settings_updated: { icon: Settings, color: "text-amber-600", bg: "bg-amber-500/10" },
  seo_updated: { icon: Search, color: "text-cyan-600", bg: "bg-cyan-500/10" },
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function getActivityLabel(activity: ActivityLogEntity): string {
  const action = activity.action.replace("_", " ");
  const capitalAction = action.charAt(0).toUpperCase() + action.slice(1);
  const entity = activity.entityType.charAt(0).toUpperCase() + activity.entityType.slice(1);

  if (activity.entityTitle) {
    return `${capitalAction} ${entity}: ${activity.entityTitle}`;
  }
  return `${capitalAction} ${entity}`;
}

export function ActivityTimeline() {
  const { data: activities, isLoading, error, refetch } = useRecentActivity(10);
  const t = useTranslations("dashboard.activity");

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <ErrorState title={t("errorTitle")} error={error} onRetry={() => refetch()} compact />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-5 w-5 text-violet-600" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        {!activities || activities.length === 0 ? (
          <div className="px-6">
            <EmptyState
              icon={Clock}
              title={t("emptyTitle")}
              description={t("emptyDescription")}
            />
          </div>
        ) : (
          <ScrollArea className="h-[380px] px-6">
            <div className="relative space-y-0">
              {/* Timeline line */}
              <div className="absolute top-4 bottom-4 start-[15px] w-px bg-border" />

              {activities.map((activity, index) => {
                const config = ACTION_CONFIG[activity.action] ?? ACTION_CONFIG.updated;
                const Icon = config.icon;
                const isLast = index === activities.length - 1;

                return (
                  <div
                    key={activity.id}
                    className={cn(
                      "relative flex items-start gap-3 py-3",
                      !isLast && "border-b-0"
                    )}
                  >
                    {/* Icon circle */}
                    <div
                      className={cn(
                        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        config.bg
                      )}
                    >
                      <Icon className={cn("h-3.5 w-3.5", config.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm text-foreground leading-snug">
                        {getActivityLabel(activity)}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(activity.createdAt)}</span>
                        {activity.userEmail && (
                          <>
                            <span className="text-border">•</span>
                            <span className="truncate max-w-[150px]">{activity.userEmail}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
