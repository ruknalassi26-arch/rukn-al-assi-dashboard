// ==============================================================================
// features/analytics/data/dto/website-analytics.dto.ts
// DTO Interfaces matching the public.get_admin_website_analytics() RPC response
// ==============================================================================

export interface WebsiteAnalyticsSummaryDto {
  totalPageViews: number;
  uniqueSessions: number;
  todayViews: number;
  previousPeriodViews: number;
}

export interface DailyViewsPointDto {
  date: string;
  page_views: number;
  unique_sessions: number;
}

export interface TopPageStatDto {
  path: string;
  page_views: number;
  unique_sessions: number;
}

export interface CountryStatDto {
  country: string;
  page_views: number;
  unique_sessions: number;
}

export interface DeviceStatDto {
  device_type: string;
  page_views: number;
  unique_sessions: number;
}

export interface BrowserStatDto {
  browser: string;
  page_views: number;
  unique_sessions: number;
}

export interface ReferrerStatDto {
  referrer: string;
  page_views: number;
  unique_sessions: number;
}

export interface CampaignStatDto {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  page_views: number;
  unique_sessions: number;
}

export interface GetWebsiteAnalyticsResponseDto {
  summary: WebsiteAnalyticsSummaryDto;
  viewsOverTime: DailyViewsPointDto[];
  topPages: TopPageStatDto[];
  countries: CountryStatDto[];
  devices: DeviceStatDto[];
  browsers: BrowserStatDto[];
  referrers: ReferrerStatDto[];
  campaigns: CampaignStatDto[];
}
