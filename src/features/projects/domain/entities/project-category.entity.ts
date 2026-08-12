// ==============================================================================
// features/projects/domain/entities/project-category.entity.ts
// Project Category Domain Entity Class
// Strictly matching project_categories (id, status, deleted_at)
// and project_category_translations (project_category_id, language_code, slug, name)
// ==============================================================================

export type ProjectCategoryStatus = "draft" | "published" | "archived";

export interface ProjectCategoryProps {
  id: string;
  status: ProjectCategoryStatus;
  nameEn: string;
  nameAr?: string | null;
  nameKu?: string | null;
  slugEn?: string | null;
  slugAr?: string | null;
  slugKu?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProjectCategoryEntity {
  public readonly id: string;
  public readonly status: ProjectCategoryStatus;
  public readonly nameEn: string;
  public readonly nameAr: string | null;
  public readonly nameKu: string | null;
  public readonly slugEn: string | null;
  public readonly slugAr: string | null;
  public readonly slugKu: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ProjectCategoryProps) {
    this.id = props.id;
    this.status = props.status ?? "published";
    this.nameEn = props.nameEn ?? "";
    this.nameAr = props.nameAr ?? null;
    this.nameKu = props.nameKu ?? null;
    this.slugEn = props.slugEn ?? null;
    this.slugAr = props.slugAr ?? null;
    this.slugKu = props.slugKu ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public getLocalizedName(locale: string): string {
    if (locale === "ar" && this.nameAr) return this.nameAr;
    if ((locale === "ckb" || locale === "ku") && this.nameKu) return this.nameKu;
    return this.nameEn || this.nameAr || "Category";
  }
}
