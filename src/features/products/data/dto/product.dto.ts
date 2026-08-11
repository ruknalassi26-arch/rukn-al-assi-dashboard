// ==============================================================================
// features/products/data/dto/product.dto.ts
// Data Transfer Objects for Products matching exact Supabase Schema
// ==============================================================================
import type { CategoryWithTranslationsDTO } from "@features/categories/data/dto/category.dto";

export interface ProductRow {
  id: string;
  category_id: string | null;
  sku: string | null;
  datasheet_url: string | null;
  status: "published" | "draft" | "archived";
  is_featured: boolean;
  featured_order: number | null;
  sort_order: number;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductTranslationRow {
  product_id: string;
  language_code: string;
  slug: string;
  name: string;
  short_description: string | null;
  specifications: Record<string, any> | null;
  search_vector?: string | null;
}

export interface ProductImageRow {
  id?: string;
  product_id: string;
  image_url: string;
  mime_type: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductWithRelationsDTO extends ProductRow {
  product_translations?: ProductTranslationRow[];
  product_images?: ProductImageRow[];
  product_categories?: CategoryWithTranslationsDTO | null;
}

export type ProductDTO = ProductWithRelationsDTO;
