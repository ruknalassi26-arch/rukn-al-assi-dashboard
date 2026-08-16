// ==============================================================================
// app/[locale]/(admin)/admin/leave/apply/page.tsx
// Apply for Leave Page
// ==============================================================================

import type { Metadata } from "next";
import { ApplyLeavePage } from "@features/leave-management/presentation/pages";

export const metadata: Metadata = {
  title: "Apply for Leave | Rukn Al Assi",
  description: "Submit a new vacation, sick leave, or absence request.",
};

export default function ApplyLeaveRoute() {
  return <ApplyLeavePage />;
}
