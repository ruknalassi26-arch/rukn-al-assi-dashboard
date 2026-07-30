// ==============================================================================
// features/services/data/mapper/service.mapper.ts
// Maps between Supabase Service DTOs and Service Domain Entity Classes
// ==============================================================================
import { ServiceEntity } from "../../domain/entities/service.entity";
import type { ServiceDTO } from "../dto/service.dto";

export function toServiceEntity(dto: ServiceDTO): ServiceEntity {
  return new ServiceEntity({
    id: dto.id,
    slug: dto.slug,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    titleKu: dto.title_ku ?? null,
    shortDescriptionEn: dto.short_description_en ?? null,
    shortDescriptionAr: dto.short_description_ar ?? null,
    shortDescriptionKu: dto.short_description_ku ?? null,
    descriptionEn: dto.description_en,
    descriptionAr: dto.description_ar,
    descriptionKu: dto.description_ku ?? null,
    icon: dto.icon,
    image: dto.image,
    seoTitleEn: dto.seo_title_en ?? null,
    seoTitleAr: dto.seo_title_ar ?? null,
    seoTitleKu: dto.seo_title_ku ?? null,
    seoDescriptionEn: dto.seo_description_en ?? null,
    seoDescriptionAr: dto.seo_description_ar ?? null,
    seoDescriptionKu: dto.seo_description_ku ?? null,
    seoImage: dto.seo_image ?? null,
    isFeatured: dto.is_featured ?? false,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}
