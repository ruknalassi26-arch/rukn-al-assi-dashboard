// ==============================================================================
// features/about/domain/entities/about.entity.ts
// Domain Entity Classes for About Us Management
// ==============================================================================

export type SectionStatus = "active" | "draft";

export interface CompanyInfoProps {
  id: string;
  companyNameEn: string;
  companyNameAr: string;
  shortDescriptionEn: string | null;
  shortDescriptionAr: string | null;
  fullDescriptionEn: string | null;
  fullDescriptionAr: string | null;
  establishedYear: number | null;
  headquarters: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  status: SectionStatus;
  updatedAt: Date;
}

export class CompanyInfoEntity {
  public readonly id: string;
  public readonly companyNameEn: string;
  public readonly companyNameAr: string;
  public readonly shortDescriptionEn: string | null;
  public readonly shortDescriptionAr: string | null;
  public readonly fullDescriptionEn: string | null;
  public readonly fullDescriptionAr: string | null;
  public readonly establishedYear: number | null;
  public readonly headquarters: string | null;
  public readonly website: string | null;
  public readonly phone: string | null;
  public readonly email: string | null;
  public readonly status: SectionStatus;
  public readonly updatedAt: Date;

  constructor(props: CompanyInfoProps) {
    this.id = props.id;
    this.companyNameEn = props.companyNameEn;
    this.companyNameAr = props.companyNameAr;
    this.shortDescriptionEn = props.shortDescriptionEn;
    this.shortDescriptionAr = props.shortDescriptionAr;
    this.fullDescriptionEn = props.fullDescriptionEn;
    this.fullDescriptionAr = props.fullDescriptionAr;
    this.establishedYear = props.establishedYear;
    this.headquarters = props.headquarters;
    this.website = props.website;
    this.phone = props.phone;
    this.email = props.email;
    this.status = props.status;
    this.updatedAt = props.updatedAt;
  }
}

export interface SectionStatementProps {
  id: string;
  titleEn: string;
  titleAr: string;
  contentEn: string | null;
  contentAr: string | null;
  icon: string | null;
  status: SectionStatus;
  updatedAt: Date;
}

export class MissionEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly contentEn: string | null;
  public readonly contentAr: string | null;
  public readonly icon: string | null;
  public readonly status: SectionStatus;
  public readonly updatedAt: Date;

  constructor(props: SectionStatementProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.contentEn = props.contentEn;
    this.contentAr = props.contentAr;
    this.icon = props.icon;
    this.status = props.status;
    this.updatedAt = props.updatedAt;
  }
}

export class VisionEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly contentEn: string | null;
  public readonly contentAr: string | null;
  public readonly icon: string | null;
  public readonly status: SectionStatus;
  public readonly updatedAt: Date;

  constructor(props: SectionStatementProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.contentEn = props.contentEn;
    this.contentAr = props.contentAr;
    this.icon = props.icon;
    this.status = props.status;
    this.updatedAt = props.updatedAt;
  }
}

export interface CoreValueProps {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  icon: string | null;
  sortOrder: number;
  status: SectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class CoreValueEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly icon: string | null;
  public readonly sortOrder: number;
  public readonly status: SectionStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: CoreValueProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.descriptionEn = props.descriptionEn;
    this.descriptionAr = props.descriptionAr;
    this.icon = props.icon;
    this.sortOrder = props.sortOrder;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface TimelineProps {
  id: string;
  year: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  image: string | null;
  sortOrder: number;
  status: SectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class TimelineEntity {
  public readonly id: string;
  public readonly year: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly image: string | null;
  public readonly sortOrder: number;
  public readonly status: SectionStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: TimelineProps) {
    this.id = props.id;
    this.year = props.year;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.descriptionEn = props.descriptionEn;
    this.descriptionAr = props.descriptionAr;
    this.image = props.image;
    this.sortOrder = props.sortOrder;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface TeamMemberProps {
  id: string;
  photo: string | null;
  fullNameEn: string;
  fullNameAr: string;
  positionEn: string | null;
  positionAr: string | null;
  biographyEn: string | null;
  biographyAr: string | null;
  linkedin: string | null;
  email: string | null;
  phone: string | null;
  sortOrder: number;
  status: SectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class TeamMemberEntity {
  public readonly id: string;
  public readonly photo: string | null;
  public readonly fullNameEn: string;
  public readonly fullNameAr: string;
  public readonly positionEn: string | null;
  public readonly positionAr: string | null;
  public readonly biographyEn: string | null;
  public readonly biographyAr: string | null;
  public readonly linkedin: string | null;
  public readonly email: string | null;
  public readonly phone: string | null;
  public readonly sortOrder: number;
  public readonly status: SectionStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: TeamMemberProps) {
    this.id = props.id;
    this.photo = props.photo;
    this.fullNameEn = props.fullNameEn;
    this.fullNameAr = props.fullNameAr;
    this.positionEn = props.positionEn;
    this.positionAr = props.positionAr;
    this.biographyEn = props.biographyEn;
    this.biographyAr = props.biographyAr;
    this.linkedin = props.linkedin;
    this.email = props.email;
    this.phone = props.phone;
    this.sortOrder = props.sortOrder;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export interface AboutCertificateProps {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  image: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  organization: string | null;
  sortOrder: number;
  status: SectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class AboutCertificateEntity {
  public readonly id: string;
  public readonly titleEn: string;
  public readonly titleAr: string;
  public readonly descriptionEn: string | null;
  public readonly descriptionAr: string | null;
  public readonly image: string | null;
  public readonly issueDate: string | null;
  public readonly expiryDate: string | null;
  public readonly organization: string | null;
  public readonly sortOrder: number;
  public readonly status: SectionStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: AboutCertificateProps) {
    this.id = props.id;
    this.titleEn = props.titleEn;
    this.titleAr = props.titleAr;
    this.descriptionEn = props.descriptionEn;
    this.descriptionAr = props.descriptionAr;
    this.image = props.image;
    this.issueDate = props.issueDate;
    this.expiryDate = props.expiryDate;
    this.organization = props.organization;
    this.sortOrder = props.sortOrder;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
