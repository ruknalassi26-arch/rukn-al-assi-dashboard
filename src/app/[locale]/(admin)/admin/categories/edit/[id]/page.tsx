// ==============================================================================
// src/app/[locale]/(admin)/admin/categories/edit/[id]/page.tsx
// Admin Edit Category Route
// ==============================================================================
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { EditCategoryPage } from "@features/categories/presentation/pages";

export const metadata: Metadata = {
  title: "Edit Category | Rukn Al Assi Admin",
  description: "Update an existing category — modify multilingual content, sorting order, and SEO.",
};

interface EditCategoryRouteProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AdminEditCategoryPage({ params }: EditCategoryRouteProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <EditCategoryPage categoryId={id} />;
}
