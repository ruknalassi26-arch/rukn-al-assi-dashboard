// ==============================================================================
// features/homepage/domain/entities/homepage.entity.ts
// Domain Entity Classes for Homepage Management
// ==============================================================================

export type SlideStatus = "active" | "draft";

export interface HeroSlideProps {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string | null;
  subtitleAr: string | null;
  primaryButtonTextEn: string | null;
  primaryButtonTextAr: string | null;
  primaryButtonUrl: string | null;
  secondaryButtonTextEn: string | null;
  secondaryButtonTextAr: string | null;
  secondaryButtonUrl: string | null;
  backgroundImage: string | null;
  overlayOpacity: number;
  status: SlideStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class HeroSlideEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly subtitleEn: string | null;
  public readonly subtitleAr: string | null;
  public readonly primaryButtonTextEn: string | null;
  public readonly primaryButtonTextAr: string | null;
  public readonly primaryButtonUrl: string | null;
  public readonly secondaryButtonTextEn: string | null;
  public readonly secondaryButtonTextAr: string | null;
  public readonly secondaryButtonUrl: string | null;
  public readonly backgroundImage: string | null;
  public readonly overlayOpacity: number;
  public readonly status: SlideStatus;
  public readonly sortOrder: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: HeroSlideProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.subtitleEn = props.subtitleEn;
    this.subtitleAr = props.subtitleAr;
    this.primaryButtonTextEn = props.primaryButtonTextEn;
    this.primaryButtonTextAr = props.primaryButtonTextAr;
    this.primaryButtonUrl = props.primaryButtonUrl;
    this.secondaryButtonTextEn = props.secondaryButtonTextEn;
    this.secondaryButtonTextAr = props.secondaryButtonTextAr;
    this.secondaryButtonUrl = props.secondaryButtonUrl;
    this.backgroundImage = props.backgroundImage;
    this.overlayOpacity = props.overlayOpacity;
    this.status = props.status;
    this.sortOrder = props.sortOrder;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public get isActive(): boolean {
    return this.status === "active";
  }
}

export interface AboutPreviewProps {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  imageUrl: string | null;
  buttonTextEn: string | null;
  buttonTextAr: string | null;
  buttonUrl: string | null;
  highlightsEn: string[];
  highlightsAr: string[];
  status: SlideStatus;
  updatedAt: Date;
}

export class AboutPreviewEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly imageUrl: string | null;
  public readonly buttonTextEn: string | null;
  public readonly buttonTextAr: string | null;
  public readonly buttonUrl: string | null;
  public readonly highlightsEn: string[];
  public readonly highlightsAr: string[];
  public readonly status: SlideStatus;
  public readonly updatedAt: Date;

  constructor(props: AboutPreviewProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.descriptionEn = props.descriptionEn;
    this.descriptionAr = props.descriptionAr;
    this.imageUrl = props.imageUrl;
    this.buttonTextEn = props.buttonTextEn;
    this.buttonTextAr = props.buttonTextAr;
    this.buttonUrl = props.buttonUrl;
    this.highlightsEn = props.highlightsEn;
    this.highlightsAr = props.highlightsAr;
    this.status = props.status;
    this.updatedAt = props.updatedAt;
  }
}

export interface CompanyStatProps {
  id: string;
  titleEn: string;
  titleAr: string;
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
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface ContactCtaProps {
  id: string;
  headingEn: string;
  headingAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  buttonTextEn: string | null;
  buttonTextAr: string | null;
  buttonUrl: string | null;
  backgroundImage: string | null;
  updatedAt: Date;
}

export class ContactCtaEntity {
  public readonly id: string;
  public readonly headingEn: string;
  public readonly headingAr: string;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly buttonTextEn: string | null;
  public readonly buttonTextAr: string | null;
  public readonly buttonUrl: string | null;
  public readonly backgroundImage: string | null;
  public readonly updatedAt: Date;

  constructor(props: ContactCtaProps) {
    this.id = props.id;
    this.headingEn = props.headingEn;
    this.headingAr = props.headingAr;
    this.descriptionEn = props.descriptionEn;
    this.descriptionAr = props.descriptionAr;
    this.buttonTextEn = props.buttonTextEn;
    this.buttonTextAr = props.buttonTextAr;
    this.buttonUrl = props.buttonUrl;
    this.backgroundImage = props.backgroundImage;
    this.updatedAt = props.updatedAt;
  }
}
