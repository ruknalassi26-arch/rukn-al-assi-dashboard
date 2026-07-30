"use client";
// ==============================================================================
// features/products/presentation/pages/products-list-page.tsx
// Main Products Catalog Management Page
// ==============================================================================
import { ProductTable } from "../components/product-table";
import { ProductDetailsDrawer } from "../components/product-details-drawer";

export function ProductsListPage() {
  return (
    <div className="space-y-6">
      <ProductTable />
      <ProductDetailsDrawer />
    </div>
  );
}
