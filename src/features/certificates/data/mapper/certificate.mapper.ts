// ==============================================================================
// features/certificates/data/mapper/certificate.mapper.ts
// Maps between Supabase Certificate DTOs and Certificate Domain Entity Classes
// ==============================================================================
import { CertificateEntity } from "../../domain/entities/certificate.entity";
import type { CertificateDTO } from "../dto/certificate.dto";

export function toCertificateEntity(dto: CertificateDTO): CertificateEntity {
  return new CertificateEntity({
    id: dto.id,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    titleKu: dto.title_ku ?? null,
    descriptionEn: dto.description_en,
    descriptionAr: dto.description_ar,
    descriptionKu: dto.description_ku ?? null,
    image: dto.image,
    issueDate: dto.issue_date,
    expiryDate: dto.expiry_date,
    organization: dto.organization,
    organizationAr: dto.organization_ar ?? null,
    organizationKu: dto.organization_ku ?? null,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}
