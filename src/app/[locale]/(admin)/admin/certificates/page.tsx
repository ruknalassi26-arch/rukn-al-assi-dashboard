// ==============================================================================
// src/app/[locale]/(admin)/admin/certificates/page.tsx
// Admin Certificates List Route
// ==============================================================================
import type { Metadata } from "next";
import { CertificatesListPage } from "@features/certificates/presentation/pages";

export const metadata: Metadata = {
  title: "Certificates | Rukn Al Assi Admin",
  description: "Manage ISO and quality compliance certificates, dates, and issuing bodies.",
};

export default function AdminCertificatesPage() {
  return <CertificatesListPage />;
}
