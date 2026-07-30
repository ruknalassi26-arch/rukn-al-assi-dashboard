// ==============================================================================
// features/categories/domain/repositories/i-category.repository.ts
// ICategoryRepository Contract Interface
// ==============================================================================
import type { CategoryEntity, CategoryStatus } from "../entities/category.entity";

export interface CategoryFilterParams {
  search?: string;
  status?: CategoryStatus | "all";
  page?: number;
  limit?: number;
  sortBy?: "name_en" | "sort_order" | "created_at";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedCategories {
  items: CategoryEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCategoryInput {
  slug: string;
  nameEn: string;
  nameAr: string;
  nameKu?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  descriptionKu?: string | null;
  icon?: string | null;
  image?: string | null;
  seoTitleEn?: string | null;
  seoTitleAr?: string | null;
  seoTitleKu?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionAr?: string | null;
  seoDescriptionKu?: string | null;
  sortOrder?: number;
  status?: CategoryStatus;
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
}
