// ==============================================================================
// features/certificates/domain/entities/certificate.entity.ts
// Certificate Domain Entity Class strictly matching Supabase SQL Schema
// ==============================================================================

export type CertificateStatus = "active" | "draft";

export interface CertificateProps {
  id: string;
  titleEn: string;
  titleAr: string;
  titleKu?: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  descriptionKu?: string | null;
  image: string | null;
  issueDate: string | null;
  organization: string | null;
  organizationAr?: string | null;
  organizationKu?: string | null;
  sortOrder: number;
  status: CertificateStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class CertificateEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly titleKu: string | null;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly descriptionKu: string | null;
  public readonly image: string | null;
  public readonly issueDate: string | null;
  public readonly organization: string | null;
  public readonly organizationAr: string | null;
  public readonly organizationKu: string | null;
  public readonly sortOrder: number;
  public readonly status: CertificateStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: CertificateProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.titleKu = props.titleKu ?? null;
    this.descriptionEn = props.descriptionEn ?? null;
    this.descriptionAr = props.descriptionAr ?? null;
    this.descriptionKu = props.descriptionKu ?? null;
    this.image = props.image ?? null;
    this.issueDate = props.issueDate ?? null;
    this.organization = props.organization ?? null;
    this.organizationAr = props.organizationAr ?? null;
    this.organizationKu = props.organizationKu ?? null;
    this.sortOrder = props.sortOrder ?? 0;
    this.status = props.status ?? "active";
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public get isActive(): boolean {
    return this.status === "active";
  }
}
