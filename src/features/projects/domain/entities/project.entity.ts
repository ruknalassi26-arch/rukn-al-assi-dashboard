// ==============================================================================
// features/projects/domain/entities/project.entity.ts
// Project Domain Entity Class
// ==============================================================================
import { getStoragePublicUrl } from "@core/utils/storage";

export type ProjectStatus = "active" | "draft" | "completed" | "ongoing" | "upcoming";

export interface ProjectProps {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  titleKu?: string | null;
  shortDescriptionEn?: string | null;
  shortDescriptionAr?: string | null;
  shortDescriptionKu?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  descriptionKu?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  client?: string | null;
  location?: string | null;
  year?: number | null;
  completionDate?: string | null;
  coverImage?: string | null;
  images?: string[];
  status: ProjectStatus;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectEntity {
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
  public readonly categoryId: string | null;
  public readonly categoryName: string | null;
  public readonly client: string | null;
  public readonly location: string | null;
  public readonly year: number | null;
  public readonly completionDate: string | null;
  public readonly coverImage: string | null;
  public readonly images: string[];
  public readonly status: ProjectStatus;
  public readonly isFeatured: boolean;
  public readonly sortOrder: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.slug = props.slug;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.titleKu = props.titleKu ?? null;
    this.shortDescriptionEn = props.shortDescriptionEn ?? null;
    this.shortDescriptionAr = props.shortDescriptionAr ?? null;
    this.shortDescriptionKu = props.shortDescriptionKu ?? null;
    this.descriptionEn = props.descriptionEn ?? null;
    this.descriptionAr = props.descriptionAr ?? null;
    this.descriptionKu = props.descriptionKu ?? null;
    this.categoryId = props.categoryId ?? null;
    this.categoryName = props.categoryName ?? null;
    this.client = props.client ?? null;
    this.location = props.location ?? null;
    this.year = props.year ?? null;
    this.completionDate = props.completionDate ?? null;
    this.coverImage = props.coverImage ?? null;
    this.images = props.images ?? [];
    this.status = props.status;
    this.isFeatured = props.isFeatured;
    this.sortOrder = props.sortOrder;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public getLocalizedTitle(locale: string): string {
    if (locale === "ar" && this.titleAr) return this.titleAr;
    if ((locale === "ckb" || locale === "ku") && this.titleKu) return this.titleKu;
    return this.titleEn || this.titleAr;
  }

  public getLocalizedShortDescription(locale: string): string {
    if (locale === "ar" && this.shortDescriptionAr) return this.shortDescriptionAr;
    if ((locale === "ckb" || locale === "ku") && this.shortDescriptionKu) return this.shortDescriptionKu;
    return this.shortDescriptionEn || this.shortDescriptionAr || "";
  }

  public getLocalizedDescription(locale: string): string {
    if (locale === "ar" && this.descriptionAr) return this.descriptionAr;
    if ((locale === "ckb" || locale === "ku") && this.descriptionKu) return this.descriptionKu;
    return this.descriptionEn || this.descriptionAr || "";
  }

  public get coverImageUrl(): string | null {
    if (!this.coverImage) return this.images[0] ? getStoragePublicUrl("project-images", this.images[0]) : null;
    if (this.coverImage.startsWith("http://") || this.coverImage.startsWith("https://")) {
      return this.coverImage;
    }
    return getStoragePublicUrl("project-images", this.coverImage);
  }

  public get galleryImageUrls(): string[] {
    return this.images.map((img) => {
      if (img.startsWith("http://") || img.startsWith("https://")) return img;
      return getStoragePublicUrl("project-images", img);
    });
  }

  public get statusBadgeVariant(): "default" | "secondary" | "destructive" | "outline" {
    switch (this.status) {
      case "active":
      case "completed":
        return "default";
      case "ongoing":
        return "secondary";
      case "upcoming":
      case "draft":
      default:
        return "outline";
    }
  }

  public get statusLabel(): string {
    switch (this.status) {
      case "completed":
        return "Completed";
      case "ongoing":
        return "Ongoing";
      case "upcoming":
        return "Upcoming";
      case "active":
        return "Active";
      case "draft":
      default:
        return "Draft";
    }
  }
}
