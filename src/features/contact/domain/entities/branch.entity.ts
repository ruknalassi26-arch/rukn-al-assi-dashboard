// ==============================================================================
// features/contact/domain/entities/branch.entity.ts
// Branch Domain Entity Class strictly matching Supabase schema (branches + branch_translations)
// ==============================================================================

export type BranchStatus = "published" | "draft" | "archived" | "active";

export interface BranchTranslationProps {
  name: string;
  address?: string | null;
}

export interface BranchProps {
  id: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  whatsappNumber?: string | null;
  sortOrder: number;
  status: BranchStatus;
  translations?: Record<string, BranchTranslationProps>;
  // Convenience language props
  nameEn?: string;
  nameAr?: string;
  nameKu?: string | null;
  addressEn?: string | null;
  addressAr?: string | null;
  addressKu?: string | null;
}

export interface CreateBranchInput {
  nameEn: string;
  nameAr: string;
  nameKu?: string | null;
  addressEn?: string | null;
  addressAr?: string | null;
  addressKu?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsappNumber?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: BranchStatus;
  sortOrder: number;
}

export interface UpdateBranchInput extends CreateBranchInput {
  id: string;
}

export class BranchEntity {
  public readonly id: string;
  public readonly latitude: number | null;
  public readonly longitude: number | null;
  public readonly phone: string | null;
  public readonly email: string | null;
  public readonly whatsappNumber: string | null;
  public readonly sortOrder: number;
  public readonly status: BranchStatus;
  public readonly translations: Record<string, BranchTranslationProps>;

  constructor(props: BranchProps) {
    this.id = props.id;
    this.latitude = props.latitude ?? null;
    this.longitude = props.longitude ?? null;
    this.phone = props.phone ?? null;
    this.email = props.email ?? null;
    this.whatsappNumber = props.whatsappNumber ?? null;
    this.sortOrder = props.sortOrder ?? 0;
    // Standardize "active" to "published"
    const rawStatus = props.status as string;
    this.status = rawStatus === "active" ? "published" : props.status ?? "published";

    this.translations = props.translations ?? {
      en: { name: props.nameEn ?? "", address: props.addressEn ?? null },
      ar: { name: props.nameAr ?? "", address: props.addressAr ?? null },
      ku: { name: props.nameKu ?? "", address: props.addressKu ?? null },
    };
  }

  public getTranslation(lang: string): BranchTranslationProps | null {
    const altLang = lang === "ckb" ? "ku" : lang === "ku" ? "ckb" : lang;
    return this.translations[lang] ?? this.translations[altLang] ?? null;
  }

  public get nameEn(): string {
    return this.getTranslation("en")?.name ?? "";
  }

  public get nameAr(): string {
    return this.getTranslation("ar")?.name ?? "";
  }

  public get nameKu(): string | null {
    return this.getTranslation("ku")?.name ?? null;
  }

  public get addressEn(): string | null {
    return this.getTranslation("en")?.address ?? null;
  }

  public get addressAr(): string | null {
    return this.getTranslation("ar")?.address ?? null;
  }

  public get addressKu(): string | null {
    return this.getTranslation("ku")?.address ?? null;
  }

  public get isActive(): boolean {
    return this.status === "published" || (this.status as string) === "active";
  }
}
