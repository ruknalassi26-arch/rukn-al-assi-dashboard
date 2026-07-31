// ==============================================================================
// features/settings/domain/entities/website-settings.entity.ts
// Website Settings Domain Entity Class
// ==============================================================================

export interface WebsiteSettingsProps {
  id: string;
  companyNameEn: string;
  companyNameAr: string;
  companyNameKu?: string | null;
  taglineEn?: string | null;
  taglineAr?: string | null;
  taglineKu?: string | null;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  faviconUrl?: string | null;
  email: string | null;
  phone: string | null;
  phoneSecondary?: string | null;
  addressEn: string | null;
  addressAr: string | null;
  addressKu?: string | null;
  googleMapsUrl: string | null;
  latitude?: number | null;
  longitude?: number | null;
  workingHoursEn: string | null;
  workingHoursAr: string | null;
  workingHoursKu?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  whatsappNumber?: string | null;
  seoTitleEn?: string | null;
  seoTitleAr?: string | null;
  seoTitleKu?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionAr?: string | null;
  seoDescriptionKu?: string | null;
  updatedAt: Date;
}

export class WebsiteSettingsEntity {
  public readonly id: string;
  public readonly companyNameEn: string;
  public readonly companyNameAr: string;
  public readonly companyNameKu: string | null;
  public readonly taglineEn: string | null;
  public readonly taglineAr: string | null;
  public readonly taglineKu: string | null;
  public readonly logoUrl: string | null;
  public readonly logoDarkUrl: string | null;
  public readonly faviconUrl: string | null;
  public readonly email: string | null;
  public readonly phone: string | null;
  public readonly phoneSecondary: string | null;
  public readonly addressEn: string | null;
  public readonly addressAr: string | null;
  public readonly addressKu: string | null;
  public readonly googleMapsUrl: string | null;
  public readonly latitude: number | null;
  public readonly longitude: number | null;
  public readonly workingHoursEn: string | null;
  public readonly workingHoursAr: string | null;
  public readonly workingHoursKu: string | null;
  public readonly facebookUrl: string | null;
  public readonly twitterUrl: string | null;
  public readonly linkedinUrl: string | null;
  public readonly instagramUrl: string | null;
  public readonly youtubeUrl: string | null;
  public readonly whatsappNumber: string | null;
  public readonly seoTitleEn: string | null;
  public readonly seoTitleAr: string | null;
  public readonly seoTitleKu: string | null;
  public readonly seoDescriptionEn: string | null;
  public readonly seoDescriptionAr: string | null;
  public readonly seoDescriptionKu: string | null;
  public readonly updatedAt: Date;

  constructor(props: WebsiteSettingsProps) {
    this.id = props.id;
    this.companyNameEn = props.companyNameEn;
    this.companyNameAr = props.companyNameAr;
    this.companyNameKu = props.companyNameKu ?? null;
    this.taglineEn = props.taglineEn ?? null;
    this.taglineAr = props.taglineAr ?? null;
    this.taglineKu = props.taglineKu ?? null;
    this.logoUrl = props.logoUrl ?? null;
    this.logoDarkUrl = props.logoDarkUrl ?? null;
    this.faviconUrl = props.faviconUrl ?? null;
    this.email = props.email;
    this.phone = props.phone;
    this.phoneSecondary = props.phoneSecondary ?? null;
    this.addressEn = props.addressEn;
    this.addressAr = props.addressAr;
    this.addressKu = props.addressKu ?? null;
    this.googleMapsUrl = props.googleMapsUrl;
    this.latitude = props.latitude ?? null;
    this.longitude = props.longitude ?? null;
    this.workingHoursEn = props.workingHoursEn;
    this.workingHoursAr = props.workingHoursAr;
    this.workingHoursKu = props.workingHoursKu ?? null;
    this.facebookUrl = props.facebookUrl ?? null;
    this.twitterUrl = props.twitterUrl ?? null;
    this.linkedinUrl = props.linkedinUrl ?? null;
    this.instagramUrl = props.instagramUrl ?? null;
    this.youtubeUrl = props.youtubeUrl ?? null;
    this.whatsappNumber = props.whatsappNumber ?? null;
    this.seoTitleEn = props.seoTitleEn ?? null;
    this.seoTitleAr = props.seoTitleAr ?? null;
    this.seoTitleKu = props.seoTitleKu ?? null;
    this.seoDescriptionEn = props.seoDescriptionEn ?? null;
    this.seoDescriptionAr = props.seoDescriptionAr ?? null;
    this.seoDescriptionKu = props.seoDescriptionKu ?? null;
    this.updatedAt = props.updatedAt;
  }
}
