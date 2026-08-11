// ==============================================================================
// features/products/domain/repositories/i-product.repository.ts
// Domain Repository Interface for Products Management strictly matching DB schema
// ==============================================================================
import type { ProductEntity, ProductStatus } from "../entities/product.entity";
import type { CategoryEntity } from "@features/categories/domain/entities/category.entity";

export interface ProductFilterParams {
  search?: string;
  categoryId?: string;
  status?: ProductStatus | "all";
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedProducts {
  items: ProductEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductTranslationInput {
  slug: string;
  name: string;
  shortDescription?: string | null;
  specifications?: Record<string, any> | null;
}

export interface ProductImageInput {
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface CreateProductInput {
  sku?: string | null;
  categoryId?: string | null;
  datasheetUrl?: string | null;
  status?: ProductStatus;
  isFeatured?: boolean;
  featuredOrder?: number;
  sortOrder?: number;
  translations: Record<string, ProductTranslationInput>;
  images?: ProductImageInput[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export interface IProductRepository {
  getProducts(params?: ProductFilterParams): Promise<PaginatedProducts>;
  getProductById(id: string): Promise<ProductEntity | null>;
  getProductBySlug(slug: string): Promise<ProductEntity | null>;
  createProduct(input: CreateProductInput): Promise<ProductEntity>;
  updateProduct(input: UpdateProductInput): Promise<ProductEntity>;
  deleteProduct(id: string): Promise<void>;
  duplicateProduct(id: string): Promise<ProductEntity>;
  toggleFeatureProduct(id: string, isFeatured: boolean): Promise<ProductEntity>;
  bulkDeleteProducts(ids: string[]): Promise<void>;
  bulkUpdateProductStatus(ids: string[], status: ProductStatus): Promise<void>;
  getCategories(): Promise<CategoryEntity[]>;
  checkSlugUnique(slug: string, excludeId?: string): Promise<boolean>;
}
