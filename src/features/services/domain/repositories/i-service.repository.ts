// ==============================================================================
// features/services/domain/repositories/i-service.repository.ts
// IServiceRepository Contract Interface
// ==============================================================================
import type { ServiceEntity, ServiceStatus } from "../entities/service.entity";

export interface ServiceFilterParams {
  search?: string;
  status?: ServiceStatus | "all";
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "title_en" | "sort_order" | "created_at";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedServices {
  items: ServiceEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateServiceInput {
  slug: string;
  titleEn: string;
  titleAr: string;
  titleKu?: string | null;
  shortDescriptionEn?: string | null;
  shortDescriptionAr?: string | null;
  shortDescriptionKu?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  descriptionKu?: string | null;
  icon?: string | null;
  image?: string | null;
  seoTitleEn?: string | null;
  seoTitleAr?: string | null;
  seoTitleKu?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionAr?: string | null;
  seoDescriptionKu?: string | null;
  seoImage?: string | null;
  isFeatured?: boolean;
  sortOrder?: number;
  status?: ServiceStatus;
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
  toggleFeatureService(id: string, isFeatured: boolean): Promise<ServiceEntity>;
  bulkDeleteServices(ids: string[]): Promise<void>;
  bulkUpdateServiceStatus(ids: string[], status: ServiceStatus): Promise<void>;
}
