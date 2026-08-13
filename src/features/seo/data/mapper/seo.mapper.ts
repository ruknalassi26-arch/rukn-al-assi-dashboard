// ==============================================================================
// features/seo/data/mapper/seo.mapper.ts
// Maps between Supabase DTOs and SEO Domain Entity Classes
// ==============================================================================
import { SeoSettingEntity } from "../../domain/entities/seo-setting.entity";
import type { SeoPageKey } from "../../domain/entities/seo-setting.entity";
import type { SeoSettingDTO } from "../dto/seo.dto";

export function toSeoSettingEntity(pageKey: SeoPageKey, rows: SeoSettingDTO[]): SeoSettingEntity {
  const enRow: Partial<SeoSettingDTO> = rows.find((r) => r.entity_type === pageKey && r.language_code === "en") || {};
  const arRow: Partial<SeoSettingDTO> = rows.find((r) => r.entity_type === pageKey && r.language_code === "ar") || {};
  const kuRow: Partial<SeoSettingDTO> = rows.find((r) => r.entity_type === pageKey && r.language_code === "ku") || {};

  return new SeoSettingEntity({
    id: String(enRow.id || `seo-${pageKey}`),
    pageKey,
    metaTitleEn: enRow.meta_title || `Rukn Al Assi — ${pageKey}`,
    metaTitleAr: arRow.meta_title || `ركن العاصي — ${pageKey}`,
    metaTitleKu: kuRow.meta_title || null,
    metaDescriptionEn: enRow.meta_description || "",
    metaDescriptionAr: arRow.meta_description || "",
    metaDescriptionKu: kuRow.meta_description || null,
    canonicalUrlEn: enRow.canonical_url || null,
    canonicalUrlAr: arRow.canonical_url || null,
    canonicalUrlKu: kuRow.canonical_url || null,
    ogImageUrl: enRow.og_image_url || arRow.og_image_url || null,
    schemaJson: (enRow.schema_json as any) || null,
    isIndexed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
