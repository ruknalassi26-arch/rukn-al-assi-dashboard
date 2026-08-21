// ==============================================================================
// features/homepage/domain/entities/homepage.entity.ts
// Domain Entity Classes for Homepage Management
// ==============================================================================

export type HeroMediaType = "video" | "image";
export type SlideStatus = "active" | "draft";

export interface HeroSectionProps {
  id: string;
  sectionKey?: string;
  isVisible: boolean;
  mediaType: HeroMediaType;
  videoUrl: string | null;
  videoPosterUrl: string | null;
  videoMobileUrl: string | null;
  overlayOpacity: number;
  titleEn: string;
  titleAr: string;
  titleKu?: string | null;
  subtitleEn?: string | null;
  subtitleAr?: string | null;
  subtitleKu?: string | null;
  bodyEn?: string | null;
  bodyAr?: string | null;
  bodyKu?: string | null;
  primaryButtonTextEn: string | null;
  primaryButtonTextAr: string | null;
  primaryButtonTextKu?: string | null;
  primaryButtonUrl: string | null;
  secondaryButtonTextEn?: string | null;
  secondaryButtonTextAr?: string | null;
  secondaryButtonTextKu?: string | null;
  secondaryButtonUrl?: string | null;
  updatedBy?: string | null;
  updatedAt?: Date;
}

export class HeroSectionEntity {
  public readonly id: string;
  public readonly sectionKey: string;
  public readonly isVisible: boolean;
  public readonly mediaType: HeroMediaType;
  public readonly videoUrl: string | null;
  public readonly videoPosterUrl: string | null;
  public readonly videoMobileUrl: string | null;
  public readonly overlayOpacity: number;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly titleKu: string | null;
  public readonly subtitleEn: string | null;
  public readonly subtitleAr: string | null;
  public readonly subtitleKu: string | null;
  public readonly bodyEn: string | null;
  public readonly bodyAr: string | null;
  public readonly bodyKu: string | null;
  public readonly primaryButtonTextEn: string | null;
  public readonly primaryButtonTextAr: string | null;
  public readonly primaryButtonTextKu: string | null;
  public readonly primaryButtonUrl: string | null;
  public readonly secondaryButtonTextEn: string | null;
  public readonly secondaryButtonTextAr: string | null;
  public readonly secondaryButtonTextKu: string | null;
  public readonly secondaryButtonUrl: string | null;
  public readonly updatedBy: string | null;
  public readonly updatedAt: Date;

  constructor(props: HeroSectionProps) {
    this.id = props.id;
    this.sectionKey = props.sectionKey ?? "hero";
    this.isVisible = props.isVisible ?? true;
    this.mediaType = props.mediaType ?? "video";
    this.videoUrl = props.videoUrl ?? null;
    this.videoPosterUrl = props.videoPosterUrl ?? null;
    this.videoMobileUrl = props.videoMobileUrl ?? null;
    this.overlayOpacity = props.overlayOpacity ?? 40;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.titleKu = props.titleKu ?? null;
    this.subtitleEn = props.subtitleEn ?? null;
    this.subtitleAr = props.subtitleAr ?? null;
    this.subtitleKu = props.subtitleKu ?? null;
    this.bodyEn = props.bodyEn ?? null;
    this.bodyAr = props.bodyAr ?? null;
    this.bodyKu = props.bodyKu ?? null;
    this.primaryButtonTextEn = props.primaryButtonTextEn ?? null;
    this.primaryButtonTextAr = props.primaryButtonTextAr ?? null;
    this.primaryButtonTextKu = props.primaryButtonTextKu ?? null;
    this.primaryButtonUrl = props.primaryButtonUrl ?? null;
    this.secondaryButtonTextEn = props.secondaryButtonTextEn ?? null;
    this.secondaryButtonTextAr = props.secondaryButtonTextAr ?? null;
    this.secondaryButtonTextKu = props.secondaryButtonTextKu ?? null;
    this.secondaryButtonUrl = props.secondaryButtonUrl ?? null;
    this.updatedBy = props.updatedBy ?? null;
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public get isActive(): boolean {
    return this.isVisible;
  }
}

export interface AboutPreviewProps {
  id: string;
  titleEn: string;
  titleAr: string;
  titleKu?: string | null;
  subtitleEn?: string | null;
  subtitleAr?: string | null;
  subtitleKu?: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  descriptionKu?: string | null;
  imageUrl: string | null;
  buttonTextEn: string | null;
  buttonTextAr: string | null;
  buttonTextKu?: string | null;
  buttonUrl: string | null;
  highlightsEn: string[];
  highlightsAr: string[];
  highlightsKu?: string[];
  status: SlideStatus;
  updatedAt: Date;
}

export class AboutPreviewEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly titleKu: string | null;
  public readonly subtitleEn: string | null;
  public readonly subtitleAr: string | null;
  public readonly subtitleKu: string | null;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly descriptionKu: string | null;
  public readonly imageUrl: string | null;
  public readonly buttonTextEn: string | null;
  public readonly buttonTextAr: string | null;
  public readonly buttonTextKu: string | null;
  public readonly buttonUrl: string | null;
  public readonly highlightsEn: string[];
  public readonly highlightsAr: string[];
  public readonly highlightsKu: string[];
  public readonly status: SlideStatus;
  public readonly updatedAt: Date;

  constructor(props: AboutPreviewProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.titleKu = props.titleKu ?? null;
    this.subtitleEn = props.subtitleEn ?? null;
    this.subtitleAr = props.subtitleAr ?? null;
    this.subtitleKu = props.subtitleKu ?? null;
    this.descriptionEn = props.descriptionEn;
    this.descriptionAr = props.descriptionAr;
    this.descriptionKu = props.descriptionKu ?? null;
    this.imageUrl = props.imageUrl;
    this.buttonTextEn = props.buttonTextEn;
    this.buttonTextAr = props.buttonTextAr;
    this.buttonTextKu = props.buttonTextKu ?? null;
    this.buttonUrl = props.buttonUrl;
    this.highlightsEn = props.highlightsEn;
    this.highlightsAr = props.highlightsAr;
    this.highlightsKu = props.highlightsKu ?? [];
    this.status = props.status;
    this.updatedAt = props.updatedAt;
  }
}

export interface CompanyStatProps {
  id: string;
  titleEn: string;
  titleAr: string;
  titleKu?: string | null;
  value: string;
  icon: string | null;
  sortOrder: number;
  status: SlideStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class CompanyStatEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly titleKu?: string | null;
  public readonly value: string;
  public readonly icon: string | null;
  public readonly sortOrder: number;
  public readonly status: SlideStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: CompanyStatProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.titleKu = props.titleKu ?? null;
    this.value = props.value;
    this.icon = props.icon;
    this.sortOrder = props.sortOrder;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface FeaturedItemProps {
  id: string;
  titleEn: string;
  titleAr: string;
  image: string | null;
  isFeatured: boolean;
  sortOrder: number;
}

export class FeaturedServiceEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly image: string | null;
  public readonly isFeatured: boolean;
  public readonly sortOrder: number;

  constructor(props: FeaturedItemProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.image = props.image;
    this.isFeatured = props.isFeatured;
    this.sortOrder = props.sortOrder;
  }
}

export class FeaturedProductEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly image: string | null;
  public readonly isFeatured: boolean;
  public readonly sortOrder: number;

  constructor(props: FeaturedItemProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.image = props.image;
    this.isFeatured = props.isFeatured;
    this.sortOrder = props.sortOrder;
  }
}

export class FeaturedProjectEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly image: string | null;
  public readonly isFeatured: boolean;
  public readonly sortOrder: number;

  constructor(props: FeaturedItemProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.image = props.image;
    this.isFeatured = props.isFeatured;
    this.sortOrder = props.sortOrder;
  }
}

export interface ClientProps {
  id: string;
  nameEn: string;
  nameAr: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  status: SlideStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ClientEntity {
  public readonly id: string;
  public readonly nameEn: string;
  public readonly nameAr: string;
  public readonly logoUrl: string | null;
  public readonly websiteUrl: string | null;
  public readonly sortOrder: number;
  public readonly status: SlideStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ClientProps) {
    this.id = props.id;
    this.nameEn = props.nameEn;
    this.nameAr = props.nameAr;
    this.logoUrl = props.logoUrl;
    this.websiteUrl = props.websiteUrl;
    this.sortOrder = props.sortOrder;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface CertificateProps {
  id: string;
  titleEn: string;
  titleAr: string;
  image: string | null;
  issueDate: string | null;
  sortOrder: number;
  isFeatured?: boolean;
  featuredOrder?: number | null;
  status: SlideStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class CertificateEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly image: string | null;
  public readonly issueDate: string | null;
  public readonly sortOrder: number;
  public readonly isFeatured: boolean;
  public readonly featuredOrder: number | null;
  public readonly status: SlideStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: CertificateProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.image = props.image;
    this.issueDate = props.issueDate;
    this.sortOrder = props.sortOrder;
    this.isFeatured = props.isFeatured ?? false;
    this.featuredOrder = props.featuredOrder ?? null;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface ContactCtaProps {
  id: string;
  headingEn: string;
  headingAr: string;
  headingKu?: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  descriptionKu?: string | null;
  buttonTextEn: string | null;
  buttonTextAr: string | null;
  buttonTextKu?: string | null;
  buttonUrl: string | null;
  backgroundImage: string | null;
  status?: SlideStatus;
  updatedAt: Date;
}

export class ContactCtaEntity {
  public readonly id: string;
  public readonly headingEn: string;
  public readonly headingAr: string;
  public readonly headingKu?: string | null;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly descriptionKu?: string | null;
  public readonly buttonTextEn: string | null;
  public readonly buttonTextAr: string | null;
  public readonly buttonTextKu?: string | null;
  public readonly buttonUrl: string | null;
  public readonly backgroundImage: string | null;
  public readonly status?: SlideStatus;
  public readonly updatedAt: Date;

  constructor(props: ContactCtaProps) {
    this.id = props.id;
    this.headingEn = props.headingEn;
    this.headingAr = props.headingAr;
    this.headingKu = props.headingKu ?? null;
    this.descriptionEn = props.descriptionEn;
    this.descriptionAr = props.descriptionAr;
    this.descriptionKu = props.descriptionKu ?? null;
    this.buttonTextEn = props.buttonTextEn;
    this.buttonTextAr = props.buttonTextAr;
    this.buttonTextKu = props.buttonTextKu ?? null;
    this.buttonUrl = props.buttonUrl;
    this.backgroundImage = props.backgroundImage;
    this.status = props.status ?? "active";
    this.updatedAt = props.updatedAt;
  }
}
