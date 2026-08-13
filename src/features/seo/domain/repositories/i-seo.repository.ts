// ==============================================================================
// features/seo/domain/repositories/i-seo.repository.ts
// ISeoRepository Contract Interface
// ==============================================================================
import type { SeoSettingEntity, SeoPageKey } from "../entities/seo-setting.entity";

export interface UpdateSeoSettingInput {
  pageKey: SeoPageKey;
  metaTitleEn?: string | null;
  metaTitleAr?: string | null;
  metaTitleKu?: string | null;
  metaDescriptionEn?: string | null;
  metaDescriptionAr?: string | null;
  metaDescriptionKu?: string | null;
  canonicalUrlEn?: string | null;
  canonicalUrlAr?: string | null;
  canonicalUrlKu?: string | null;
  ogImageUrl?: string | null;
  schemaJson?: Record<string, unknown> | unknown[] | null;
  isIndexed?: boolean;
}

export interface ISeoRepository {
  getAllSeoSettings(): Promise<SeoSettingEntity[]>;
  getSeoSettingByPageKey(pageKey: SeoPageKey): Promise<SeoSettingEntity | null>;
  updateSeoSetting(input: UpdateSeoSettingInput): Promise<SeoSettingEntity>;
}
