// ==============================================================================
// features/products/data/dto/product.dto.ts
// Data Transfer Objects for Products & Categories from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type ProductDTO = Tables<"products">;
export type ProductCategoryDTO = Tables<"product_categories">;

export interface ProductWithCategoryDTO extends ProductDTO {
  product_categories?: ProductCategoryDTO | null;
}
