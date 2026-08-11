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

  public getTranslation(lang: string): CategoryTranslationProps {
    const altLang = lang === "ckb" ? "ku" : lang === "ku" ? "ckb" : lang;
    if (this.translations[lang]) {
      return this.translations[lang];
    }
    if (this.translations[altLang]) {
      return this.translations[altLang];
    }
    return { slug: "", name: "", description: "" };
  }

  // Getters for backwards compatibility across existing UI components
  public get nameEn(): string {
    return this.getTranslation("en").name || "";
  }

  public get nameAr(): string {
    return this.getTranslation("ar").name || "";
  }

  public get nameKu(): string | null {
    const kuName = this.getTranslation("ku").name;
    return kuName && kuName.trim() !== "" ? kuName : null;
  }

  public get slug(): string {
    return (
      this.getTranslation("en").slug ||
      this.getTranslation("ar").slug ||
      this.getTranslation("ku").slug ||
      ""
    );
  }

  public get descriptionEn(): string | null {
    const desc = this.getTranslation("en").description;
    return desc && desc.trim() !== "" ? desc : null;
  }

  public get descriptionAr(): string | null {
    const desc = this.getTranslation("ar").description;
    return desc && desc.trim() !== "" ? desc : null;
  }

  public get descriptionKu(): string | null {
    const desc = this.getTranslation("ku").description;
    return desc && desc.trim() !== "" ? desc : null;
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
