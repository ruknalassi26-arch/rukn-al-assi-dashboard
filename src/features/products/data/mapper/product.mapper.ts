// ==============================================================================
// features/products/data/mapper/product.mapper.ts
// Maps between Supabase DTOs and Product Domain Entity
// ==============================================================================
import {
  ProductEntity,
  type ProductTranslationProps,
  type SeoMetaProps,
  type ProductImageProps,
} from "../../domain/entities/product.entity";
import { toCategoryEntity } from "@features/categories/data/mapper/category.mapper";
import type { ProductWithRelationsDTO } from "../dto/product.dto";

export function toProductEntity(dto: ProductWithRelationsDTO): ProductEntity {
  const transList = dto.product_translations ?? [];
  const translations: Record<string, ProductTranslationProps> = {};

  for (const t of transList) {
    if (t.language_code) {
      translations[t.language_code] = {
        slug: t.slug || "",
        name: t.name || "",
        shortDescription: t.short_description || null,
        specifications: t.specifications || null,
      };
    }
  }

  const seoList = dto.seo_meta ?? [];
  const seoMeta: Record<string, SeoMetaProps> = {};
  for (const s of seoList) {
    if (s.language_code) {
      seoMeta[s.language_code] = {
        metaTitle: s.meta_title || null,
        metaDescription: s.meta_description || null,
        ogImageUrl: s.og_image_url || null,
      };
    }
  }

  const imgList = dto.product_images ?? [];
  const images: ProductImageProps[] = imgList.map((img) => ({
    id: img.id,
    imageUrl: img.image_url,
    mimeType: img.mime_type ?? null,
    isPrimary: img.is_primary ?? false,
    sortOrder: img.sort_order ?? 0,
  }));

  const category = dto.product_categories ? toCategoryEntity(dto.product_categories) : null;

  return new ProductEntity({
    id: dto.id,
    sku: dto.sku ?? null,
    categoryId: dto.category_id ?? null,
    category,
    datasheetUrl: dto.datasheet_url ?? null,
    status: dto.status ?? "published",
    isFeatured: dto.is_featured ?? false,
    featuredOrder: dto.featured_order ?? 0,
    sortOrder: dto.sort_order ?? 0,
    createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
    updatedAt: dto.updated_at ? new Date(dto.updated_at) : new Date(),
    images,
    translations,
    seoMeta,
  });
}
