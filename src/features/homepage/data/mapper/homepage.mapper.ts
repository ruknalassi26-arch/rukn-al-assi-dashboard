// ==============================================================================
// features/homepage/data/mapper/homepage.mapper.ts
// Mappers converting DTOs to Homepage Entity Classes
// ==============================================================================
import {
  HeroSlideEntity,
  AboutPreviewEntity,
  CompanyStatEntity,
  FeaturedServiceEntity,
  FeaturedProductEntity,
  FeaturedProjectEntity,
  ClientEntity,
  CertificateEntity,
  ContactCtaEntity,
} from "../../domain/entities/homepage.entity";
import type {
  HeroSlideDTO,
  AboutPreviewDTO,
  CompanyStatDTO,
  FeaturedServiceDTO,
  FeaturedProductDTO,
  FeaturedProjectDTO,
  ClientDTO,
  CertificateDTO,
  ContactCtaDTO,
} from "../dto/homepage.dto";

export function toHeroSlideEntity(dto: HeroSlideDTO): HeroSlideEntity {
  return new HeroSlideEntity({
    id: dto.id,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    subtitleEn: dto.subtitle_en,
    subtitleAr: dto.subtitle_ar,
    primaryButtonTextEn: dto.primary_button_text_en,
    primaryButtonTextAr: dto.primary_button_text_ar,
    primaryButtonUrl: dto.primary_button_url,
    secondaryButtonTextEn: dto.secondary_button_text_en,
    secondaryButtonTextAr: dto.secondary_button_text_ar,
    secondaryButtonUrl: dto.secondary_button_url,
    backgroundImage: dto.background_image,
    overlayOpacity: dto.overlay_opacity ?? 40,
    status: dto.status,
    sortOrder: dto.sort_order ?? 0,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}

export function toAboutPreviewEntity(dto: AboutPreviewDTO): AboutPreviewEntity {
  return new AboutPreviewEntity({
    id: dto.id,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    descriptionEn: dto.description_en,
    descriptionAr: dto.description_ar,
    imageUrl: dto.image_url,
    buttonTextEn: dto.button_text_en,
    buttonTextAr: dto.button_text_ar,
    buttonUrl: dto.button_url,
    highlightsEn: dto.highlights_en ?? [],
    highlightsAr: dto.highlights_ar ?? [],
    status: dto.status,
    updatedAt: new Date(dto.updated_at),
  });
}

export function toCompanyStatEntity(dto: CompanyStatDTO): CompanyStatEntity {
  return new CompanyStatEntity({
    id: dto.id,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    value: dto.value,
    icon: dto.icon,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}

export function toFeaturedServiceEntity(dto: FeaturedServiceDTO): FeaturedServiceEntity {
  return new FeaturedServiceEntity({
    id: dto.id,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    image: dto.image,
    isFeatured: dto.is_featured ?? false,
    sortOrder: dto.sort_order ?? 0,
  });
}

export function toFeaturedProductEntity(dto: FeaturedProductDTO): FeaturedProductEntity {
  return new FeaturedProductEntity({
    id: dto.id,
    titleEn: dto.name_en,
    titleAr: dto.name_ar,
    image: dto.images && dto.images.length > 0 ? dto.images[0] : null,
    isFeatured: dto.is_featured ?? false,
    sortOrder: dto.sort_order ?? 0,
  });
}

export function toFeaturedProjectEntity(dto: FeaturedProjectDTO): FeaturedProjectEntity {
  return new FeaturedProjectEntity({
    id: dto.id,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    image: dto.images && dto.images.length > 0 ? dto.images[0] : null,
    isFeatured: dto.is_featured ?? false,
    sortOrder: dto.sort_order ?? 0,
  });
}

export function toClientEntity(dto: ClientDTO): ClientEntity {
  return new ClientEntity({
    id: dto.id,
    nameEn: dto.name_en,
    nameAr: dto.name_ar,
    logoUrl: dto.logo_url,
    websiteUrl: dto.website_url,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}

export function toCertificateEntity(dto: CertificateDTO): CertificateEntity {
  return new CertificateEntity({
    id: dto.id,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    image: dto.image,
    issueDate: dto.issue_date,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}

export function toContactCtaEntity(dto: ContactCtaDTO): ContactCtaEntity {
  return new ContactCtaEntity({
    id: dto.id,
    headingEn: dto.heading_en,
    headingAr: dto.heading_ar,
    descriptionEn: dto.description_en,
    descriptionAr: dto.description_ar,
    buttonTextEn: dto.button_text_en,
    buttonTextAr: dto.button_text_ar,
    buttonUrl: dto.button_url,
    backgroundImage: dto.background_image,
    updatedAt: new Date(dto.updated_at),
  });
}
