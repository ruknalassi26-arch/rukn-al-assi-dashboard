// ==============================================================================
// features/certificates/domain/repositories/i-certificate.repository.ts
// ICertificateRepository Contract Interface strictly matching Supabase SQL Schema
// ==============================================================================
import type { CertificateEntity, CertificateStatus } from "../entities/certificate.entity";

export interface CertificateFilterParams {
  search?: string;
  status?: CertificateStatus | "all";
  isFeatured?: boolean | "all";
  page?: number;
  limit?: number;
  sortBy?: "title_en" | "sort_order" | "featured_order" | "created_at" | "issue_date";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedCertificates {
  items: CertificateEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCertificateInput {
  titleEn: string;
  titleAr: string;
  titleKu?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  descriptionKu?: string | null;
  image?: string | null;
  issueDate?: string | null;
  organization?: string | null;
  organizationAr?: string | null;
  organizationKu?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  featuredOrder?: number | null;
  status?: CertificateStatus;
}

export interface UpdateCertificateInput extends Partial<CreateCertificateInput> {
  id: string;
}

export interface ICertificateRepository {
  getCertificates(params?: CertificateFilterParams): Promise<PaginatedCertificates>;
  getCertificateById(id: string): Promise<CertificateEntity | null>;
  createCertificate(input: CreateCertificateInput): Promise<CertificateEntity>;
  updateCertificate(input: UpdateCertificateInput): Promise<CertificateEntity>;
  deleteCertificate(id: string): Promise<void>;
  duplicateCertificate(id: string): Promise<CertificateEntity>;
  bulkDeleteCertificates(ids: string[]): Promise<void>;
  bulkUpdateCertificateStatus(ids: string[], status: CertificateStatus): Promise<void>;
}
