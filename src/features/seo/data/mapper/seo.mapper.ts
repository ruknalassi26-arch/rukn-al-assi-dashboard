// ==============================================================================
// features/seo/data/mapper/seo.mapper.ts
// Maps between Supabase DTOs and SEO Domain Entity Classes
// ==============================================================================
import { SeoSettingEntity } from "../../domain/entities/seo-setting.entity";
import type { SeoSettingDTO } from "../dto/seo.dto";

export function toSeoSettingEntity(dto: SeoSettingDTO): SeoSettingEntity {
  return new SeoSettingEntity({
    id: dto.id,
    pageKey: dto.page_key,
    metaTitleEn: dto.meta_title_en,
    metaTitleAr: dto.meta_title_ar,
    metaTitleKu: dto.meta_title_ku ?? null,
    metaDescriptionEn: dto.meta_description_en,
    metaDescriptionAr: dto.meta_description_ar,
    metaDescriptionKu: dto.meta_description_ku ?? null,
    keywordsEn: dto.keywords_en,
    keywordsAr: dto.keywords_ar,
    keywordsKu: dto.keywords_ku ?? null,
    ogImageUrl: dto.og_image_url,
    isIndexed: dto.is_indexed ?? true,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}
