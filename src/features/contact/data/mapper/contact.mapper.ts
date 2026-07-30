// ==============================================================================
// features/contact/data/mapper/contact.mapper.ts
// Maps between Supabase DTOs and Contact/Branch Domain Entity Classes
// ==============================================================================
import { ContactInfoEntity } from "../../domain/entities/contact-info.entity";
import { BranchEntity } from "../../domain/entities/branch.entity";
import type { ContactInfoDTO, BranchDTO } from "../dto/contact.dto";

export function toContactInfoEntity(dto: ContactInfoDTO): ContactInfoEntity {
  return new ContactInfoEntity({
    id: dto.id,
    companyNameEn: dto.company_name_en,
    companyNameAr: dto.company_name_ar,
    companyNameKu: dto.company_name_ku ?? null,
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

export function toBranchEntity(dto: BranchDTO): BranchEntity {
  return new BranchEntity({
    id: dto.id,
    nameEn: dto.name_en,
    nameAr: dto.name_ar,
    nameKu: dto.name_ku ?? null,
    addressEn: dto.address_en,
    addressAr: dto.address_ar,
    addressKu: dto.address_ku ?? null,
    cityEn: dto.city_en,
    cityAr: dto.city_ar,
    cityKu: dto.city_ku ?? null,
    email: dto.email,
    phone: dto.phone,
    googleMapsUrl: dto.google_maps_url,
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
    workingHoursEn: dto.working_hours_en,
    workingHoursAr: dto.working_hours_ar,
    workingHoursKu: dto.working_hours_ku ?? null,
    isHeadquarters: dto.is_headquarters ?? false,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}
