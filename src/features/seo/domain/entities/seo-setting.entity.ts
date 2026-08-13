// ==============================================================================
// features/seo/domain/entities/seo-setting.entity.ts
// SEO Metadata Domain Entity Class
// ==============================================================================

export type SeoPageKey =
  | "home"
  | "about"
  | "products"
  | "categories"
  | "services"
  | "projects"
  | "certificates"
  | "contact"
  | "careers";

export interface SeoSettingProps {
  id: string;
  pageKey: SeoPageKey;
  metaTitleEn: string | null;
  metaTitleAr: string | null;
  metaTitleKu?: string | null;
  metaDescriptionEn: string | null;
  metaDescriptionAr: string | null;
  metaDescriptionKu?: string | null;
  canonicalUrlEn?: string | null;
  canonicalUrlAr?: string | null;
  canonicalUrlKu?: string | null;
  ogImageUrl: string | null;
  schemaJson?: Record<string, unknown> | unknown[] | null;
  isIndexed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class SeoSettingEntity {
  public readonly id: string;
  public readonly pageKey: SeoPageKey;
  public readonly metaTitleEn: string | null;
  public readonly metaTitleAr: string | null;
  public readonly metaTitleKu: string | null;
  public readonly metaDescriptionEn: string | null;
  public readonly metaDescriptionAr: string | null;
  public readonly metaDescriptionKu: string | null;
  public readonly canonicalUrlEn: string | null;
  public readonly canonicalUrlAr: string | null;
  public readonly canonicalUrlKu: string | null;
  public readonly ogImageUrl: string | null;
  public readonly schemaJson: Record<string, unknown> | unknown[] | null;
  public readonly isIndexed: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: SeoSettingProps) {
    this.id = props.id;
    this.pageKey = props.pageKey;
    this.metaTitleEn = props.metaTitleEn;
    this.metaTitleAr = props.metaTitleAr;
    this.metaTitleKu = props.metaTitleKu ?? null;
    this.metaDescriptionEn = props.metaDescriptionEn;
    this.metaDescriptionAr = props.metaDescriptionAr;
    this.metaDescriptionKu = props.metaDescriptionKu ?? null;
    this.canonicalUrlEn = props.canonicalUrlEn ?? null;
    this.canonicalUrlAr = props.canonicalUrlAr ?? null;
    this.canonicalUrlKu = props.canonicalUrlKu ?? null;
    this.ogImageUrl = props.ogImageUrl;
    this.schemaJson = props.schemaJson ?? null;
    this.isIndexed = props.isIndexed;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
