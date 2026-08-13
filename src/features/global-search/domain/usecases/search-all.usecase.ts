// ==============================================================================
// features/global-search/domain/usecases/search-all.usecase.ts
// ==============================================================================
import type { IGlobalSearchRepository, GlobalSearchFilters, PaginatedSearchResults } from "../repositories/i-global-search.repository";

export class SearchAllUseCase {
  constructor(private readonly repository: IGlobalSearchRepository) {}

  async execute(filters: GlobalSearchFilters): Promise<PaginatedSearchResults> {
    if (!filters.query || filters.query.trim().length < 2) {
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: filters.pageSize ?? 10,
        totalPages: 0,
        moduleCounts: {
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
        },
      };
    }
    return this.repository.searchAll(filters);
  }
}
