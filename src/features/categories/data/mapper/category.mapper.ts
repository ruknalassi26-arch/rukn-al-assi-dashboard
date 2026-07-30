// ==============================================================================
// features/categories/data/mapper/category.mapper.ts
// Maps between Supabase Category DTOs and Category Domain Entity Classes
// ==============================================================================
import { CategoryEntity } from "../../domain/entities/category.entity";
import type { CategoryDTO } from "../dto/category.dto";

export function toCategoryEntity(dto: CategoryDTO): CategoryEntity {
  return new CategoryEntity({
    id: dto.id,
    slug: dto.slug,
    nameEn: dto.name_en,
    nameAr: dto.name_ar,
    nameKu: dto.name_ku ?? null,
    descriptionEn: dto.description_en,
    descriptionAr: dto.description_ar,
    descriptionKu: dto.description_ku ?? null,
    icon: dto.icon,
    image: dto.image ?? null,
    seoTitleEn: dto.seo_title_en ?? null,
    seoTitleAr: dto.seo_title_ar ?? null,
    seoTitleKu: dto.seo_title_ku ?? null,
    seoDescriptionEn: dto.seo_description_en ?? null,
    seoDescriptionAr: dto.seo_description_ar ?? null,
    seoDescriptionKu: dto.seo_description_ku ?? null,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}
