// ==============================================================================
// features/analytics/domain/usecases/get-website-analytics.usecase.ts
// Use Case to fetch website traffic analytics using repository pattern
// ==============================================================================
import type {
  IWebsiteAnalyticsRepository,
  AnalyticsQueryParams,
} from "../repositories/i-website-analytics.repository";
import type { WebsiteAnalyticsEntity } from "../entities/website-analytics.entity";

export class GetWebsiteAnalyticsUseCase {
  constructor(private readonly repository: IWebsiteAnalyticsRepository) {}

  async execute(params: AnalyticsQueryParams): Promise<WebsiteAnalyticsEntity> {
    return this.repository.getWebsiteAnalytics(params);
  }
}
