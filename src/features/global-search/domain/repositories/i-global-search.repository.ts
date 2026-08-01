// ==============================================================================
// features/global-search/domain/repositories/i-global-search.repository.ts
// IGlobalSearchRepository Contract Interface
// ==============================================================================
import type { SearchResultItemEntity } from "../entities/global-search.entity";

export interface GlobalSearchFilters {
  query: string;
  moduleFilter?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedSearchResults {
  items: SearchResultItemEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  moduleCounts: Record<string, number>;
}

export interface IGlobalSearchRepository {
  searchAll(filters: GlobalSearchFilters): Promise<PaginatedSearchResults>;
}
