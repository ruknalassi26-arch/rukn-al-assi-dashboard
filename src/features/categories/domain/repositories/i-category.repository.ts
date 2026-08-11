// ==============================================================================
// features/categories/domain/repositories/i-category.repository.ts
// ICategoryRepository Contract Interface matching DB Schema
// ==============================================================================
import type { CategoryEntity, CategoryStatus } from "../entities/category.entity";

export interface CategoryFilterParams {
  search?: string;
  status?: CategoryStatus | "all";
  page?: number;
  limit?: number;
  sortBy?: "sort_order" | "created_at" | "name_en";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedCategories {
  items: CategoryEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryTranslationInput {
  slug: string;
  name: string;
  description?: string | null;
}

export interface CreateCategoryInput {
  imageUrl?: string | null;
  sortOrder?: number;
  status?: CategoryStatus;
  translations: Record<string, CategoryTranslationInput>;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

export interface ICategoryRepository {
  getCategories(params?: CategoryFilterParams): Promise<PaginatedCategories>;
  getCategoryById(id: string): Promise<CategoryEntity | null>;
  getCategoryBySlug(slug: string): Promise<CategoryEntity | null>;
  createCategory(input: CreateCategoryInput): Promise<CategoryEntity>;
  updateCategory(input: UpdateCategoryInput): Promise<CategoryEntity>;
  deleteCategory(id: string): Promise<void>;
  duplicateCategory(id: string): Promise<CategoryEntity>;
  checkSlugUnique(slug: string, excludeId?: string): Promise<boolean>;
}
