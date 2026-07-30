// ==============================================================================
// src/app/[locale]/(admin)/admin/products/page.tsx
// Admin Products List Route
// ==============================================================================
import type { Metadata } from "next";
import { ProductsListPage } from "@features/products/presentation/pages";

export const metadata: Metadata = {
  title: "Products | Rukn Al Assi Admin",
  description: "Manage your product catalog — create, edit, delete, and organize products with categories, images, and SEO.",
};

export default function AdminProductsPage() {
  return <ProductsListPage />;
}
