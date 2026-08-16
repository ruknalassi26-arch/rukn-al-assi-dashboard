// ==============================================================================
// features/analytics/domain/repositories/i-website-analytics.repository.ts
// Repository Contract Interface for Website Analytics
// ==============================================================================
import type { WebsiteAnalyticsEntity } from "../entities/website-analytics.entity";

export interface AnalyticsQueryParams {
  startDate: Date;
  endDate: Date;
  languageCode?: string;
}

export interface IWebsiteAnalyticsRepository {
  getWebsiteAnalytics(params: AnalyticsQueryParams): Promise<WebsiteAnalyticsEntity>;
}
