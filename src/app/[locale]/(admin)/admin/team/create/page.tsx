// ==============================================================================
// src/app/[locale]/(admin)/admin/team/create/page.tsx
// Admin Create Team Member Route
// ==============================================================================
import type { Metadata } from "next";
import { CreateTeamMemberPage } from "@features/team/presentation/pages";

export const metadata: Metadata = {
  title: "Create Team Member | Rukn Al Assi Admin",
  description: "Add a new executive or team personnel profile with multilingual names and titles.",
};

export default function AdminCreateTeamMemberPage() {
  return <CreateTeamMemberPage />;
}
