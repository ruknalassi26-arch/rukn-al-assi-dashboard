"use client";
// ==============================================================================
// features/dashboard/presentation/components/recent-activity.tsx
// Activity log timeline stream card
// ==============================================================================
import { Activity, Clock, User, Shield, Package, Wrench, FileText, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Skeleton, Badge } from "@shared/ui";
import { useRecentActivity } from "@shared/hooks/dashboard/use-dashboard-hooks";
import { ErrorState } from "@shared/components/error-state";

export function RecentActivity() {
  const { data: activities, isLoading, error, refetch } = useRecentActivity(8);

  const getActionIcon = (entityType: string) => {
    switch (entityType.toLowerCase()) {
      case "product":
        return <Package className="h-3.5 w-3.5 text-blue-500" />;
      case "service":
        return <Wrench className="h-3.5 w-3.5 text-cyan-500" />;
      case "rfq":
        return <FileText className="h-3.5 w-3.5 text-orange-500" />;
      case "contact":
      case "contact-messages":
        return <Mail className="h-3.5 w-3.5 text-rose-500" />;
      case "auth":
        return <Shield className="h-3.5 w-3.5 text-emerald-500" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-primary" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load activity stream" error={error} onRetry={() => refetch()} />;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Real-time audit log of system actions and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {!activities || activities.length === 0 ? (
          <div className="text-center py-8 space-y-2 border border-dashed rounded-lg bg-muted/20">
            <Clock className="h-8 w-8 mx-auto text-muted-foreground/50" />
            <p className="text-xs font-semibold text-muted-foreground">No Recent Activity</p>
            <p className="text-[11px] text-muted-foreground/80">Admin and user actions will be logged here.</p>
          </div>
        ) : (
          <div className="relative space-y-4 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:-translate-x-1/2 before:bg-border">
            {activities.map((item) => (
              <div key={item.id} className="relative flex items-start gap-3 text-xs group">
                <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-card shadow-xs group-hover:border-primary transition-colors">
                  {getActionIcon(item.entityType)}
                </div>

                <div className="flex-1 space-y-0.5 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground truncate max-w-[180px]">
                      {item.entityTitle || `${item.action} in ${item.entityType}`}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="capitalize text-foreground font-medium">{item.action}</span>
                    <span>•</span>
                    <span className="truncate max-w-[140px] flex items-center gap-1">
                      <User className="h-3 w-3 inline" />
                      {item.userEmail || "System"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
