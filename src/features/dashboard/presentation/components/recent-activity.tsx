"use client";
// ==============================================================================
// features/dashboard/presentation/components/recent-activity.tsx
// Activity timeline widget for Dashboard
// ==============================================================================
import { Activity, PlusCircle, Edit3, Trash2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@shared/ui";
import { useRecentActivity } from "@shared/hooks/dashboard/use-dashboard-hooks";

export function RecentActivity() {
  const { data: logs, isLoading } = useRecentActivity(8);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created": return <PlusCircle className="h-4 w-4 text-emerald-600" />;
      case "updated": return <Edit3 className="h-4 w-4 text-blue-600" />;
      case "deleted": return <Trash2 className="h-4 w-4 text-rose-600" />;
      default: return <Activity className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Recent Activity Timeline</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm flex flex-col items-center gap-2">
            <ShieldAlert className="h-8 w-8 opacity-40" />
            <p>No activity logs recorded yet.</p>
          </div>
        ) : (
          <div className="relative border-s border-muted ms-2 space-y-4 py-1">
            {logs.map((log) => (
              <div key={log.id} className="relative ms-4">
                <span className="absolute -start-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-card ring-4 ring-card">
                  {getActionIcon(log.action)}
                </span>
                <div className="text-xs">
                  <span className="font-semibold text-foreground">{log.entityTitle ?? log.entityType}</span>
                  <span className="text-muted-foreground ms-1 font-mono">({log.action})</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {" • "}
                  {log.userEmail ?? "System Administrator"}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
