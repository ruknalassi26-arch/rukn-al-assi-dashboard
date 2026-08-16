// ==============================================================================
// app/[locale]/(admin)/admin/leave/history/page.tsx
// My Leave History Page
// ==============================================================================

import type { Metadata } from "next";
import { MyLeaveHistoryPage } from "@features/leave-management/presentation/pages";

export const metadata: Metadata = {
  title: "My Leave History | Rukn Al Assi",
  description: "View status and history of all submitted leave requests.",
};

export default function MyLeaveHistoryRoute() {
  return <MyLeaveHistoryPage />;
}
