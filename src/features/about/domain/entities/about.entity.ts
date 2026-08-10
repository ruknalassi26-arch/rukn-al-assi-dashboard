// ==============================================================================
// features/about/domain/entities/about.entity.ts
// Domain Entity Classes for About Us Management
// Strictly matching Supabase DB Schema
// ==============================================================================

export type SectionStatus = "published" | "draft" | "archived";

// 1. Company Profile & Translations (company_profile & company_profile_translations)
export interface CompanyInfoProps {
  id: string;
  translations: Record<string, { history: string; mission: string; vision: string }>;
  updatedAt: Date;
}

export class CompanyInfoEntity {
  public readonly id: string;
  public readonly translations: Record<string, { history: string; mission: string; vision: string }>;
  public readonly updatedAt: Date;

  constructor(props: CompanyInfoProps) {
    this.id = props.id;
    this.translations = props.translations ?? {};
    this.updatedAt = props.updatedAt;
  }

  public getTranslation(lang: string): { history: string; mission: string; vision: string } {
    const altLang = lang === "ckb" ? "ku" : lang === "ku" ? "ckb" : lang;
    return (
      this.translations[lang] ??
      this.translations[altLang] ??
      this.translations["en"] ?? { history: "", mission: "", vision: "" }
    );
  }
}

// 2. Core Values (core_values & core_value_translations)
export interface CoreValueProps {
  id: string;
  icon: string | null;
  sortOrder: number;
  status: SectionStatus;
  translations: Record<string, { title: string; description: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CoreValueEntity {
  public readonly id: string;
  public readonly icon: string | null;
  public readonly sortOrder: number;
  public readonly status: SectionStatus;
  public readonly translations: Record<string, { title: string; description: string }>;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: CoreValueProps) {
    this.id = props.id;
    this.icon = props.icon ?? null;
    this.sortOrder = props.sortOrder ?? 0;
    this.status = props.status ?? "active";
    this.translations = props.translations ?? {};
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public getTranslation(lang: string): { title: string; description: string } {
    const altLang = lang === "ckb" ? "ku" : lang === "ku" ? "ckb" : lang;
    return (
      this.translations[lang] ??
      this.translations[altLang] ??
      this.translations["en"] ?? { title: "", description: "" }
    );
  }
}

// 3. Timeline Events (timeline_events & timeline_event_translations)
export interface TimelineProps {
  id: string;
  eventYear: string | number;
  sortOrder: number;
  status: SectionStatus;
  translations: Record<string, { title: string; description: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TimelineEntity {
  public readonly id: string;
  public readonly eventYear: string;
  public readonly sortOrder: number;
  public readonly status: SectionStatus;
  public readonly translations: Record<string, { title: string; description: string }>;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: TimelineProps) {
    this.id = props.id;
    this.eventYear = String(props.eventYear ?? "");
    this.sortOrder = props.sortOrder ?? 0;
    this.status = props.status ?? "active";
    this.translations = props.translations ?? {};
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public getTranslation(lang: string): { title: string; description: string } {
    const altLang = lang === "ckb" ? "ku" : lang === "ku" ? "ckb" : lang;
    return (
      this.translations[lang] ??
      this.translations[altLang] ??
      this.translations["en"] ?? { title: "", description: "" }
    );
  }
}

// 4. Management Team (team_members & team_member_translations)
export interface TeamMemberProps {
  id: string;
  photoUrl: string | null;
  sortOrder: number;
  status: SectionStatus;
  translations: Record<string, { name: string; position: string; bio: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TeamMemberEntity {
  public readonly id: string;
  public readonly photoUrl: string | null;
  public readonly sortOrder: number;
  public readonly status: SectionStatus;
  public readonly translations: Record<string, { name: string; position: string; bio: string }>;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: TeamMemberProps) {
    this.id = props.id;
    this.photoUrl = props.photoUrl ?? null;
    this.sortOrder = props.sortOrder ?? 0;
    this.status = props.status ?? "active";
    this.translations = props.translations ?? {};
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public getTranslation(lang: string): { name: string; position: string; bio: string } {
    const altLang = lang === "ckb" ? "ku" : lang === "ku" ? "ckb" : lang;
    return (
      this.translations[lang] ??
      this.translations[altLang] ??
      this.translations["en"] ?? { name: "", position: "", bio: "" }
    );
  }
}

// 5. Certificates (certifications & certification_translations)
export interface AboutCertificateProps {
  id: string;
  imageUrl: string | null;
  issuedBy: string | null;
  issuedDate: string | null;
  sortOrder: number;
  status: SectionStatus;
  translations: Record<string, { title: string; description: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AboutCertificateEntity {
  public readonly id: string;
  public readonly imageUrl: string | null;
  public readonly issuedBy: string | null;
  public readonly issuedDate: string | null;
  public readonly sortOrder: number;
  public readonly status: SectionStatus;
  public readonly translations: Record<string, { title: string; description: string }>;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: AboutCertificateProps) {
    this.id = props.id;
    this.imageUrl = props.imageUrl ?? null;
    this.issuedBy = props.issuedBy ?? null;
    this.issuedDate = props.issuedDate ?? null;
    this.sortOrder = props.sortOrder ?? 0;
    this.status = props.status ?? "active";
    this.translations = props.translations ?? {};
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public getTranslation(lang: string): { title: string; description: string } {
    const altLang = lang === "ckb" ? "ku" : lang === "ku" ? "ckb" : lang;
    return (
      this.translations[lang] ??
      this.translations[altLang] ??
      this.translations["en"] ?? { title: "", description: "" }
    );
  }
}
