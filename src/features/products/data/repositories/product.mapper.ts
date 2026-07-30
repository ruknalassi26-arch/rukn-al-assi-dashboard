// ==============================================================================
// features/products/data/repositories/product.mapper.ts
// Maps between Supabase DTOs and domain entities
// ==============================================================================
import type { InsertTables, UpdateTables } from "@core/types/database.types";
import type { ProductDTO, ProductSummaryDTO } from "../models/product.dto";
import type { ProductEntity, ProductSummary } from "../../domain/entities/product.entity";
import { ProductStatus } from "../../domain/enums/product.enums";

/**
 * Converts a raw Supabase ProductDTO to a ProductEntity.
 */
export function toProductEntity(dto: ProductDTO): ProductEntity {
  return {
    id: dto.id,
    slug: dto.slug,
    nameEn: dto.name_en,
    nameAr: dto.name_ar,
    descriptionEn: dto.description_en,
    descriptionAr: dto.description_ar,
    categoryId: dto.category_id,
    images: dto.images,
    status: dto.status as ProductStatus,
    isFeatured: dto.is_featured,
    sortOrder: dto.sort_order,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  };
}

/**
 * Converts a ProductSummaryDTO to a ProductSummary entity.
 */
export function toProductSummary(dto: ProductSummaryDTO): ProductSummary {
  return {
    id: dto.id,
    slug: dto.slug,
    nameEn: dto.name_en,
    nameAr: dto.name_ar,
    thumbnailUrl: dto.images[0] ?? null,
    status: dto.status as ProductStatus,
    isFeatured: dto.is_featured,
  };
}

/**
 * Converts a ProductEntity to a Supabase insert payload.
 */
export function toProductInsert(entity: Partial<ProductEntity>): InsertTables<"products"> {
  return {
    slug: entity.slug!,
    name_en: entity.nameEn!,
    name_ar: entity.nameAr!,
    description_en: entity.descriptionEn ?? null,
    description_ar: entity.descriptionAr ?? null,
    category_id: entity.categoryId ?? null,
    images: entity.images ?? [],
    status: entity.status ?? "active",
    is_featured: entity.isFeatured ?? false,
    sort_order: entity.sortOrder ?? 0,
  };
}

/**
 * Converts a ProductEntity to a Supabase update payload.
 */
export function toProductUpdate(entity: Partial<ProductEntity>): UpdateTables<"products"> {
  const payload: UpdateTables<"products"> = {};
  if (entity.slug !== undefined) payload.slug = entity.slug;
  if (entity.nameEn !== undefined) payload.name_en = entity.nameEn;
  if (entity.nameAr !== undefined) payload.name_ar = entity.nameAr;
  if (entity.descriptionEn !== undefined) payload.description_en = entity.descriptionEn;
  if (entity.descriptionAr !== undefined) payload.description_ar = entity.descriptionAr;
  if (entity.categoryId !== undefined) payload.category_id = entity.categoryId;
  if (entity.images !== undefined) payload.images = entity.images;
  if (entity.status !== undefined) payload.status = entity.status;
  if (entity.isFeatured !== undefined) payload.is_featured = entity.isFeatured;
  if (entity.sortOrder !== undefined) payload.sort_order = entity.sortOrder;
  return payload;
}
