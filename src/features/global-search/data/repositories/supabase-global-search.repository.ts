// ==============================================================================
// features/global-search/data/repositories/supabase-global-search.repository.ts
// Supabase Implementation of IGlobalSearchRepository
// Schema-Aware Data Repository with Entity Configurations and Mappers
// Strictly matching production database columns — ZERO invented columns.
// Includes In-Flight Request Deduplication & Reuse of Supabase Client.
// 100% Type-Safe TypeScript — ZERO "any" types used.
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { Database } from "@core/types/database.types";
import type {
  IGlobalSearchRepository,
  GlobalSearchFilters,
  PaginatedSearchResults,
} from "../../domain/repositories/i-global-search.repository";
import type { SearchResultItemEntity, SearchModuleType } from "../../domain/entities/global-search.entity";
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
import {
  mapProductDTOToSearchResult,
  mapCategoryDTOToSearchResult,
  mapServiceDTOToSearchResult,
  mapProjectDTOToSearchResult,
  mapCertificationDTOToSearchResult,
  mapTeamMemberDTOToSearchResult,
  mapRFQDTOToSearchResult,
  mapContactMessageDTOToSearchResult,
  mapJobPostingDTOToSearchResult,
  mapBranchDTOToSearchResult,
  mapClientDTOToSearchResult,
} from "../mapper/global-search.mapper";

type TableName = keyof Database["public"]["Tables"];

function matchesQuery<T extends Record<string, unknown>>(
  rows: T[] | undefined,
  fields: Array<keyof T>,
  q: string
): boolean {
  if (!Array.isArray(rows)) return false;
  const qLower = q.toLowerCase();
  for (const row of rows) {
    for (const f of fields) {
      const val = row[f];
      if (val !== null && val !== undefined && String(val).toLowerCase().includes(qLower)) {
        return true;
      }
    }
  }
  return false;
}

function directMatch(values: Array<string | null | undefined>, q: string): boolean {
  const qLower = q.toLowerCase();
  return values.some((v) => v !== null && v !== undefined && String(v).toLowerCase().includes(qLower));
}

export class SupabaseGlobalSearchRepository implements IGlobalSearchRepository {
  // Re-use single Supabase client instance (prevents multiple client instantiations)
  private readonly supabase = createClient();

  // In-flight request cache to deduplicate simultaneous requests (e.g. React Strict Mode)
  private readonly inFlightRequests = new Map<string, Promise<PaginatedSearchResults>>();

  // ---------------------------------------------------------------------------
  // Module-specific Search Handlers (Schema-aware queries, zero "any")
  // ---------------------------------------------------------------------------

  private async searchProducts(q: string, limit = 50): Promise<SearchResultItemEntity[]> {
    try {
      const response = await this.supabase
        .from("products" as unknown as TableName)
        .select("id, status, product_translations(name, short_description, language_code)")
        .is("deleted_at", null)
        .limit(limit);

      if (response.error || !response.data) return [];
      const rows = response.data as unknown as ProductSearchDTO[];

      return rows
        .filter((r) => matchesQuery(r.product_translations, ["name", "short_description"], q))
        .map(mapProductDTOToSearchResult);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("[GlobalSearch] Products query failed:", err);
      return [];
    }
  }

  private async searchCategories(q: string, limit = 50): Promise<SearchResultItemEntity[]> {
    try {
      const response = await this.supabase
        .from("product_categories" as unknown as TableName)
        .select("id, status, product_category_translations(name, description, language_code)")
        .is("deleted_at", null)
        .limit(limit);

      if (response.error || !response.data) return [];
      const rows = response.data as unknown as CategorySearchDTO[];

      return rows
        .filter((r) => matchesQuery(r.product_category_translations, ["name", "description"], q))
        .map(mapCategoryDTOToSearchResult);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("[GlobalSearch] Categories query failed:", err);
      return [];
    }
  }

  private async searchServices(q: string, limit = 50): Promise<SearchResultItemEntity[]> {
    try {
      const response = await this.supabase
        .from("services" as unknown as TableName)
        .select("id, status, service_translations(name, description, applications, language_code)")
        .is("deleted_at", null)
        .limit(limit);

      if (response.error || !response.data) return [];
      const rows = response.data as unknown as ServiceSearchDTO[];

      return rows
        .filter((r) => matchesQuery(r.service_translations, ["name", "description", "applications"], q))
        .map(mapServiceDTOToSearchResult);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("[GlobalSearch] Services query failed:", err);
      return [];
    }
  }

  private async searchProjects(q: string, limit = 50): Promise<SearchResultItemEntity[]> {
    try {
      const response = await this.supabase
        .from("projects" as unknown as TableName)
        .select("id, client_name, location, status, created_at, project_translations(title, description, language_code)")
        .is("deleted_at", null)
        .limit(limit);

      if (response.error || !response.data) return [];
      const rows = response.data as unknown as ProjectSearchDTO[];

      return rows
        .filter(
          (r) =>
            matchesQuery(r.project_translations, ["title", "description"], q) ||
            directMatch([r.client_name, r.location], q)
        )
        .map(mapProjectDTOToSearchResult);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("[GlobalSearch] Projects query failed:", err);
      return [];
    }
  }

  private async searchCertifications(q: string, limit = 50): Promise<SearchResultItemEntity[]> {
    try {
      const response = await this.supabase
        .from("certifications" as unknown as TableName)
        .select("id, status, sort_order, certification_translations(title, description, language_code)")
        .is("deleted_at", null)
        .limit(limit);

      if (response.error || !response.data) return [];
      const rows = response.data as unknown as CertificationSearchDTO[];

      return rows
        .filter((r) => matchesQuery(r.certification_translations, ["title", "description"], q))
        .map(mapCertificationDTOToSearchResult);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("[GlobalSearch] Certifications query failed:", err);
      return [];
    }
  }

  private async searchTeamMembers(q: string, limit = 50): Promise<SearchResultItemEntity[]> {
    try {
      const response = await this.supabase
        .from("team_members" as unknown as TableName)
        .select("id, status, team_member_translations(name, position, bio, language_code)")
        .is("deleted_at", null)
        .limit(limit);

      if (response.error || !response.data) return [];
      const rows = response.data as unknown as TeamMemberSearchDTO[];

      return rows
        .filter((r) => matchesQuery(r.team_member_translations, ["name", "position", "bio"], q))
        .map(mapTeamMemberDTOToSearchResult);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("[GlobalSearch] Team Members query failed:", err);
      return [];
    }
  }

  private async searchRFQ(q: string, limit = 50): Promise<SearchResultItemEntity[]> {
    try {
      const response = await this.supabase
        .from("rfq_requests" as unknown as TableName)
        .select("id, full_name, company_name, phone, address, notes, status, created_at")
        .limit(limit);

      if (response.error || !response.data) return [];
      const rows = response.data as unknown as RFQSearchDTO[];

      return rows
        .filter((r) => directMatch([r.full_name, r.company_name, r.phone, r.address, r.notes], q))
        .map(mapRFQDTOToSearchResult);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("[GlobalSearch] RFQ query failed:", err);
      return [];
    }
  }

  private async searchContactMessages(q: string, limit = 50): Promise<SearchResultItemEntity[]> {
    try {
      const response = await this.supabase
        .from("contact_messages" as unknown as TableName)
        .select("id, full_name, email, subject, message, status, created_at")
        .limit(limit);

      if (response.error || !response.data) return [];
      const rows = response.data as unknown as ContactMessageSearchDTO[];

      return rows
        .filter((r) => directMatch([r.full_name, r.email, r.subject, r.message], q))
        .map(mapContactMessageDTOToSearchResult);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("[GlobalSearch] Contact Messages query failed:", err);
      return [];
    }
  }

  private async searchJobPostings(q: string, limit = 50): Promise<SearchResultItemEntity[]> {
    try {
      const response = await this.supabase
        .from("job_postings" as unknown as TableName)
        .select("id, department, location, status, created_at, job_posting_translations(title, description, requirements, language_code)")
        .is("deleted_at", null)
        .limit(limit);

      if (response.error || !response.data) return [];
      const rows = response.data as unknown as JobPostingSearchDTO[];

      return rows
        .filter(
          (r) =>
            matchesQuery(r.job_posting_translations, ["title", "description", "requirements"], q) ||
            directMatch([r.department, r.location], q)
        )
        .map(mapJobPostingDTOToSearchResult);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("[GlobalSearch] Job Postings query failed:", err);
      return [];
    }
  }

  private async searchBranches(q: string, limit = 50): Promise<SearchResultItemEntity[]> {
    try {
      const response = await this.supabase
        .from("branches" as unknown as TableName)
        .select("id, phone, email, status, branch_translations(name, address, language_code)")
        .is("deleted_at", null)
        .limit(limit);

      if (response.error || !response.data) return [];
      const rows = response.data as unknown as BranchSearchDTO[];

      return rows
        .filter(
          (r) =>
            matchesQuery(r.branch_translations, ["name", "address"], q) ||
            directMatch([r.phone, r.email], q)
        )
        .map(mapBranchDTOToSearchResult);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("[GlobalSearch] Branches query failed:", err);
      return [];
    }
  }

  private async searchClients(q: string, limit = 50): Promise<SearchResultItemEntity[]> {
    try {
      const response = await this.supabase
        .from("clients" as unknown as TableName)
        .select("id, website_url, status, client_translations(name, language_code)")
        .limit(limit);

      if (response.error || !response.data) return [];
      const rows = response.data as unknown as ClientSearchDTO[];

      return rows
        .filter(
          (r) =>
            matchesQuery(r.client_translations, ["name"], q) ||
            directMatch([r.website_url], q)
        )
        .map(mapClientDTOToSearchResult);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("[GlobalSearch] Clients query failed:", err);
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // Internal Execution Logic
  // ---------------------------------------------------------------------------

  private async executeSearch(
    q: string,
    activeModule: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedSearchResults> {
    const emptyModuleCounts: Record<string, number> = {
      all: 0,
      products: 0,
      categories: 0,
      services: 0,
      projects: 0,
      certificates: 0,
      team: 0,
      rfq: 0,
      contact: 0,
      careers: 0,
      branches: 0,
      clients: 0,
    };

    let allItems: SearchResultItemEntity[] = [];

    if (activeModule !== "all") {
      switch (activeModule as SearchModuleType) {
        case "products":
          allItems = await this.searchProducts(q, 100);
          break;
        case "categories":
          allItems = await this.searchCategories(q, 100);
          break;
        case "services":
          allItems = await this.searchServices(q, 100);
          break;
        case "projects":
          allItems = await this.searchProjects(q, 100);
          break;
        case "certificates":
          allItems = await this.searchCertifications(q, 100);
          break;
        case "team":
          allItems = await this.searchTeamMembers(q, 100);
          break;
        case "rfq":
          allItems = await this.searchRFQ(q, 100);
          break;
        case "contact":
          allItems = await this.searchContactMessages(q, 100);
          break;
        case "careers":
          allItems = await this.searchJobPostings(q, 100);
          break;
        case "branches":
          allItems = await this.searchBranches(q, 100);
          break;
        case "clients":
          allItems = await this.searchClients(q, 100);
          break;
        default:
          allItems = [];
      }
    } else {
      const [
        products,
        categories,
        services,
        projects,
        certificates,
        team,
        rfq,
        contact,
        careers,
        branches,
        clients,
      ] = await Promise.all([
        this.searchProducts(q, 30),
        this.searchCategories(q, 30),
        this.searchServices(q, 30),
        this.searchProjects(q, 30),
        this.searchCertifications(q, 30),
        this.searchTeamMembers(q, 30),
        this.searchRFQ(q, 30),
        this.searchContactMessages(q, 30),
        this.searchJobPostings(q, 30),
        this.searchBranches(q, 30),
        this.searchClients(q, 30),
      ]);

      allItems = [
        ...products,
        ...categories,
        ...services,
        ...projects,
        ...certificates,
        ...team,
        ...rfq,
        ...contact,
        ...careers,
        ...branches,
        ...clients,
      ];
    }

    const moduleCounts: Record<string, number> = { ...emptyModuleCounts };
    allItems.forEach((item) => {
      if (moduleCounts[item.module] !== undefined) {
        moduleCounts[item.module]++;
      }
    });
    moduleCounts.all = allItems.length;

    const total = allItems.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = allItems.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
      moduleCounts,
    };
  }

  // ---------------------------------------------------------------------------
  // Main SearchAll Implementation with Deduplication
  // ---------------------------------------------------------------------------

  async searchAll(filters: GlobalSearchFilters): Promise<PaginatedSearchResults> {
    const q = filters.query.trim();
    const pageSize = Math.max(1, Math.min(50, filters.pageSize ?? 10));
    const page = Math.max(1, filters.page ?? 1);
    const activeModule = filters.moduleFilter ?? "all";

    const emptyModuleCounts: Record<string, number> = {
      all: 0,
      products: 0,
      categories: 0,
      services: 0,
      projects: 0,
      certificates: 0,
      team: 0,
      rfq: 0,
      contact: 0,
      careers: 0,
      branches: 0,
      clients: 0,
    };

    if (q.length < 2) {
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize,
        totalPages: 0,
        moduleCounts: emptyModuleCounts,
      };
    }

    const cacheKey = `${q.toLowerCase()}:${activeModule}:${page}:${pageSize}`;

    // Return in-flight request if identical query is already executing
    if (this.inFlightRequests.has(cacheKey)) {
      return this.inFlightRequests.get(cacheKey)!;
    }

    const searchPromise = this.executeSearch(q, activeModule, page, pageSize);
    this.inFlightRequests.set(cacheKey, searchPromise);

    try {
      return await searchPromise;
    } finally {
      this.inFlightRequests.delete(cacheKey);
    }
  }
}
