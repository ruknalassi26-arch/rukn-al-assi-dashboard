// ==============================================================================
// features/products/domain/repositories/i-product.repository.ts
// Repository CONTRACT (interface) — defines what the data layer must implement
// ==============================================================================
import type { ProductEntity, ProductSummary } from "../entities/product.entity";
import type { ProductStatus } from "../enums/product.enums";
import type { ListParams, PaginatedResponse } from "@core/types/api.types";

export interface ProductFilters {
  status?: ProductStatus;
  categoryId?: string;
  isFeatured?: boolean;
}

export interface IProductRepository {
  findAll(params: ListParams & ProductFilters): Promise<PaginatedResponse<ProductSummary>>;
  findBySlug(slug: string): Promise<ProductEntity | null>;
  findById(id: string): Promise<ProductEntity | null>;
  findFeatured(limit?: number): Promise<ProductSummary[]>;
  create(data: Omit<ProductEntity, "id" | "createdAt" | "updatedAt">): Promise<ProductEntity>;
  update(id: string, data: Partial<ProductEntity>): Promise<ProductEntity>;
  archive(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
