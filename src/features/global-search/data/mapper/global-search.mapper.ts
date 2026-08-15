// ==============================================================================
// features/global-search/data/mapper/global-search.mapper.ts
// Data -> Domain Mappers for Search Entities
// Transforms raw database DTOs into clean SearchResultItemEntity instances.
// Strictly typed without any "any" types.
// ==============================================================================
import { SearchResultItemEntity } from "../../domain/entities/global-search.entity";
import type {
  ProductSearchDTO,
  CategorySearchDTO,
  ServiceSearchDTO,
  ProjectSearchDTO,
  CertificationSearchDTO,
  TeamMemberSearchDTO,
  RFQSearchDTO,
  ContactMessageSearchDTO,
  JobPostingSearchDTO,
  BranchSearchDTO,
  ClientSearchDTO,
} from "../dto/search.dto";

const LANG_PRIORITY = ["en", "en-US", "ar", "ar-IQ", "ku", "ckb"];

function getTranslationValue<
  T extends { language_code: string } & Record<string, unknown>
>(list: T[] | undefined, field: keyof T): string | null {
  if (!Array.isArray(list) || list.length === 0) return null;
  for (const lang of LANG_PRIORITY) {
    const row = list.find((item) => item.language_code === lang);
    if (row && row[field] !== null && row[field] !== undefined && String(row[field]).trim() !== "") {
      return String(row[field]);
    }
  }
  for (const row of list) {
    if (row[field] !== null && row[field] !== undefined && String(row[field]).trim() !== "") {
      return String(row[field]);
    }
  }
  return null;
}

export function mapProductDTOToSearchResult(
  dto: ProductSearchDTO
): SearchResultItemEntity {
  const translations = dto.product_translations ?? [];
  const title = getTranslationValue(translations, "name") ?? "Product";
  const description = getTranslationValue(translations, "short_description");

  return new SearchResultItemEntity({
    id: dto.id,
    module: "products",
    title,
    description,
    link: `/admin/products/edit/${dto.id}`,
  });
}

export function mapCategoryDTOToSearchResult(
  dto: CategorySearchDTO
): SearchResultItemEntity {
  const translations = dto.product_category_translations ?? [];
  const title = getTranslationValue(translations, "name") ?? "Category";
  const description = getTranslationValue(translations, "description");

  return new SearchResultItemEntity({
    id: dto.id,
    module: "categories",
    title,
    description,
    link: `/admin/categories/edit/${dto.id}`,
  });
}

export function mapServiceDTOToSearchResult(
  dto: ServiceSearchDTO
): SearchResultItemEntity {
  const translations = dto.service_translations ?? [];
  const title = getTranslationValue(translations, "name") ?? "Service";
  const description = getTranslationValue(translations, "description");

  return new SearchResultItemEntity({
    id: dto.id,
    module: "services",
    title,
    description,
    link: `/admin/services/edit/${dto.id}`,
  });
}

export function mapProjectDTOToSearchResult(
  dto: ProjectSearchDTO
): SearchResultItemEntity {
  const translations = dto.project_translations ?? [];
  const title = getTranslationValue(translations, "title") ?? "Project";
  const description =
    getTranslationValue(translations, "description") ??
    (dto.client_name ? `Client: ${dto.client_name}` : null);

  return new SearchResultItemEntity({
    id: dto.id,
    module: "projects",
    title,
    description,
    link: `/admin/projects/edit/${dto.id}`,
    createdAt: dto.created_at ? new Date(dto.created_at) : null,
  });
}

export function mapCertificationDTOToSearchResult(
  dto: CertificationSearchDTO
): SearchResultItemEntity {
  const translations = dto.certification_translations ?? [];
  const title = getTranslationValue(translations, "title") ?? "Certification";
  const description = getTranslationValue(translations, "description");

  return new SearchResultItemEntity({
    id: dto.id,
    module: "certificates",
    title,
    description,
    link: `/admin/certificates/edit/${dto.id}`,
  });
}

export function mapTeamMemberDTOToSearchResult(
  dto: TeamMemberSearchDTO
): SearchResultItemEntity {
  const translations = dto.team_member_translations ?? [];
  const title = getTranslationValue(translations, "name") ?? "Team Member";
  const description = getTranslationValue(translations, "position");

  return new SearchResultItemEntity({
    id: dto.id,
    module: "team",
    title,
    description,
    link: `/admin/team/edit/${dto.id}`,
  });
}

export function mapRFQDTOToSearchResult(
  dto: RFQSearchDTO
): SearchResultItemEntity {
  const title = dto.company_name
    ? `${dto.full_name} (${dto.company_name})`
    : dto.full_name || "RFQ Request";
  const description = `Status: ${String(dto.status || "new").toUpperCase()} • ${dto.phone || ""}`;

  return new SearchResultItemEntity({
    id: dto.id,
    module: "rfq",
    title,
    description,
    link: `/admin/rfq`,
    createdAt: dto.created_at ? new Date(dto.created_at) : null,
  });
}

export function mapContactMessageDTOToSearchResult(
  dto: ContactMessageSearchDTO
): SearchResultItemEntity {
  const title = dto.subject || `Message from ${dto.full_name || "Visitor"}`;
  const description = `From: ${dto.full_name || "Visitor"} (${dto.email || ""})`;

  return new SearchResultItemEntity({
    id: dto.id,
    module: "contact",
    title,
    description,
    link: `/admin/contact-messages`,
    createdAt: dto.created_at ? new Date(dto.created_at) : null,
  });
}

export function mapJobPostingDTOToSearchResult(
  dto: JobPostingSearchDTO
): SearchResultItemEntity {
  const translations = dto.job_posting_translations ?? [];
  const title = getTranslationValue(translations, "title") ?? "Job Posting";
  const description =
    getTranslationValue(translations, "description") ??
    (dto.department ? `${dto.department}${dto.location ? ` • ${dto.location}` : ""}` : null);

  return new SearchResultItemEntity({
    id: dto.id,
    module: "careers",
    title,
    description,
    link: `/admin/careers/postings/${dto.id}/edit`,
    createdAt: dto.created_at ? new Date(dto.created_at) : null,
  });
}

export function mapBranchDTOToSearchResult(
  dto: BranchSearchDTO
): SearchResultItemEntity {
  const translations = dto.branch_translations ?? [];
  const title = getTranslationValue(translations, "name") ?? "Branch";
  const description =
    getTranslationValue(translations, "address") ?? dto.email ?? dto.phone ?? null;

  return new SearchResultItemEntity({
    id: dto.id,
    module: "branches",
    title,
    description,
    link: `/admin/branches`,
  });
}

export function mapClientDTOToSearchResult(
  dto: ClientSearchDTO
): SearchResultItemEntity {
  const translations = dto.client_translations ?? [];
  const title = getTranslationValue(translations, "name") ?? "Client";

  return new SearchResultItemEntity({
    id: dto.id,
    module: "clients",
    title,
    description: dto.website_url ?? null,
    link: `/admin/homepage`,
  });
}
