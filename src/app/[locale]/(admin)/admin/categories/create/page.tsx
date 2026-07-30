// ==============================================================================
// src/app/[locale]/(admin)/admin/categories/create/page.tsx
// Admin Create Category Route
// ==============================================================================
import type { Metadata } from "next";
import { CreateCategoryPage } from "@features/categories/presentation/pages";

export const metadata: Metadata = {
  title: "Create Category | Rukn Al Assi Admin",
  description: "Add a new product category with English, Arabic, and Kurdish multilingual content.",
};

export default function AdminCreateCategoryPage() {
  return <CreateCategoryPage />;
}
