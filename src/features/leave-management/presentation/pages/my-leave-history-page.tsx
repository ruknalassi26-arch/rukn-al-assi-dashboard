"use client";
// ==============================================================================
// features/leave-management/presentation/pages/my-leave-history-page.tsx
// My Leave History Page
// ==============================================================================

import { LeaveHistoryTable } from "../components";

export function MyLeaveHistoryPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <LeaveHistoryTable />
    </div>
  );
}
