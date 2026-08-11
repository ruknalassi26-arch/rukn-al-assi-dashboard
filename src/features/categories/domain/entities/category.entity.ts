// ==============================================================================
// features/categories/domain/entities/category.entity.ts
// Category Domain Entity Class strictly matching DB schema (product_categories & product_category_translations)
// ==============================================================================

export type CategoryStatus = "published" | "draft" | "archived";

export interface CategoryTranslationProps {
  slug: string;
  name: string;
  description?: string | null;
}

export interface CategoryProps {
  id: string;
  imageUrl?: string | null;
  sortOrder: number;
  status: CategoryStatus;
  createdAt?: Date;
  updatedAt?: Date;
  translations: Record<string, CategoryTranslationProps>;
}

export class CategoryEntity {
  public readonly id: string;
  public readonly imageUrl: string | null;
  public readonly sortOrder: number;
  public readonly status: CategoryStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly translations: Record<string, CategoryTranslationProps>;

  constructor(props: CategoryProps) {
    this.id = props.id;
    this.imageUrl = props.imageUrl ?? null;
    this.sortOrder = props.sortOrder ?? 0;
    this.status = props.status ?? "published";
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.translations = props.translations ?? {};
  }

  public getTranslation(lang: string): CategoryTranslationProps | null {
    const altLang = lang === "ckb" ? "ku" : lang === "ku" ? "ckb" : lang;
    return this.translations[lang] ?? this.translations[altLang] ?? null;
  }

  // Getters for backwards compatibility across existing UI components
  public get nameEn(): string {
    return this.getTranslation("en")?.name ?? "";
  }

  public get nameAr(): string {
    return this.getTranslation("ar")?.name ?? "";
  }

  public get nameKu(): string | null {
    return this.getTranslation("ku")?.name ?? null;
  }

  public get slug(): string {
    return this.getTranslation("en")?.slug ?? this.getTranslation("ar")?.slug ?? "";
  }

  public get descriptionEn(): string | null {
    return this.getTranslation("en")?.description ?? null;
  }

  public get descriptionAr(): string | null {
    return this.getTranslation("ar")?.description ?? null;
  }

  public get descriptionKu(): string | null {
    return this.getTranslation("ku")?.description ?? null;
  }

  // Legacy compatibility getters
  public get icon(): string | null {
    return null;
  }

  public get image(): string | null {
    return this.imageUrl;
  }

  public get isActive(): boolean {
    return this.status === "published";
  }
}
