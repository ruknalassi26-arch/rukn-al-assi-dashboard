// ==============================================================================
// features/settings/domain/repositories/i-settings.repository.ts
// ISettingsRepository Contract Interface
// ==============================================================================
import type { WebsiteSettingsEntity } from "../entities/website-settings.entity";

export interface UpdateWebsiteSettingsInput {
  companyNameEn: string;
  companyNameAr: string;
  companyNameKu?: string | null;
  taglineEn?: string | null;
  taglineAr?: string | null;
  taglineKu?: string | null;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  faviconUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  phoneSecondary?: string | null;
  addressEn?: string | null;
  addressAr?: string | null;
  addressKu?: string | null;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  workingHoursEn?: string | null;
  workingHoursAr?: string | null;
  workingHoursKu?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  whatsappNumber?: string | null;
  seoTitleEn?: string | null;
  seoTitleAr?: string | null;
  seoTitleKu?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionAr?: string | null;
  seoDescriptionKu?: string | null;
}

export interface ISettingsRepository {
  getSettings(): Promise<WebsiteSettingsEntity | null>;
  updateSettings(input: UpdateWebsiteSettingsInput): Promise<WebsiteSettingsEntity>;
}
