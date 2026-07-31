// ==============================================================================
// src/app/[locale]/(admin)/admin/branches/page.tsx
// Admin Company Branches Management Route
// ==============================================================================
import type { Metadata } from "next";
import { BranchTable } from "@features/contact/presentation/components/branch-table";
import { BranchDetailsDrawer } from "@features/contact/presentation/components/branch-details-drawer";

export const metadata: Metadata = {
  title: "Company Branches | Rukn Al Assi Admin",
  description: "Manage regional company office locations, branch phone numbers, addresses, and headquarters settings.",
};

export default function AdminBranchesPage() {
  return (
    <div className="space-y-6">
      <BranchTable />
      <BranchDetailsDrawer />
    </div>
  );
}
