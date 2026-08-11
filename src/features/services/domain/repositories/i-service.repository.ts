// ==============================================================================
// features/services/domain/repositories/i-service.repository.ts
// Domain Repository Interface for Services Management strictly matching DB schema
// ==============================================================================
import type { ServiceEntity, ServiceStatus } from "../entities/service.entity";

export interface ServiceFilterParams {
  search?: string;
  status?: ServiceStatus | "all";
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedServices {
  items: ServiceEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceTranslationInput {
  slug: string;
  name: string;
  description?: string | null;
  applications?: string | null;
}

export interface CreateServiceInput {
  icon?: string | null;
  heroImageUrl?: string | null;
  status?: ServiceStatus;
  isFeatured?: boolean;
  featuredOrder?: number;
  sortOrder?: number;
  translations: Record<string, ServiceTranslationInput>;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  id: string;
}

export interface IServiceRepository {
  getServices(params?: ServiceFilterParams): Promise<PaginatedServices>;
  getServiceById(id: string): Promise<ServiceEntity | null>;
  getServiceBySlug(slug: string): Promise<ServiceEntity | null>;
  createService(input: CreateServiceInput): Promise<ServiceEntity>;
  updateService(input: UpdateServiceInput): Promise<ServiceEntity>;
  deleteService(id: string): Promise<void>;
  duplicateService(id: string): Promise<ServiceEntity>;
  toggleFeatureService(id: string, isFeatured: boolean): Promise<ServiceEntity>;
  bulkDeleteServices(ids: string[]): Promise<void>;
  bulkUpdateServiceStatus(ids: string[], status: ServiceStatus): Promise<void>;
  checkSlugUnique(slug: string, excludeId?: string): Promise<boolean>;
}
