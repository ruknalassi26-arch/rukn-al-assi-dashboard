// ==============================================================================
// features/contact/data/mapper/contact.mapper.ts
// Maps between Supabase DTOs and Contact/Branch Domain Entity Classes
// ==============================================================================
import { ContactInfoEntity } from "../../domain/entities/contact-info.entity";
import { BranchEntity } from "../../domain/entities/branch.entity";
import type { BranchTranslationProps } from "../../domain/entities/branch.entity";
import type { ContactInfoDTO, BranchWithTranslationsDTO } from "../dto/contact.dto";

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
    updatedAt: new Date(dto.updated_at),
  });
}

export function toBranchEntity(dto: BranchWithTranslationsDTO): BranchEntity {
  const translations: Record<string, BranchTranslationProps> = {};
  let nameEn = "";
  let nameAr = "";
  let nameKu: string | null = null;
  let addressEn: string | null = null;
  let addressAr: string | null = null;
  let addressKu: string | null = null;

  if (dto.branch_translations && Array.isArray(dto.branch_translations)) {
    dto.branch_translations.forEach((t) => {
      const code = t.language_code === "ckb" ? "ku" : t.language_code;
      translations[code] = { name: t.name, address: t.address };
      if (code === "en") {
        nameEn = t.name;
        addressEn = t.address;
      } else if (code === "ar") {
        nameAr = t.name;
        addressAr = t.address;
      } else if (code === "ku") {
        nameKu = t.name;
        addressKu = t.address;
      }
    });
  }

  return new BranchEntity({
    id: dto.id,
    latitude: dto.map_lat,
    longitude: dto.map_lng,
    phone: dto.phone,
    email: dto.email,
    whatsappNumber: dto.whatsapp_number,
    sortOrder: dto.sort_order ?? 0,
    status: (dto.status as string) === "active" ? "published" : (dto.status ?? "published"),
    translations,
    nameEn,
    nameAr,
    nameKu,
    addressEn,
    addressAr,
    addressKu,
  });
}
