"use client";
// ==============================================================================
// features/services/presentation/pages/services-list-page.tsx
// Main Services Catalog Management Page
// ==============================================================================
import { ServiceTable } from "../components/service-table";
import { ServiceDetailsDrawer } from "../components/service-details-drawer";

export function ServicesListPage() {
  return (
    <div className="space-y-6">
      <ServiceTable />
      <ServiceDetailsDrawer />
    </div>
  );
}
