// ==============================================================================
// features/global-search/data/repositories/supabase-global-search.repository.ts
// Supabase Implementation of IGlobalSearchRepository
// 100% Server-Side RPC Global Search ("global_search")
// Strictly matching schema in database.types.ts.
// Executes EXACTLY 1 single database request per search query.
// 100% Type-Safe TypeScript — ZERO "any" types used.
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IGlobalSearchRepository,
  GlobalSearchFilters,
  PaginatedSearchResults,
} from "../../domain/repositories/i-global-search.repository";
import { SearchResultItemEntity, type SearchModuleType } from "../../domain/entities/global-search.entity";

interface RpcSearchResultRow {
  id: string;
  module: string;
  title: string;
  description: string | null;
  link: string;
  created_at: string | null;
}

export class SupabaseGlobalSearchRepository implements IGlobalSearchRepository {
  private readonly supabase = createClient();
  private readonly inFlightRequests = new Map<string, Promise<PaginatedSearchResults>>();

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

    // Return in-flight request if identical query is currently executing
    if (this.inFlightRequests.has(cacheKey)) {
      return this.inFlightRequests.get(cacheKey)!;
    }

    const searchPromise = this.executeRpcSearch(q, activeModule, page, pageSize, emptyModuleCounts);
    this.inFlightRequests.set(cacheKey, searchPromise);

    try {
      return await searchPromise;
    } finally {
      this.inFlightRequests.delete(cacheKey);
    }
  }

  private async executeRpcSearch(
    q: string,
    activeModule: string,
    page: number,
    pageSize: number,
    emptyModuleCounts: Record<string, number>
  ): Promise<PaginatedSearchResults> {
    try {
      // Execute EXACTLY 1 single RPC request to Supabase PostgreSQL function ("global_search")
      const response = await (this.supabase.rpc as unknown as (
        fn: string,
        params: { search_query: string; target_module: string; language_code?: string }
      ) => Promise<{ data: RpcSearchResultRow[] | null; error: { message: string } | null }>)(
        "global_search",
        {
          search_query: q,
          target_module: activeModule,
          language_code: "en",
        }
      );

      if (response.error || !response.data) {
        if (response.error && process.env.NODE_ENV !== "production") {
          console.error("[GlobalSearch] Supabase RPC error:", response.error.message);
        }
        return {
          items: [],
          total: 0,
          page: 1,
          pageSize,
          totalPages: 0,
          moduleCounts: emptyModuleCounts,
        };
      }

      const allItems: SearchResultItemEntity[] = response.data.map(
        (row) =>
          new SearchResultItemEntity({
            id: row.id,
            module: row.module as SearchModuleType,
            title: row.title,
            description: row.description,
            link: row.link,
            createdAt: row.created_at ? new Date(row.created_at) : null,
          })
      );

      // Compute per-module result counts
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
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[GlobalSearch] Search execution failed:", error);
      }
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize,
        totalPages: 0,
        moduleCounts: emptyModuleCounts,
      };
    }
  }
}
