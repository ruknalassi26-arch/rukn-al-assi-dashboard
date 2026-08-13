// ==============================================================================
// features/homepage/data/dto/homepage.dto.ts
// Data Transfer Objects for Homepage Management
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type HomepageSectionDTO = Tables<"homepage_sections">;
export type HomepageSectionTranslationDTO = Tables<"homepage_section_translations">;
export type HeroSlideDTO = HomepageSectionDTO & { homepage_section_translations?: HomepageSectionTranslationDTO[] };

export type AboutPreviewDTO = Tables<"homepage_about">;
export type CompanyStatDTO = Tables<"company_statistics">;
export type ClientDTO = Tables<"clients">;
export type CertificateDTO = Tables<"certificates">;
export type ContactCtaDTO = Tables<"homepage_contact_cta">;

export type FeaturedServiceDTO = Tables<"services">;
export type FeaturedProductDTO = Tables<"products">;
export type FeaturedProjectDTO = Tables<"projects">;
