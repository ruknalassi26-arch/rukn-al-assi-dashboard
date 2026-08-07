// ==============================================================================
// features/services/data/repositories/supabase-service.repository.ts
// Supabase Data Repository Implementation for Services Management
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { UpdateTables } from "@core/types/database.types";
import type {
  IServiceRepository,
  ServiceFilterParams,
  PaginatedServices,
  CreateServiceInput,
  UpdateServiceInput,
} from "../../domain/repositories/i-service.repository";
import { ServiceEntity } from "../../domain/entities/service.entity";
import type { ServiceStatus } from "../../domain/entities/service.entity";
import { toServiceEntity } from "../mapper/service.mapper";
import type { ServiceDTO } from "../dto/service.dto";

export class SupabaseServiceRepository implements IServiceRepository {
  private get supabase() {
    return createClient();
  }

  private async logActivity(
    action: "created" | "updated" | "deleted",
    entityId: string | null,
    entityTitle: string | null,
    metadata?: Record<string, unknown>
  ) {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      await this.supabase.from("activity_log").insert({
        action,
        entity_type: "service",
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getServices(params?: ServiceFilterParams): Promise<PaginatedServices> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;
    const sortBy = params?.sortBy ?? "created_at";
    const sortOrder = params?.sortOrder ?? "desc";

    let query = this.supabase
      .from("services")
      .select("*", { count: "exact" });

    // Search filter
    if (params?.search && params.search.trim() !== "") {
      const searchStr = params.search.trim();
      query = query.or(`title_en.ilike.%${searchStr}%,title_ar.ilike.%${searchStr}%,slug.ilike.%${searchStr}%`);
    }

    // Status filter
    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    // Featured filter
    if (params?.isFeatured !== undefined) {
      query = query.eq("is_featured", params.isFeatured);
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error || !data) {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }

    const items = (data as ServiceDTO[]).map(toServiceEntity);
    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getServiceById(id: string): Promise<ServiceEntity | null> {
    const { data, error } = await this.supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toServiceEntity(data as ServiceDTO);
  }

  async getServiceBySlug(slug: string): Promise<ServiceEntity | null> {
    const { data, error } = await this.supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return toServiceEntity(data as ServiceDTO);
  }

  async createService(input: CreateServiceInput): Promise<ServiceEntity> {
    const payload = {
      slug: input.slug,
      title_en: input.titleEn,
      title_ar: input.titleAr,
      title_ku: input.titleKu ?? null,
      short_description_en: input.shortDescriptionEn ?? null,
      short_description_ar: input.shortDescriptionAr ?? null,
      short_description_ku: input.shortDescriptionKu ?? null,
      description_en: input.descriptionEn ?? null,
      description_ar: input.descriptionAr ?? null,
      description_ku: input.descriptionKu ?? null,
      icon: input.icon ?? null,
      image: input.image ?? null,
      seo_title_en: input.seoTitleEn ?? null,
      seo_title_ar: input.seoTitleAr ?? null,
      seo_title_ku: input.seoTitleKu ?? null,
      seo_description_en: input.seoDescriptionEn ?? null,
      seo_description_ar: input.seoDescriptionAr ?? null,
      seo_description_ku: input.seoDescriptionKu ?? null,
      seo_image: input.seoImage ?? null,
      is_featured: input.isFeatured ?? false,
      sort_order: input.sortOrder ?? 0,
      status: input.status ?? "active",
    };

    const { data, error } = await this.supabase
      .from("services")
      .insert(payload)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create service");

    const created = toServiceEntity(data as ServiceDTO);
    await this.logActivity("created", created.id, created.titleEn);
    return created;
  }

  async updateService(input: UpdateServiceInput): Promise<ServiceEntity> {
    const payload: UpdateTables<"services"> = {
      updated_at: new Date().toISOString(),
    };

    if (input.slug !== undefined) payload.slug = input.slug;
    if (input.titleEn !== undefined) payload.title_en = input.titleEn;
    if (input.titleAr !== undefined) payload.title_ar = input.titleAr;
    if (input.titleKu !== undefined) payload.title_ku = input.titleKu;
    if (input.shortDescriptionEn !== undefined) payload.short_description_en = input.shortDescriptionEn;
    if (input.shortDescriptionAr !== undefined) payload.short_description_ar = input.shortDescriptionAr;
    if (input.shortDescriptionKu !== undefined) payload.short_description_ku = input.shortDescriptionKu;
    if (input.descriptionEn !== undefined) payload.description_en = input.descriptionEn;
    if (input.descriptionAr !== undefined) payload.description_ar = input.descriptionAr;
    if (input.descriptionKu !== undefined) payload.description_ku = input.descriptionKu;
    if (input.icon !== undefined) payload.icon = input.icon;
    if (input.image !== undefined) payload.image = input.image;
    if (input.seoTitleEn !== undefined) payload.seo_title_en = input.seoTitleEn;
    if (input.seoTitleAr !== undefined) payload.seo_title_ar = input.seoTitleAr;
    if (input.seoTitleKu !== undefined) payload.seo_title_ku = input.seoTitleKu;
    if (input.seoDescriptionEn !== undefined) payload.seo_description_en = input.seoDescriptionEn;
    if (input.seoDescriptionAr !== undefined) payload.seo_description_ar = input.seoDescriptionAr;
    if (input.seoDescriptionKu !== undefined) payload.seo_description_ku = input.seoDescriptionKu;
    if (input.seoImage !== undefined) payload.seo_image = input.seoImage;
    if (input.isFeatured !== undefined) payload.is_featured = input.isFeatured;
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;
    if (input.status !== undefined) payload.status = input.status;

    const { data, error } = await this.supabase
      .from("services")
      .update(payload)
      .eq("id", input.id)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update service");

    const updated = toServiceEntity(data as ServiceDTO);
    await this.logActivity("updated", updated.id, updated.titleEn);
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    const existing = await this.getServiceById(id);

    const { error } = await this.supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.titleEn ?? "Service");
  }

  async toggleFeatureService(id: string, isFeatured: boolean): Promise<ServiceEntity> {
    return this.updateService({ id, isFeatured });
  }

  async bulkDeleteServices(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("services")
      .delete()
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("deleted", null, `${ids.length} services`, { count: ids.length });
  }

  async bulkUpdateServiceStatus(ids: string[], status: ServiceStatus): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("services")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("updated", null, `Bulk updated status to ${status}`, { ids, status });
  }
}
