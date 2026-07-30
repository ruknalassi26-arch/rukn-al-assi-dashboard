// ==============================================================================
// src/app/[locale]/(admin)/admin/team/page.tsx
// Admin Team Members List Route
// ==============================================================================
import type { Metadata } from "next";
import { TeamMembersListPage } from "@features/team/presentation/pages";

export const metadata: Metadata = {
  title: "Team Members | Rukn Al Assi Admin",
  description: "Manage executive leadership and team personnel profiles, job titles, and contact information.",
};

export default function AdminTeamPage() {
  return <TeamMembersListPage />;
}
