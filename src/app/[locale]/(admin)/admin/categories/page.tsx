// ==============================================================================
// src/app/[locale]/(admin)/admin/categories/page.tsx
// Admin Categories List Route
// ==============================================================================
import type { Metadata } from "next";
import { CategoriesListPage } from "@features/categories/presentation/pages";

export const metadata: Metadata = {
  title: "Categories | Rukn Al Assi Admin",
  description: "Manage product categories — create, edit, delete, and organize categories with multilingual support and SEO.",
};

export default function AdminCategoriesPage() {
  return <CategoriesListPage />;
}
