// ==============================================================================
// src/app/[locale]/(admin)/admin/team/edit/[id]/page.tsx
// Admin Edit Team Member Route
// ==============================================================================
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { EditTeamMemberPage } from "@features/team/presentation/pages";

export const metadata: Metadata = {
  title: "Edit Team Member | Rukn Al Assi Admin",
  description: "Update an existing team member profile — modify job titles, biography, and contact info.",
};

interface EditTeamMemberRouteProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AdminEditTeamMemberPage({ params }: EditTeamMemberRouteProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <EditTeamMemberPage memberId={id} />;
}
