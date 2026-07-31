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
  keywordsEn?: string | null;
  keywordsAr?: string | null;
  keywordsKu?: string | null;
  ogImageUrl?: string | null;
  isIndexed?: boolean;
}

export interface ISeoRepository {
  getAllSeoSettings(): Promise<SeoSettingEntity[]>;
  getSeoSettingByPageKey(pageKey: SeoPageKey): Promise<SeoSettingEntity | null>;
  updateSeoSetting(input: UpdateSeoSettingInput): Promise<SeoSettingEntity>;
}
