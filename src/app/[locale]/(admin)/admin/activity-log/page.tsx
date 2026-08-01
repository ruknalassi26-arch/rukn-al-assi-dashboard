// ==============================================================================
// src/app/[locale]/(admin)/admin/activity-log/page.tsx
// Admin Activity Log Route Page
// ==============================================================================
import type { Metadata } from "next";
import { ActivityLogPage } from "@features/activity-log/presentation/pages";

export const metadata: Metadata = {
  title: "Activity Log | Rukn Al Assi Admin",
  description: "Read-only audit stream tracking all administrator actions and system updates",
};

export default function AdminActivityLogRoute() {
  return <ActivityLogPage />;
}
