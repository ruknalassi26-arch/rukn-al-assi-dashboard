// ==============================================================================
// features/analytics/data/mapper/website-analytics.mapper.ts
// Maps RPC DTO response to WebsiteAnalyticsEntity domain model
// ==============================================================================
import type { GetWebsiteAnalyticsResponseDto } from "../dto/website-analytics.dto";
import { WebsiteAnalyticsEntity } from "../../domain/entities/website-analytics.entity";

export function mapWebsiteAnalyticsDtoToEntity(
  dto: GetWebsiteAnalyticsResponseDto
): WebsiteAnalyticsEntity {
  const current = dto.summary?.totalPageViews ?? 0;
  const prev = dto.summary?.previousPeriodViews ?? 0;
  let growthPercentage = 0;
  if (prev > 0) {
    growthPercentage = Math.round(((current - prev) / prev) * 100);
  } else if (current > 0) {
    growthPercentage = 100;
  }

  return new WebsiteAnalyticsEntity({
    summary: {
      totalPageViews: dto.summary?.totalPageViews ?? 0,
      uniqueSessions: dto.summary?.uniqueSessions ?? 0,
      todayViews: dto.summary?.todayViews ?? 0,
      previousPeriodViews: prev,
      growthPercentage,
    },
    viewsOverTime: (dto.viewsOverTime ?? []).map((item) => ({
      date: item.date,
      pageViews: item.page_views ?? 0,
      uniqueSessions: item.unique_sessions ?? 0,
    })),
    topPages: (dto.topPages ?? []).map((item) => ({
      path: item.path,
      pageViews: item.page_views ?? 0,
      uniqueSessions: item.unique_sessions ?? 0,
    })),
    countries: (dto.countries ?? []).map((item) => ({
      country: item.country,
      pageViews: item.page_views ?? 0,
      uniqueSessions: item.unique_sessions ?? 0,
    })),
    devices: (dto.devices ?? []).map((item) => ({
      deviceType: item.device_type,
      pageViews: item.page_views ?? 0,
      uniqueSessions: item.unique_sessions ?? 0,
    })),
    browsers: (dto.browsers ?? []).map((item) => ({
      browser: item.browser,
      pageViews: item.page_views ?? 0,
      uniqueSessions: item.unique_sessions ?? 0,
    })),
    referrers: (dto.referrers ?? []).map((item) => ({
      referrer: item.referrer,
      pageViews: item.page_views ?? 0,
      uniqueSessions: item.unique_sessions ?? 0,
    })),
    campaigns: (dto.campaigns ?? []).map((item) => ({
      utmSource: item.utm_source,
      utmMedium: item.utm_medium,
      utmCampaign: item.utm_campaign,
      pageViews: item.page_views ?? 0,
      uniqueSessions: item.unique_sessions ?? 0,
    })),
  });
}
