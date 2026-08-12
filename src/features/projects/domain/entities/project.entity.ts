// ==============================================================================
// features/projects/domain/entities/project.entity.ts
// Project Domain Entity Class strictly matching Supabase SQL Schema
// ==============================================================================

export type ProjectStatus = "draft" | "published" | "archived";

export interface ProjectImageEntity {
  id?: string;
  imageUrl: string;
  mimeType?: string | null;
  sortOrder: number;
}

export interface ProjectProps {
  id: string;
  categoryId?: string | null;
  categoryName?: string | null;
  clientName?: string | null;
  location?: string | null;
  completionDate?: string | null;
  status: ProjectStatus;
  isFeatured: boolean;
  featuredOrder: number;
  sortOrder: number;

  // Multilingual translations (project_translations)
  titleEn: string;
  titleAr?: string | null;
  titleKu?: string | null;
  slugEn?: string | null;
  slugAr?: string | null;
  slugKu?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  descriptionKu?: string | null;
  challengeEn?: string | null;
  challengeAr?: string | null;
  challengeKu?: string | null;
  solutionEn?: string | null;
  solutionAr?: string | null;
  solutionKu?: string | null;

  // Gallery Images (project_images)
  images?: ProjectImageEntity[] | string[];

  createdAt?: Date;
  updatedAt?: Date;
}

export class ProjectEntity {
  public readonly id: string;
  public readonly categoryId: string | null;
  public readonly categoryName: string | null;
  public readonly clientName: string | null;
  public readonly location: string | null;
  public readonly completionDate: string | null;
  public readonly status: ProjectStatus;
  public readonly isFeatured: boolean;
  public readonly featuredOrder: number;
  public readonly sortOrder: number;

  public readonly titleEn: string;
  public readonly titleAr: string | null;
  public readonly titleKu: string | null;
  public readonly slugEn: string | null;
  public readonly slugAr: string | null;
  public readonly slugKu: string | null;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly descriptionKu: string | null;
  public readonly challengeEn: string | null;
  public readonly challengeAr: string | null;
  public readonly challengeKu: string | null;
  public readonly solutionEn: string | null;
  public readonly solutionAr: string | null;
  public readonly solutionKu: string | null;

  public readonly images: string[];
  public readonly imageDetails: ProjectImageEntity[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.categoryId = props.categoryId ?? null;
    this.categoryName = props.categoryName ?? null;
    this.clientName = props.clientName ?? null;
    this.location = props.location ?? null;
    this.completionDate = props.completionDate ?? null;
    this.status = props.status ?? "published";
    this.isFeatured = props.isFeatured ?? false;
    this.featuredOrder = props.featuredOrder ?? 0;
    this.sortOrder = props.sortOrder ?? 0;

    this.titleEn = props.titleEn ?? "";
    this.titleAr = props.titleAr ?? null;
    this.titleKu = props.titleKu ?? null;
    this.slugEn = props.slugEn ?? null;
    this.slugAr = props.slugAr ?? null;
    this.slugKu = props.slugKu ?? null;
    this.descriptionEn = props.descriptionEn ?? null;
    this.descriptionAr = props.descriptionAr ?? null;
    this.descriptionKu = props.descriptionKu ?? null;
    this.challengeEn = props.challengeEn ?? null;
    this.challengeAr = props.challengeAr ?? null;
    this.challengeKu = props.challengeKu ?? null;
    this.solutionEn = props.solutionEn ?? null;
    this.solutionAr = props.solutionAr ?? null;
    this.solutionKu = props.solutionKu ?? null;

    if (Array.isArray(props.images)) {
      if (props.images.length > 0 && typeof props.images[0] === "string") {
        this.images = props.images as string[];
        this.imageDetails = (props.images as string[]).map((url, idx) => ({
          imageUrl: url,
          sortOrder: idx,
        }));
      } else {
        const details = (props.images as ProjectImageEntity[]).sort(
          (a, b) => a.sortOrder - b.sortOrder
        );
        this.imageDetails = details;
        this.images = details.map((d) => d.imageUrl);
      }
    } else {
      this.images = [];
      this.imageDetails = [];
    }

    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public get primaryImageUrl(): string | null {
    return this.images[0] ?? null;
  }

  public get coverImageUrl(): string | null {
    return this.primaryImageUrl;
  }

  public get slug(): string {
    return this.slugEn || this.slugAr || this.slugKu || this.id;
  }

  public get isActive(): boolean {
    return this.status === "published";
  }

  public get statusBadgeVariant(): "default" | "secondary" | "destructive" | "outline" {
    switch (this.status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
      default:
        return "outline";
    }
  }

  public get statusLabel(): string {
    switch (this.status) {
      case "published":
        return "Published";
      case "draft":
        return "Draft";
      case "archived":
        return "Archived";
      default:
        return "Published";
    }
  }

  public getLocalizedTitle(locale: string): string {
    if (locale === "ar" && this.titleAr) return this.titleAr;
    if ((locale === "ckb" || locale === "ku") && this.titleKu) return this.titleKu;
    return this.titleEn || this.titleAr || "";
  }

  public getLocalizedDescription(locale: string): string {
    if (locale === "ar" && this.descriptionAr) return this.descriptionAr;
    if ((locale === "ckb" || locale === "ku") && this.descriptionKu) return this.descriptionKu;
    return this.descriptionEn || this.descriptionAr || "";
  }
}
