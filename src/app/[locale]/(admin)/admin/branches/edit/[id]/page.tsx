// ==============================================================================
// src/app/[locale]/(admin)/admin/branches/edit/[id]/page.tsx
// Admin Edit Branch Route
// ==============================================================================
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { EditBranchPage } from "@features/contact/presentation/pages";

export const metadata: Metadata = {
  title: "Edit Branch | Rukn Al Assi Admin",
  description: "Update an existing company branch location, phone number, address, or coordinates.",
};

interface EditBranchRouteProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AdminEditBranchPage({ params }: EditBranchRouteProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <EditBranchPage branchId={id} />;
}
