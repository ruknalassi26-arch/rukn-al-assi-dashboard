// ==============================================================================
// features/products/domain/repositories/i-product.repository.ts
// Domain Repository Interface for Products Management
// ==============================================================================
import { ProductEntity, ProductCategoryEntity, ProductStatus } from "../entities/product.entity";

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

export interface CreateProductInput {
  slug: string;
  nameEn: string;
  nameAr: string;
  shortDescriptionEn?: string | null;
  shortDescriptionAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  seoTitleEn?: string | null;
  seoTitleAr?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionAr?: string | null;
  categoryId?: string | null;
  images?: string[];
  thumbnail?: string | null;
  datasheetUrl?: string | null;
  seoImage?: string | null;
  status?: ProductStatus;
  isFeatured?: boolean;
  sortOrder?: number;
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
  getCategories(): Promise<ProductCategoryEntity[]>;
  checkSlugUnique(slug: string, excludeId?: string): Promise<boolean>;
}
