// ==============================================================================
// features/categories/domain/entities/category.entity.ts
// Category Domain Entity Class following Clean Architecture
// ==============================================================================

export type CategoryStatus = "active" | "draft";

export interface CategoryProps {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  nameKu?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  descriptionKu?: string | null;
  icon?: string | null;
  image?: string | null;
  seoTitleEn?: string | null;
  seoTitleAr?: string | null;
  seoTitleKu?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionAr?: string | null;
  seoDescriptionKu?: string | null;
  sortOrder: number;
  status: CategoryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class CategoryEntity {
  public readonly id: string;
  public readonly slug: string;
  public readonly nameEn: string;
  public readonly nameAr: string;
  public readonly nameKu: string | null;
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
  public readonly sortOrder: number;
  public readonly status: CategoryStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: CategoryProps) {
    this.id = props.id;
    this.slug = props.slug;
    this.nameEn = props.nameEn;
    this.nameAr = props.nameAr;
    this.nameKu = props.nameKu ?? null;
    this.descriptionEn = props.descriptionEn ?? null;
    this.descriptionAr = props.descriptionAr ?? null;
    this.descriptionKu = props.descriptionKu ?? null;
    this.icon = props.icon ?? null;
    this.image = props.image ?? null;
    this.seoTitleEn = props.seoTitleEn ?? null;
    this.seoTitleAr = props.seoTitleAr ?? null;
    this.seoTitleKu = props.seoTitleKu ?? null;
    this.seoDescriptionEn = props.seoDescriptionEn ?? null;
    this.seoDescriptionAr = props.seoDescriptionAr ?? null;
    this.seoDescriptionKu = props.seoDescriptionKu ?? null;
    this.sortOrder = props.sortOrder;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public get isActive(): boolean {
    return this.status === "active";
  }
}
