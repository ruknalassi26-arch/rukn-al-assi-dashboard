"use client";
// ==============================================================================
// features/activity-log/presentation/components/activity-log-drawer.tsx
// Dialog Modal for Detailed Activity Log Inspection & JSON Diff
// ==============================================================================
import { useTranslations } from "next-intl";
// Using tCommon for shared labels
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Badge,
  Skeleton,
} from "@shared/ui";
import { useActivityLogStore } from "../stores/activity-log.store";
import { useActivityLogDetailQuery } from "@shared/hooks/activity-log/use-activity-log-hooks";
import { Activity, Clock, User, Globe, FileText, ArrowRight } from "lucide-react";

export function ActivityLogDrawer() {
  const t = useTranslations("activityLog.drawer");
  const tCommon = useTranslations("common");
  const { selectedLogId, isDrawerOpen, closeDrawer } = useActivityLogStore();

  const { data: item, isLoading } = useActivityLogDetailQuery(selectedLogId);

  return (
    <Dialog open={isDrawerOpen} onOpenChange={(open: boolean) => !open && closeDrawer()}>
      <DialogContent className="sm:max-w-xl w-full p-0 flex flex-col max-h-[85vh] bg-card overflow-hidden">
        <DialogHeader className="p-6 border-b bg-card space-y-1 relative">
          <div className="flex items-center gap-2.5 pe-10 flex-wrap sm:flex-nowrap">
            <Activity className="h-5 w-5 text-primary shrink-0" />
            <DialogTitle className="text-lg font-bold text-foreground">{t("title")}</DialogTitle>
            {item && (
              <Badge variant={item.actionBadgeVariant} className="text-xs uppercase font-semibold whitespace-nowrap px-2.5 py-0.5 shrink-0">
                {item.actionFormattedLabel}
              </Badge>
            )}
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>

        {/* Content Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : !item ? (
            <div className="text-center py-12 text-xs text-muted-foreground">
              Log details not found.
            </div>
          ) : (
            <>
              {/* Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 border rounded-lg bg-muted/20 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5 text-primary" /> {t("actionType")}
                  </span>
                  <p className="font-bold text-foreground capitalize">{item.action}</p>
                </div>

                <div className="p-3 border rounded-lg bg-muted/20 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-primary" /> {t("targetEntity")}
                  </span>
                  <p className="font-bold text-foreground truncate">{item.entityTitle || "—"}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono">{item.entityType}</p>
                </div>

                <div className="p-3 border rounded-lg bg-muted/20 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-primary" /> {t("userAccount")}
                  </span>
                  <p className="font-bold text-foreground truncate">{item.userName || "Administrator"}</p>
                  {item.userEmail && (
                    <p className="text-[10px] text-muted-foreground truncate">{item.userEmail}</p>
                  )}
                </div>
              </div>

              {/* Timestamp Banner */}
              <div className="p-3 border rounded-lg bg-primary/5 flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" /> {t("timestamp")}
                </span>
                <span className="font-mono font-bold text-primary">{item.formattedDate}</span>
              </div>

              {/* Activity Log Details JSON Inspector */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h4 className="text-xs font-bold text-foreground">Payload & Details (JSON)</h4>
                </div>
                <pre className="p-3.5 rounded-lg border bg-muted/40 font-mono text-[11px] overflow-x-auto max-h-64 leading-relaxed text-foreground">
                  {item.metadata ? JSON.stringify(item.metadata, null, 2) : "No details recorded."}
                </pre>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
