// ==============================================================================
// features/categories/data/dto/category.dto.ts
// Data Transfer Objects for Product Categories from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type CategoryDTO = Tables<"product_categories">;
