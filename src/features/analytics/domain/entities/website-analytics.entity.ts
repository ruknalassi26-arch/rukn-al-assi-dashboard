// ==============================================================================
// features/analytics/domain/entities/website-analytics.entity.ts
// Domain Entities for Website Analytics (page_views table aggregates)
// ==============================================================================

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueSessions: number;
  todayViews: number;
  previousPeriodViews: number;
  growthPercentage: number;
}

export interface DailyViewsPoint {
  date: string;
  pageViews: number;
  uniqueSessions: number;
}

export interface TopPageStat {
  path: string;
  pageViews: number;
  uniqueSessions: number;
}

export interface CountryStat {
  country: string;
  pageViews: number;
  uniqueSessions: number;
}

export interface DeviceStat {
  deviceType: string;
  pageViews: number;
  uniqueSessions: number;
}

export interface BrowserStat {
  browser: string;
  pageViews: number;
  uniqueSessions: number;
}

export interface ReferrerStat {
  referrer: string;
  pageViews: number;
  uniqueSessions: number;
}

export interface CampaignStat {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  pageViews: number;
  uniqueSessions: number;
}

export class WebsiteAnalyticsEntity {
  summary: AnalyticsSummary;
  viewsOverTime: DailyViewsPoint[];
  topPages: TopPageStat[];
  countries: CountryStat[];
  devices: DeviceStat[];
  browsers: BrowserStat[];
  referrers: ReferrerStat[];
  campaigns: CampaignStat[];

  constructor(props: {
    summary: AnalyticsSummary;
    viewsOverTime: DailyViewsPoint[];
    topPages: TopPageStat[];
    countries: CountryStat[];
    devices: DeviceStat[];
    browsers: BrowserStat[];
    referrers: ReferrerStat[];
    campaigns: CampaignStat[];
  }) {
    this.summary = props.summary;
    this.viewsOverTime = props.viewsOverTime;
    this.topPages = props.topPages;
    this.countries = props.countries;
    this.devices = props.devices;
    this.browsers = props.browsers;
    this.referrers = props.referrers;
    this.campaigns = props.campaigns;
  }
}
