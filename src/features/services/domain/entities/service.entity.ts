// ==============================================================================
// features/services/domain/entities/service.entity.ts
// Service Domain Entity Class strictly matching Supabase DB Schema
// ==============================================================================

export type ServiceStatus = "published" | "draft" | "archived";

export interface ServiceTranslationProps {
  slug: string;
  name: string;
  description?: string | null;
  applications?: string | null;
}

export interface ServiceProps {
  id: string;
  icon?: string | null;
  heroImageUrl?: string | null;
  status: ServiceStatus;
  isFeatured: boolean;
  featuredOrder?: number;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
  translations: Record<string, ServiceTranslationProps>;
}

export class ServiceEntity {
  public readonly id: string;
  public readonly icon: string | null;
  public readonly heroImageUrl: string | null;
  public readonly status: ServiceStatus;
  public readonly isFeatured: boolean;
  public readonly featuredOrder: number;
  public readonly sortOrder: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly translations: Record<string, ServiceTranslationProps>;

  constructor(props: ServiceProps) {
    this.id = props.id;
    this.icon = props.icon ?? null;
    this.heroImageUrl = props.heroImageUrl ?? null;
    this.status = props.status ?? "published";
    this.isFeatured = props.isFeatured ?? false;
    this.featuredOrder = props.featuredOrder ?? 0;
    this.sortOrder = props.sortOrder ?? 0;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.translations = props.translations ?? {};
  }

  public getTranslation(lang: string): ServiceTranslationProps | null {
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

  public get titleEn(): string {
    return this.nameEn;
  }

  public get titleAr(): string {
    return this.nameAr;
  }

  public get titleKu(): string | null {
    return this.nameKu;
  }

  public get slug(): string {
    return (
      this.getTranslation("en")?.slug ??
      this.getTranslation("ar")?.slug ??
      this.getTranslation("ku")?.slug ??
      ""
    );
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

  public get applicationsEn(): string | null {
    return this.getTranslation("en")?.applications ?? null;
  }

  public get applicationsAr(): string | null {
    return this.getTranslation("ar")?.applications ?? null;
  }

  public get applicationsKu(): string | null {
    return this.getTranslation("ku")?.applications ?? null;
  }

  public get image(): string | null {
    return this.heroImageUrl;
  }

  public get isActive(): boolean {
    return this.status === "published";
  }
}
