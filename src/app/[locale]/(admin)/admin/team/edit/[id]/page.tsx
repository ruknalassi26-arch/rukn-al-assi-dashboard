// ==============================================================================
// src/app/[locale]/(admin)/admin/team/edit/[id]/page.tsx
// Admin Edit Team Member Route
// ==============================================================================
import type { Metadata } from "next";
import { EditTeamMemberPage } from "@features/team/presentation/pages";

export const metadata: Metadata = {
  title: "Edit Team Member | Rukn Al Assi Admin",
  description: "Update an existing team member profile — modify job titles, biography, and contact info.",
};

interface EditTeamMemberRouteProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditTeamMemberPage({ params }: EditTeamMemberRouteProps) {
  const { id } = await params;
  return <EditTeamMemberPage memberId={id} />;
}
