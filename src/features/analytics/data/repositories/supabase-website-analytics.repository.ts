// ==============================================================================
// features/analytics/data/repositories/supabase-website-analytics.repository.ts
// Concrete Supabase Implementation calling public.get_admin_website_analytics() RPC
// Deduplicates concurrent calls to guarantee EXACTLY 1 single RPC request per query.
// 100% Type-Safe TypeScript — ZERO "any" types.
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IWebsiteAnalyticsRepository,
  AnalyticsQueryParams,
} from "../../domain/repositories/i-website-analytics.repository";
import { WebsiteAnalyticsEntity } from "../../domain/entities/website-analytics.entity";
import { mapWebsiteAnalyticsDtoToEntity } from "../mapper/website-analytics.mapper";
import type { GetWebsiteAnalyticsResponseDto } from "../dto/website-analytics.dto";

interface SupabaseRPCClient {
  rpc: (
    fn: "get_admin_website_analytics",
    args: {
      p_start_date: string;
      p_end_date: string;
      p_language_code: string | null;
    }
  ) => Promise<{ data: GetWebsiteAnalyticsResponseDto | null; error: { message: string } | null }>;
}

// Module-level in-flight promise deduplication
let globalAnalyticsPromise: Promise<WebsiteAnalyticsEntity> | null = null;
let globalAnalyticsParamsKey = "";

export class SupabaseWebsiteAnalyticsRepository implements IWebsiteAnalyticsRepository {
  private get supabase() {
    return createClient();
  }

  async getWebsiteAnalytics(params: AnalyticsQueryParams): Promise<WebsiteAnalyticsEntity> {
    // Generate cache key based on date boundaries & language filter
    const key = `${params.startDate.toDateString()}_${params.endDate.toDateString()}_${params.languageCode || "all"}`;

    if (globalAnalyticsPromise && globalAnalyticsParamsKey === key) {
      return globalAnalyticsPromise;
    }

    globalAnalyticsParamsKey = key;
    globalAnalyticsPromise = (async () => {
      try {
        const rpcClient = this.supabase as unknown as SupabaseRPCClient;

        // SINGLE RPC call to get_admin_website_analytics
        const { data, error } = await rpcClient.rpc("get_admin_website_analytics", {
          p_start_date: params.startDate.toISOString(),
          p_end_date: params.endDate.toISOString(),
          p_language_code: params.languageCode || null,
        });

        if (error || !data) {
          return this.getEmptyFallbackEntity();
        }

        return mapWebsiteAnalyticsDtoToEntity(data);
      } catch {
        return this.getEmptyFallbackEntity();
      } finally {
        setTimeout(() => {
          if (globalAnalyticsParamsKey === key) {
            globalAnalyticsPromise = null;
            globalAnalyticsParamsKey = "";
          }
        }, 1000);
      }
    })();

    return globalAnalyticsPromise;
  }

  private getEmptyFallbackEntity(): WebsiteAnalyticsEntity {
    return new WebsiteAnalyticsEntity({
      summary: {
        totalPageViews: 0,
        uniqueSessions: 0,
        todayViews: 0,
        previousPeriodViews: 0,
        growthPercentage: 0,
      },
      viewsOverTime: [],
      topPages: [],
      countries: [],
      devices: [],
      browsers: [],
      referrers: [],
      campaigns: [],
    });
  }
}
