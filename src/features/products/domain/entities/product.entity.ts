// ==============================================================================
// features/products/domain/entities/product.entity.ts
// Domain Entity Classes for Products Management
// ==============================================================================

export type ProductStatus = "active" | "draft" | "archived";

export interface ProductCategoryProps {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  icon: string | null;
  sortOrder: number;
  status: "active" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

export class ProductCategoryEntity {
  public readonly id: string;
  public readonly slug: string;
  public readonly nameEn: string;
  public readonly nameAr: string;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly icon: string | null;
  public readonly sortOrder: number;
  public readonly status: "active" | "draft";
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ProductCategoryProps) {
    this.id = props.id;
    this.slug = props.slug;
    this.nameEn = props.nameEn;
    this.nameAr = props.nameAr;
    this.descriptionEn = props.descriptionEn;
    this.descriptionAr = props.descriptionAr;
    this.icon = props.icon;
    this.sortOrder = props.sortOrder;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface ProductProps {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  shortDescriptionEn: string | null;
  shortDescriptionAr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  seoTitleEn: string | null;
  seoTitleAr: string | null;
  seoDescriptionEn: string | null;
  seoDescriptionAr: string | null;
  categoryId: string | null;
  category?: ProductCategoryEntity | null;
  images: string[];
  thumbnail: string | null;
  datasheetUrl: string | null;
  seoImage: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductEntity {
  public readonly id: string;
  public readonly slug: string;
  public readonly nameEn: string;
  public readonly nameAr: string;
  public readonly shortDescriptionEn: string | null;
  public readonly shortDescriptionAr: string | null;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly seoTitleEn: string | null;
  public readonly seoTitleAr: string | null;
  public readonly seoDescriptionEn: string | null;
  public readonly seoDescriptionAr: string | null;
  public readonly categoryId: string | null;
  public readonly category?: ProductCategoryEntity | null;
  public readonly images: string[];
  public readonly thumbnail: string | null;
  public readonly datasheetUrl: string | null;
  public readonly seoImage: string | null;
  public readonly status: ProductStatus;
  public readonly isFeatured: boolean;
  public readonly sortOrder: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.slug = props.slug;
    this.nameEn = props.nameEn;
    this.nameAr = props.nameAr;
    this.shortDescriptionEn = props.shortDescriptionEn;
    this.shortDescriptionAr = props.shortDescriptionAr;
    this.descriptionEn = props.descriptionEn;
    this.descriptionAr = props.descriptionAr;
    this.seoTitleEn = props.seoTitleEn;
    this.seoTitleAr = props.seoTitleAr;
    this.seoDescriptionEn = props.seoDescriptionEn;
    this.seoDescriptionAr = props.seoDescriptionAr;
    this.categoryId = props.categoryId;
    this.category = props.category;
    this.images = props.images ?? [];
    this.thumbnail = props.thumbnail ?? (props.images && props.images.length > 0 ? props.images[0] : null);
    this.datasheetUrl = props.datasheetUrl;
    this.seoImage = props.seoImage;
    this.status = props.status;
    this.isFeatured = props.isFeatured;
    this.sortOrder = props.sortOrder;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public get isActive(): boolean {
    return this.status === "active";
  }

  public get displayImage(): string | null {
    return this.thumbnail ?? (this.images.length > 0 ? this.images[0] : null);
  }
}
