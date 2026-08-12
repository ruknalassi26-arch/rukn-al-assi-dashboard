// ==============================================================================
// src/app/[locale]/(admin)/admin/team/[id]/edit/page.tsx
// Route Alias for Admin Edit Team Member Route (/admin/team/[id]/edit)
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

export default async function AdminEditTeamMemberAliasPage({ params }: EditTeamMemberRouteProps) {
  const { id } = await params;
  return <EditTeamMemberPage memberId={id} />;
}
