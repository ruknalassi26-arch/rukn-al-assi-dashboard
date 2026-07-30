// ==============================================================================
// features/products/data/models/product.dto.ts
// Data Transfer Objects — the exact shape returned by Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type ProductDTO = Tables<"products">;

export interface ProductSummaryDTO {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  images: string[];
  status: "active" | "draft" | "archived";
  is_featured: boolean;
  sort_order: number;
}
