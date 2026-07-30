// ==============================================================================
// features/services/domain/entities/service.entity.ts
// Service Domain Entity Class following Clean Architecture
// ==============================================================================

export type ServiceStatus = "active" | "draft";

export interface ServiceProps {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  titleKu?: string | null;
  shortDescriptionEn?: string | null;
  shortDescriptionAr?: string | null;
  shortDescriptionKu?: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  descriptionKu?: string | null;
  icon?: string | null;
  image?: string | null;
  seoTitleEn?: string | null;
  seoTitleAr?: string | null;
  seoTitleKu?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionAr?: string | null;
  seoDescriptionKu?: string | null;
  seoImage?: string | null;
  isFeatured: boolean;
  sortOrder: number;
  status: ServiceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ServiceEntity {
  public readonly id: string;
  public readonly slug: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly titleKu: string | null;
  public readonly shortDescriptionEn: string | null;
  public readonly shortDescriptionAr: string | null;
  public readonly shortDescriptionKu: string | null;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly descriptionKu: string | null;
  public readonly icon: string | null;
  public readonly image: string | null;
  public readonly seoTitleEn: string | null;
  public readonly seoTitleAr: string | null;
  public readonly seoTitleKu: string | null;
  public readonly seoDescriptionEn: string | null;
  public readonly seoDescriptionAr: string | null;
  public readonly seoDescriptionKu: string | null;
  public readonly seoImage: string | null;
  public readonly isFeatured: boolean;
  public readonly sortOrder: number;
  public readonly status: ServiceStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ServiceProps) {
    this.id = props.id;
    this.slug = props.slug;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.titleKu = props.titleKu ?? null;
    this.shortDescriptionEn = props.shortDescriptionEn ?? null;
    this.shortDescriptionAr = props.shortDescriptionAr ?? null;
    this.shortDescriptionKu = props.shortDescriptionKu ?? null;
    this.descriptionEn = props.descriptionEn;
    this.descriptionAr = props.descriptionAr;
    this.descriptionKu = props.descriptionKu ?? null;
    this.icon = props.icon ?? null;
    this.image = props.image ?? null;
    this.seoTitleEn = props.seoTitleEn ?? null;
    this.seoTitleAr = props.seoTitleAr ?? null;
    this.seoTitleKu = props.seoTitleKu ?? null;
    this.seoDescriptionEn = props.seoDescriptionEn ?? null;
    this.seoDescriptionAr = props.seoDescriptionAr ?? null;
    this.seoDescriptionKu = props.seoDescriptionKu ?? null;
    this.seoImage = props.seoImage ?? null;
    this.isFeatured = props.isFeatured;
    this.sortOrder = props.sortOrder;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public get isActive(): boolean {
    return this.status === "active";
  }
}
