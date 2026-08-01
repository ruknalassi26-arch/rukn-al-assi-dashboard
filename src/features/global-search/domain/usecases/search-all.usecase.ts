// ==============================================================================
// features/global-search/domain/usecases/search-all.usecase.ts
// ==============================================================================
import type { IGlobalSearchRepository, GlobalSearchFilters, PaginatedSearchResults } from "../repositories/i-global-search.repository";

export class SearchAllUseCase {
  constructor(private readonly repository: IGlobalSearchRepository) {}

  async execute(filters: GlobalSearchFilters): Promise<PaginatedSearchResults> {
    if (!filters.query || filters.query.trim().length === 0) {
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: filters.pageSize ?? 10,
        totalPages: 0,
        moduleCounts: {},
      };
    }
    return this.repository.searchAll(filters);
  }
}
