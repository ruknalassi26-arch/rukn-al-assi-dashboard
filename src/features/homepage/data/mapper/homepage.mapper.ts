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
  const transList = dto.homepage_hero_slide_translations || [];
  const en = transList.find((t) => t.language_code === "en") || ({} as any);
  const ar = transList.find((t) => t.language_code === "ar") || ({} as any);
  const ku = transList.find((t) => t.language_code === "ku") || ({} as any);

  return new HeroSlideEntity({
    id: dto.id,
    titleEn: en.title || "Engineering & Industrial Hydraulic Solutions",
    titleAr: ar.title || "حلول الهيدروليك والهندسة الصناعية",
    titleKu: ku.title || null,
    subtitleEn: en.subtitle || "",
    subtitleAr: ar.subtitle || "",
    subtitleKu: ku.subtitle || null,
    bodyEn: en.body || null,
    bodyAr: ar.body || null,
    bodyKu: ku.body || null,
    primaryButtonTextEn: en.cta_label || "Explore Products",
    primaryButtonTextAr: ar.cta_label || "استكشف المنتجات",
    primaryButtonTextKu: ku.cta_label || null,
    primaryButtonUrl: en.cta_url || ar.cta_url || ku.cta_url || "/products",
    secondaryButtonTextEn: "Contact Us",
    secondaryButtonTextAr: "اتصل بنا",
    secondaryButtonUrl: "/contact",
    backgroundImage: en.image_url || ar.image_url || ku.image_url || "/hero-banner.jpg",
    overlayOpacity: dto.overlay_opacity ?? 40,
    status: dto.is_active ? "active" : "draft",
    sortOrder: dto.sort_order ?? 0,
    createdAt: new Date(dto.created_at || Date.now()),
    updatedAt: new Date(dto.updated_at || Date.now()),
  });
}

export function toAboutPreviewEntity(dto: AboutPreviewDTO): AboutPreviewEntity {
  const transList = dto.homepage_section_translations || [];
  const en = transList.find((t) => t.language_code === "en") || ({} as any);
  const ar = transList.find((t) => t.language_code === "ar") || ({} as any);
  const ku = transList.find((t) => t.language_code === "ku") || ({} as any);
  const settings = (dto.settings as Record<string, any>) || {};
  const highlights = settings.highlights || {};

  return new AboutPreviewEntity({
    id: dto.id,
    titleEn: en.title || "About Rukn Al Assi",
    titleAr: ar.title || "عن ركن العاصي",
    titleKu: ku.title || null,
    subtitleEn: en.subtitle || null,
    subtitleAr: ar.subtitle || null,
    subtitleKu: ku.subtitle || null,
    descriptionEn: en.body || null,
    descriptionAr: ar.body || null,
    descriptionKu: ku.body || null,
    imageUrl: en.image_url || ar.image_url || ku.image_url || null,
    buttonTextEn: en.cta_label || null,
    buttonTextAr: ar.cta_label || null,
    buttonTextKu: ku.cta_label || null,
    buttonUrl: en.cta_url || ar.cta_url || ku.cta_url || null,
    highlightsEn: highlights.en || ["14+ Years Experience", "250+ Completed Projects", "99% Satisfaction"],
    highlightsAr: highlights.ar || ["خبرة أكثر من 14 عاماً", "أكثر من 250 مشروع منجز", "نسبة رضا 99%"],
    highlightsKu: highlights.ku || [],
    status: dto.is_visible ? "active" : "draft",
    updatedAt: new Date(dto.updated_at || Date.now()),
  });
}

export function toCompanyStatEntity(dto: CompanyStatDTO): CompanyStatEntity {
  const transList = dto.stat_translations || [];
  const en = transList.find((t) => t.language_code === "en");
  const ar = transList.find((t) => t.language_code === "ar");
  const ku = transList.find((t) => t.language_code === "ku");

  return new CompanyStatEntity({
    id: dto.id,
    titleEn: en?.label || "",
    titleAr: ar?.label || "",
    titleKu: ku?.label || null,
    value: dto.number_value || "",
    icon: dto.icon,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status === "published" ? "active" : "draft",
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
