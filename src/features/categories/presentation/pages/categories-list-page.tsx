"use client";
// ==============================================================================
// features/categories/presentation/pages/categories-list-page.tsx
// Main Categories Management Page
// ==============================================================================
import { CategoryTable } from "../components/category-table";
import { CategoryDetailsDrawer } from "../components/category-details-drawer";

export function CategoriesListPage() {
  return (
    <div className="space-y-6">
      <CategoryTable />
      <CategoryDetailsDrawer />
    </div>
  );
}
