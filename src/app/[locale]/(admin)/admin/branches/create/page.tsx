// ==============================================================================
// src/app/[locale]/(admin)/admin/branches/create/page.tsx
// Admin Create Branch Route
// ==============================================================================
import type { Metadata } from "next";
import { CreateBranchPage } from "@features/contact/presentation/pages";

export const metadata: Metadata = {
  title: "Create Branch | Rukn Al Assi Admin",
  description: "Add a new company branch location, address, phone number, and coordinates.",
};

export default function AdminCreateBranchPage() {
  return <CreateBranchPage />;
}
