"use client";
// ==============================================================================
// features/activity-log/presentation/pages/activity-log-page.tsx
// Main Activity Log Admin Page
// ==============================================================================
import { Activity, ShieldCheck } from "lucide-react";
import { ActivityLogFilters } from "../components/activity-log-filters";
import { ActivityLogTable } from "../components/activity-log-table";
import { ActivityLogDrawer } from "../components/activity-log-drawer";

export function ActivityLogPage() {
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Activity className="h-7 w-7 text-primary" />
            System Activity Log
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Read-only audit stream tracking all administrator actions, authentication events, state updates, and deletions.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/30 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Audit Log Read-Only Protection</span>
        </div>
      </div>

      {/* Filters */}
      <ActivityLogFilters />

      {/* Main Data Table */}
      <ActivityLogTable />

      {/* Read-Only Detail Sheet Drawer */}
      <ActivityLogDrawer />
    </div>
  );
}
