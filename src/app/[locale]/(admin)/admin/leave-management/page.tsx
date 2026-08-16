// ==============================================================================
// app/[locale]/(admin)/admin/leave-management/page.tsx
// Admin Leave Management Route
// ==============================================================================

import type { Metadata } from "next";
import { AdminLeaveManagementPage } from "@features/leave-management/presentation/pages";

export const metadata: Metadata = {
  title: "Leave Management | Rukn Al Assi Admin",
  description: "Company-wide leave request approval, employee balances, and leave policies.",
};

export default function AdminLeaveManagementRoute() {
  return <AdminLeaveManagementPage />;
}
