// ==============================================================================
// src/app/[locale]/(admin)/admin/certificates/edit/[id]/page.tsx
// Admin Edit Certificate Route
// ==============================================================================
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { EditCertificatePage } from "@features/certificates/presentation/pages";

export const metadata: Metadata = {
  title: "Edit Certificate | Rukn Al Assi Admin",
  description: "Update an existing certificate — modify titles, organizations, and validity dates.",
};

interface EditCertificateRouteProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AdminEditCertificatePage({ params }: EditCertificateRouteProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <EditCertificatePage certificateId={id} />;
}
