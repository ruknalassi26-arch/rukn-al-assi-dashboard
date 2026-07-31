// ==============================================================================
// features/settings/data/mapper/settings.mapper.ts
// Maps between Supabase DTOs and WebsiteSettings Domain Entity Classes
// ==============================================================================
import { WebsiteSettingsEntity } from "../../domain/entities/website-settings.entity";
import type { WebsiteSettingsDTO } from "../dto/settings.dto";

export function toWebsiteSettingsEntity(dto: WebsiteSettingsDTO): WebsiteSettingsEntity {
  return new WebsiteSettingsEntity({
    id: dto.id,
    companyNameEn: dto.company_name_en,
    companyNameAr: dto.company_name_ar,
    companyNameKu: dto.company_name_ku ?? null,
    taglineEn: dto.tagline_en ?? null,
    taglineAr: dto.tagline_ar ?? null,
    taglineKu: dto.tagline_ku ?? null,
    logoUrl: dto.logo_url ?? null,
    logoDarkUrl: dto.logo_dark_url ?? null,
    faviconUrl: dto.favicon_url ?? null,
    email: dto.email,
    phone: dto.phone,
    phoneSecondary: dto.phone_secondary ?? null,
    addressEn: dto.address_en,
    addressAr: dto.address_ar,
    addressKu: dto.address_ku ?? null,
    googleMapsUrl: dto.google_maps_url,
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
    workingHoursEn: dto.working_hours_en,
    workingHoursAr: dto.working_hours_ar,
    workingHoursKu: dto.working_hours_ku ?? null,
    facebookUrl: dto.facebook_url ?? null,
    twitterUrl: dto.twitter_url ?? null,
    linkedinUrl: dto.linkedin_url ?? null,
    instagramUrl: dto.instagram_url ?? null,
    youtubeUrl: dto.youtube_url ?? null,
    whatsappNumber: dto.whatsapp_number ?? null,
    seoTitleEn: dto.seo_title_en ?? null,
    seoTitleAr: dto.seo_title_ar ?? null,
    seoTitleKu: dto.seo_title_ku ?? null,
    seoDescriptionEn: dto.seo_description_en ?? null,
    seoDescriptionAr: dto.seo_description_ar ?? null,
    seoDescriptionKu: dto.seo_description_ku ?? null,
    updatedAt: new Date(dto.updated_at),
  });
}
