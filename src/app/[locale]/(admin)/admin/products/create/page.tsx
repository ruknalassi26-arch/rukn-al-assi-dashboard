// ==============================================================================
// src/app/[locale]/(admin)/admin/products/create/page.tsx
// Admin Create Product Route
// ==============================================================================
import type { Metadata } from "next";
import { CreateProductPage } from "@features/products/presentation/pages";

export const metadata: Metadata = {
  title: "Create Product | Rukn Al Assi Admin",
  description: "Add a new product to your catalog with bilingual content, images, and SEO metadata.",
};

export default function AdminCreateProductPage() {
  return <CreateProductPage />;
}
