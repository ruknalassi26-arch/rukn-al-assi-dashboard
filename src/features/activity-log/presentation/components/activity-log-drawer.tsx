"use client";
// ==============================================================================
// features/activity-log/presentation/components/activity-log-drawer.tsx
// Read-Only Detail Sheet Drawer with JSON/Diff Inspector for Old vs New Values
// ==============================================================================
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Badge,
  Button,
  ScrollArea,
} from "@shared/ui";
import { useActivityLogStore } from "../stores/activity-log.store";
import { useActivityLogDetailQuery } from "@shared/hooks/activity-log/use-activity-log-hooks";
import { Activity, User, Globe, Calendar, FileText, ArrowRight, Loader2, Code2 } from "lucide-react";

export function ActivityLogDrawer() {
  const { selectedLogId, isDrawerOpen, closeDrawer } = useActivityLogStore();
  const { data: log, isLoading } = useActivityLogDetailQuery(selectedLogId);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
    }).format(new Date(date));
  };

  const renderJsonPretty = (val: unknown) => {
    if (val === null || val === undefined) {
      return <span className="text-muted-foreground italic text-xs">None</span>;
    }
    if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
      return <span className="text-foreground text-xs font-mono">{String(val)}</span>;
    }
    try {
      const jsonStr = JSON.stringify(val, null, 2);
      return (
        <pre className="text-[11px] font-mono text-foreground p-3 rounded-lg bg-muted/60 border overflow-x-auto whitespace-pre-wrap">
          {jsonStr}
        </pre>
      );
    } catch {
      return <span className="text-xs font-mono">{String(val)}</span>;
    }
  };

  return (
    <Dialog open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg font-bold">Activity Log Details</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Read-only audit inspection of system action and value state changes.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Loading activity details...</p>
          </div>
        ) : !log ? (
          <div className="p-6 text-center text-xs text-muted-foreground">Log details not found.</div>
        ) : (
          <ScrollArea className="flex-1 pe-2 py-4 space-y-6">
            {/* Meta Header Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border bg-muted/20">
              {/* Action */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  Action Type
                </span>
                <div>
                  <Badge variant={log.actionBadgeVariant} className="text-xs">
                    {log.actionFormattedLabel}
                  </Badge>
                </div>
              </div>

              {/* Entity */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Target Entity
                </span>
                <p className="text-xs font-semibold text-foreground">{log.entityFormattedLabel}</p>
                {log.entityTitle && (
                  <p className="text-[11px] text-muted-foreground truncate">{log.entityTitle}</p>
                )}
              </div>

              {/* User */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  User Account
                </span>
                <p className="text-xs font-semibold text-foreground">{log.userEmail || "System / Anonymous"}</p>
                {log.userId && <p className="text-[10px] text-muted-foreground font-mono">ID: {log.userId}</p>}
              </div>

              {/* IP & Time */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  IP Address & Timestamp
                </span>
                <p className="text-xs font-mono text-foreground">{log.ipAddress || "N/A"}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(log.createdAt)}
                </p>
              </div>
            </div>

            {/* Old vs New Value Diff Inspector */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold text-foreground">Value State Inspection (Old vs New)</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Old Value */}
                <div className="space-y-1.5 p-3.5 rounded-xl border bg-destructive/5 border-destructive/20">
                  <span className="text-xs font-semibold text-destructive flex items-center gap-1">
                    <span>Old Value (Previous State)</span>
                  </span>
                  <div>{renderJsonPretty(log.effectiveOldValue)}</div>
                </div>

                {/* New Value */}
                <div className="space-y-1.5 p-3.5 rounded-xl border bg-emerald-500/5 border-emerald-500/20">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>New Value (Updated State)</span>
                  </span>
                  <div>{renderJsonPretty(log.effectiveNewValue)}</div>
                </div>
              </div>
            </div>

            {/* Additional Raw Metadata if exists */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <h4 className="text-xs font-bold text-muted-foreground">Raw Execution Metadata</h4>
                <pre className="text-[11px] font-mono p-3 rounded-lg bg-muted/40 border overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}
          </ScrollArea>
        )}

        <div className="pt-3 border-t flex justify-end">
          <Button variant="outline" size="sm" onClick={closeDrawer} className="text-xs">
            Close Inspector
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
