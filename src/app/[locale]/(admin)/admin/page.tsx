// ==============================================================================
// src/app/[locale]/(admin)/admin/page.tsx
// Admin Dashboard page
// ==============================================================================
import type { Metadata } from "next";
import { DashboardPage } from "@features/dashboard/presentation/pages/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard | Rukn Al Assi Admin",
  description: "Enterprise management portal for business statistics, RFQs, and activity log.",
};

export default function AdminDashboardPage() {
  return <DashboardPage />;
}
