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
  keywordsEn: string | null;
  keywordsAr: string | null;
  keywordsKu?: string | null;
  ogImageUrl: string | null;
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
  public readonly keywordsEn: string | null;
  public readonly keywordsAr: string | null;
  public readonly keywordsKu: string | null;
  public readonly ogImageUrl: string | null;
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
    this.keywordsEn = props.keywordsEn;
    this.keywordsAr = props.keywordsAr;
    this.keywordsKu = props.keywordsKu ?? null;
    this.ogImageUrl = props.ogImageUrl;
    this.isIndexed = props.isIndexed;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
