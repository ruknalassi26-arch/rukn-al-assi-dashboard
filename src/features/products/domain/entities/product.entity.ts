// ==============================================================================
// features/products/domain/entities/product.entity.ts
// Domain Entity Classes for Products Management strictly matching Supabase schema
// ==============================================================================
import { CategoryEntity } from "@features/categories/domain/entities/category.entity";

export type ProductStatus = "published" | "draft" | "archived";

export interface ProductTranslationProps {
  slug: string;
  name: string;
  shortDescription?: string | null;
  specifications?: Record<string, any> | null;
}

export interface ProductImageProps {
  id?: string;
  imageUrl: string;
  mimeType?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductProps {
  id: string;
  sku?: string | null;
  categoryId?: string | null;
  category?: CategoryEntity | null;
  datasheetUrl?: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  featuredOrder?: number | null;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
  images?: ProductImageProps[];
  translations: Record<string, ProductTranslationProps>;
}

export class ProductEntity {
  public readonly id: string;
  public readonly sku: string | null;
  public readonly categoryId: string | null;
  public readonly category?: CategoryEntity | null;
  public readonly datasheetUrl: string | null;
  public readonly status: ProductStatus;
  public readonly isFeatured: boolean;
  public readonly featuredOrder: number;
  public readonly sortOrder: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly images: ProductImageProps[];
  public readonly translations: Record<string, ProductTranslationProps>;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.sku = props.sku ?? null;
    this.categoryId = props.categoryId ?? null;
    this.category = props.category ?? null;
    this.datasheetUrl = props.datasheetUrl ?? null;
    this.status = props.status ?? "published";
    this.isFeatured = props.isFeatured ?? false;
    this.featuredOrder = props.featuredOrder ?? 0;
    this.sortOrder = props.sortOrder ?? 0;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.images = props.images ?? [];
    this.translations = props.translations ?? {};
  }

  public getTranslation(lang: string): ProductTranslationProps | null {
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
    return (
      this.getTranslation("en")?.slug ??
      this.getTranslation("ar")?.slug ??
      this.getTranslation("ku")?.slug ??
      ""
    );
  }

  public get shortDescriptionEn(): string | null {
    return this.getTranslation("en")?.shortDescription ?? null;
  }

  public get shortDescriptionAr(): string | null {
    return this.getTranslation("ar")?.shortDescription ?? null;
  }

  public get shortDescriptionKu(): string | null {
    return this.getTranslation("ku")?.shortDescription ?? null;
  }

  public get specificationsEn(): Record<string, any> | null {
    return this.getTranslation("en")?.specifications ?? null;
  }

  public get specificationsAr(): Record<string, any> | null {
    return this.getTranslation("ar")?.specifications ?? null;
  }

  public get specificationsKu(): Record<string, any> | null {
    return this.getTranslation("ku")?.specifications ?? null;
  }

  public get primaryImage(): string | null {
    const primary = this.images.find((img) => img.isPrimary);
    return primary ? primary.imageUrl : (this.images[0]?.imageUrl ?? null);
  }

  public get thumbnail(): string | null {
    return this.primaryImage;
  }

  public get galleryImages(): string[] {
    return this.images.filter((img) => !img.isPrimary).map((img) => img.imageUrl);
  }

  public get allImages(): string[] {
    return this.images.map((img) => img.imageUrl);
  }

  public get isActive(): boolean {
    return this.status === "published";
  }

  public get displayImage(): string | null {
    return this.primaryImage;
  }
}
