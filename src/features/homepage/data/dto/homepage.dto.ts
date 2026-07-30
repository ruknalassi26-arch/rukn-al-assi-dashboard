// ==============================================================================
// features/homepage/data/dto/homepage.dto.ts
// Data Transfer Objects for Homepage Management
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type HeroSlideDTO = Tables<"homepage_hero">;
export type AboutPreviewDTO = Tables<"homepage_about">;
export type CompanyStatDTO = Tables<"company_statistics">;
export type ClientDTO = Tables<"clients">;
export type CertificateDTO = Tables<"certificates">;
export type ContactCtaDTO = Tables<"homepage_contact_cta">;

export type FeaturedServiceDTO = Tables<"services">;
export type FeaturedProductDTO = Tables<"products">;
export type FeaturedProjectDTO = Tables<"projects">;
