// ==============================================================================
// src/app/[locale]/(admin)/admin/services/edit/[id]/page.tsx
// Admin Edit Service Route
// ==============================================================================
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { EditServicePage } from "@features/services/presentation/pages";

export const metadata: Metadata = {
  title: "Edit Service | Rukn Al Assi Admin",
  description: "Update an existing service — modify multilingual content, image, and SEO settings.",
};

interface EditServiceRouteProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AdminEditServicePage({ params }: EditServiceRouteProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <EditServicePage serviceId={id} />;
}
