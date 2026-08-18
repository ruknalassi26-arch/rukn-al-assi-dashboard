// ==============================================================================
// features/homepage/data/dto/homepage.dto.ts
// Data Transfer Objects for Homepage Management
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type HomepageSectionDTO = Tables<"homepage_sections">;
export type HomepageSectionTranslationDTO = Tables<"homepage_section_translations">;

export interface HeroSettingsDTO {
  media_type: "video" | "image";
  video_url: string | null;
  video_poster_url: string | null;
  video_mobile_url: string | null;
  overlay_opacity: number;

  title_en: string;
  title_ar: string;
  title_ku: string;

  subtitle_en: string;
  subtitle_ar: string;
  subtitle_ku: string;

  body_en: string;
  body_ar: string;
  body_ku: string;

  primary_button_text_en: string;
  primary_button_text_ar: string;
  primary_button_text_ku: string;
  primary_button_url: string;

  secondary_button_text_en: string;
  secondary_button_text_ar: string;
  secondary_button_text_ku: string;
  secondary_button_url: string | null;
}

export type AboutPreviewDTO = HomepageSectionDTO & { homepage_section_translations?: HomepageSectionTranslationDTO[] };
export type StatTranslationDTO = Tables<"stat_translations">;
export type CompanyStatDTO = Tables<"stats"> & {
  stat_translations?: StatTranslationDTO[];
};
export type ClientDTO = Tables<"clients">;
export type CertificateDTO = Tables<"certificates">;
export type ContactCtaDTO = HomepageSectionDTO & { homepage_section_translations?: HomepageSectionTranslationDTO[] };

export type FeaturedServiceDTO = Tables<"services">;
export type FeaturedProductDTO = Tables<"products">;
export type FeaturedProjectDTO = Tables<"projects">;
