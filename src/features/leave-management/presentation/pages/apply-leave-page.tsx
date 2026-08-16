"use client";
// ==============================================================================
// features/leave-management/presentation/pages/apply-leave-page.tsx
// Dedicated page for applying for vacation or leave
// ==============================================================================

import { LeaveApplyForm } from "../components";

export function ApplyLeavePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <LeaveApplyForm />
    </div>
  );
}
