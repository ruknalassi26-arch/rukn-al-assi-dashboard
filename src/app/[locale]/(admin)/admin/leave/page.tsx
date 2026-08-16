// ==============================================================================
// app/[locale]/(admin)/admin/leave/page.tsx
// Employee Vacation & Leave Portal Dashboard
// ==============================================================================

import type { Metadata } from "next";
import { EmployeeLeaveDashboardPage } from "@features/leave-management/presentation/pages";

export const metadata: Metadata = {
  title: "Vacation & Leave Portal | Rukn Al Assi",
  description: "Employee time off, balance tracking, and vacation request portal.",
};

export default function LeaveDashboardRoute() {
  return <EmployeeLeaveDashboardPage />;
}
