// ==============================================================================
// src/app/[locale]/(admin)/admin/contact/branches/edit/[id]/page.tsx
// Admin Edit Branch Route
// ==============================================================================
import type { Metadata } from "next";
import { EditBranchPage } from "@features/contact/presentation/pages";

export const metadata: Metadata = {
  title: "Edit Branch | Rukn Al Assi Admin",
  description: "Update an existing company branch location, phone number, address, or map location.",
};

interface EditBranchRouteProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditBranchPage({ params }: EditBranchRouteProps) {
  const { id } = await params;
  return <EditBranchPage branchId={id} />;
}
