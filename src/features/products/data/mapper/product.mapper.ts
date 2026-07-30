// ==============================================================================
// features/products/data/mapper/product.mapper.ts
// Maps between Supabase DTOs and Product Domain Entity Classes
// ==============================================================================
import { ProductEntity, ProductCategoryEntity } from "../../domain/entities/product.entity";
import type { ProductWithCategoryDTO, ProductCategoryDTO } from "../dto/product.dto";

export function toProductCategoryEntity(dto: ProductCategoryDTO): ProductCategoryEntity {
  return new ProductCategoryEntity({
    id: dto.id,
    slug: dto.slug,
    nameEn: dto.name_en,
    nameAr: dto.name_ar,
    descriptionEn: dto.description_en,
    descriptionAr: dto.description_ar,
    icon: dto.icon,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}

export function toProductEntity(dto: ProductWithCategoryDTO): ProductEntity {
  return new ProductEntity({
    id: dto.id,
    slug: dto.slug,
    nameEn: dto.name_en,
    nameAr: dto.name_ar,
    shortDescriptionEn: dto.short_description_en,
    shortDescriptionAr: dto.short_description_ar,
    descriptionEn: dto.description_en,
    descriptionAr: dto.description_ar,
    seoTitleEn: dto.seo_title_en,
    seoTitleAr: dto.seo_title_ar,
    seoDescriptionEn: dto.seo_description_en,
    seoDescriptionAr: dto.seo_description_ar,
    categoryId: dto.category_id,
    category: dto.product_categories ? toProductCategoryEntity(dto.product_categories) : null,
    images: dto.images ?? [],
    thumbnail: dto.thumbnail ?? (dto.images && dto.images.length > 0 ? dto.images[0] : null),
    datasheetUrl: dto.datasheet_url,
    seoImage: dto.seo_image,
    status: dto.status,
    isFeatured: dto.is_featured ?? false,
    sortOrder: dto.sort_order ?? 0,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}
