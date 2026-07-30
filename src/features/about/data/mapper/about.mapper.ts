// ==============================================================================
// features/about/data/mapper/about.mapper.ts
// Maps between Supabase DTOs and Domain Entity Classes for About Us Management
// ==============================================================================
import type {
  CompanyInfoDTO,
  CompanyMissionDTO,
  CompanyVisionDTO,
  CoreValueDTO,
  CompanyTimelineDTO,
  ManagementTeamDTO,
  AboutCertificateDTO,
} from "../dto/about.dto";
import {
  CompanyInfoEntity,
  MissionEntity,
  VisionEntity,
  CoreValueEntity,
  TimelineEntity,
  TeamMemberEntity,
  AboutCertificateEntity,
} from "../../domain/entities/about.entity";

export function toCompanyInfoEntity(dto: CompanyInfoDTO): CompanyInfoEntity {
  return new CompanyInfoEntity({
    id: dto.id,
    companyNameEn: dto.company_name_en,
    companyNameAr: dto.company_name_ar,
    shortDescriptionEn: dto.short_description_en,
    shortDescriptionAr: dto.short_description_ar,
    fullDescriptionEn: dto.full_description_en,
    fullDescriptionAr: dto.full_description_ar,
    establishedYear: dto.established_year,
    headquarters: dto.headquarters,
    website: dto.website,
    phone: dto.phone,
    email: dto.email,
    status: dto.status,
    updatedAt: new Date(dto.updated_at),
  });
}

export function toMissionEntity(dto: CompanyMissionDTO): MissionEntity {
  return new MissionEntity({
    id: dto.id,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    contentEn: dto.content_en,
    contentAr: dto.content_ar,
    icon: dto.icon,
    status: dto.status,
    updatedAt: new Date(dto.updated_at),
  });
}

export function toVisionEntity(dto: CompanyVisionDTO): VisionEntity {
  return new VisionEntity({
    id: dto.id,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    contentEn: dto.content_en,
    contentAr: dto.content_ar,
    icon: dto.icon,
    status: dto.status,
    updatedAt: new Date(dto.updated_at),
  });
}

export function toCoreValueEntity(dto: CoreValueDTO): CoreValueEntity {
  return new CoreValueEntity({
    id: dto.id,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    descriptionEn: dto.description_en,
    descriptionAr: dto.description_ar,
    icon: dto.icon,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}

export function toTimelineEntity(dto: CompanyTimelineDTO): TimelineEntity {
  return new TimelineEntity({
    id: dto.id,
    year: dto.year,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    descriptionEn: dto.description_en,
    descriptionAr: dto.description_ar,
    image: dto.image,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}

export function toTeamMemberEntity(dto: ManagementTeamDTO): TeamMemberEntity {
  return new TeamMemberEntity({
    id: dto.id,
    photo: dto.photo,
    fullNameEn: dto.full_name_en,
    fullNameAr: dto.full_name_ar,
    positionEn: dto.position_en,
    positionAr: dto.position_ar,
    biographyEn: dto.biography_en,
    biographyAr: dto.biography_ar,
    linkedin: dto.linkedin,
    email: dto.email,
    phone: dto.phone,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}

export function toAboutCertificateEntity(dto: AboutCertificateDTO): AboutCertificateEntity {
  return new AboutCertificateEntity({
    id: dto.id,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    descriptionEn: dto.description_en,
    descriptionAr: dto.description_ar,
    image: dto.image,
    issueDate: dto.issue_date,
    expiryDate: dto.expiry_date,
    organization: dto.organization,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}
