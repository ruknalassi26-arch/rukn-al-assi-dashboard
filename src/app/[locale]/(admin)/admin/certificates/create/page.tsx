// ==============================================================================
// src/app/[locale]/(admin)/admin/certificates/create/page.tsx
// Admin Create Certificate Route
// ==============================================================================
import type { Metadata } from "next";
import { CreateCertificatePage } from "@features/certificates/presentation/pages";

export const metadata: Metadata = {
  title: "Create Certificate | Rukn Al Assi Admin",
  description: "Add a new compliance or quality certificate with multilingual English, Arabic, and Kurdish titles.",
};

export default function AdminCreateCertificatePage() {
  return <CreateCertificatePage />;
}
