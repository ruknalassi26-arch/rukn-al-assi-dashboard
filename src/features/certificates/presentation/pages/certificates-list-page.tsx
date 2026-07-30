"use client";
// ==============================================================================
// features/certificates/presentation/pages/certificates-list-page.tsx
// Main Certificates Catalog Management Page
// ==============================================================================
import { CertificateTable } from "../components/certificate-table";
import { CertificateDetailsDrawer } from "../components/certificate-details-drawer";

export function CertificatesListPage() {
  return (
    <div className="space-y-6">
      <CertificateTable />
      <CertificateDetailsDrawer />
    </div>
  );
}
