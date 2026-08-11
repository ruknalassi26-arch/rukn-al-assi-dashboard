// ==============================================================================
// features/categories/data/dto/category.dto.ts
// Data Transfer Objects for Product Categories matching Supabase schema
// ==============================================================================

export interface ProductCategoryRow {
  id: string;
  image_url: string | null;
  status: "published" | "draft" | "archived";
  sort_order: number;
  deleted_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategoryTranslationRow {
  product_category_id: string;
  language_code: string;
  slug: string;
  name: string;
  description: string | null;
}

export interface CategoryWithTranslationsDTO extends ProductCategoryRow {
  product_category_translations?: ProductCategoryTranslationRow[];
}

export type CategoryDTO = CategoryWithTranslationsDTO;
