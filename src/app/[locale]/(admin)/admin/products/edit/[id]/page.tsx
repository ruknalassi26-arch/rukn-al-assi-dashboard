// ==============================================================================
// src/app/[locale]/(admin)/admin/products/edit/[id]/page.tsx
// Admin Edit Product Route
// ==============================================================================
import type { Metadata } from "next";
import { EditProductPage } from "@features/products/presentation/pages";

export const metadata: Metadata = {
  title: "Edit Product | Rukn Al Assi Admin",
  description: "Update an existing product — modify bilingual content, images, category, and SEO.",
};

interface EditProductRouteProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: EditProductRouteProps) {
  const { id } = await params;
  return <EditProductPage productId={id} />;
}
