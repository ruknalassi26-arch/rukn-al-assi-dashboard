// ==============================================================================
// features/products/domain/enums/product.enums.ts
// Domain-level string enums for products
// ==============================================================================

export enum ProductStatus {
  Active = "active",
  Draft = "draft",
  Archived = "archived",
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  [ProductStatus.Active]: "Active",
  [ProductStatus.Draft]: "Draft",
  [ProductStatus.Archived]: "Archived",
};

export const PRODUCT_STATUS_VARIANTS: Record<ProductStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [ProductStatus.Active]: "default",
  [ProductStatus.Draft]: "secondary",
  [ProductStatus.Archived]: "outline",
};
