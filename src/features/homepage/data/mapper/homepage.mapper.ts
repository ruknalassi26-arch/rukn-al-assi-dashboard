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

export function toFeaturedServiceEntity(dto: FeaturedServiceDTO & { service_translations?: any[] }): FeaturedServiceEntity {
  const transList = (dto as any).service_translations || [];
  const en = transList.find((t: any) => t.language_code === "en") || ({} as any);
  const ar = transList.find((t: any) => t.language_code === "ar") || ({} as any);

  return new FeaturedServiceEntity({
    id: dto.id,
    titleEn: en.name || en.title || (dto as any).name_en || (dto as any).title_en || "",
    titleAr: ar.name || ar.title || (dto as any).name_ar || (dto as any).title_ar || "",
    image: (dto as any).hero_image_url || (dto as any).image_url || (dto as any).image || null,
    isFeatured: (dto as any).is_featured ?? false,
    sortOrder: (dto as any).sort_order ?? 0,
  });
}

export function toFeaturedProductEntity(dto: any): FeaturedProductEntity {
  const transList = dto.product_translations || [];
  const en = transList.find((t: any) => t.language_code === "en") || ({} as any);
  const ar = transList.find((t: any) => t.language_code === "ar") || ({} as any);

  const titleEn = en.name || en.title || dto.name_en || dto.title_en || "";
  const titleAr = ar.name || ar.title || dto.name_ar || dto.title_ar || "";
  const image = dto.thumbnail || (dto.images && dto.images.length > 0 ? dto.images[0] : null) || dto.image_url || null;

  return new FeaturedProductEntity({
    id: dto.id,
    titleEn,
    titleAr,
    image,
    isFeatured: dto.is_featured ?? false,
    sortOrder: dto.sort_order ?? 0,
  });
}

export function toFeaturedProjectEntity(dto: any): FeaturedProjectEntity {
  const transList = dto.project_translations || [];
  const en = transList.find((t: any) => t.language_code === "en") || ({} as any);
  const ar = transList.find((t: any) => t.language_code === "ar") || ({} as any);

  const images = dto.project_images || [];
  const mainImg = images.length > 0 ? (images[0].image_url || images[0].url) : null;
  const image = mainImg || dto.thumbnail || (dto.images && dto.images.length > 0 ? dto.images[0] : null) || dto.image_url || null;

  return new FeaturedProjectEntity({
    id: dto.id,
    titleEn: en.title || en.name || dto.title_en || dto.name_en || "",
    titleAr: ar.title || ar.name || dto.title_ar || dto.name_ar || "",
    image,
    isFeatured: dto.is_featured ?? false,
    sortOrder: dto.sort_order ?? 0,
  });
}

export function toClientEntity(dto: any): ClientEntity {
  const transList = dto.client_translations || dto.translations || [];
  const en = transList.find((t: any) => t.language_code === "en") || {};
  const ar = transList.find((t: any) => t.language_code === "ar") || {};

  const nameVal = dto.name || dto.company_name || dto.title || dto.name_en || dto.name_ar || "";

  return new ClientEntity({
    id: dto.id,
    nameEn: en.name || en.title || dto.name_en || dto.name || nameVal,
    nameAr: ar.name || ar.title || dto.name_ar || dto.name || nameVal,
    logoUrl: dto.logo_url || dto.logo || dto.image_url || null,
    websiteUrl: dto.website_url || dto.website || dto.url || null,
    sortOrder: dto.sort_order ?? 0,
    status: (dto.status === "published" || dto.status === "active") ? "active" : "draft",
    createdAt: new Date(dto.created_at || Date.now()),
    updatedAt: new Date(dto.updated_at || Date.now()),
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
  const transList = dto.homepage_section_translations || [];
  const en = transList.find((t) => t.language_code === "en") || ({} as any);
  const ar = transList.find((t) => t.language_code === "ar") || ({} as any);
  const ku = transList.find((t) => t.language_code === "ku") || ({} as any);

  return new ContactCtaEntity({
    id: dto.id,
    headingEn: en.title || "Ready to Upgrade Your Industrial Hydraulics?",
    headingAr: ar.title || "هل أنت جاهز لتطوير أنظمتك الهيدروليكية الصناعية؟",
    headingKu: ku.title || null,
    descriptionEn: en.body || null,
    descriptionAr: ar.body || null,
    descriptionKu: ku.body || null,
    buttonTextEn: en.cta_label || null,
    buttonTextAr: ar.cta_label || null,
    buttonTextKu: ku.cta_label || null,
    buttonUrl: en.cta_url || ar.cta_url || ku.cta_url || null,
    backgroundImage: en.image_url || ar.image_url || ku.image_url || null,
    status: dto.is_visible ? "active" : "draft",
    updatedAt: new Date(dto.updated_at || Date.now()),
  });
}
