// ==============================================================================
// features/services/data/repositories/supabase-service.repository.ts
// Supabase Data Repository Implementation for Services Management
// Strictly matching services and service_translations DB schema
// Without querying invalid seo_meta foreign-key relationship
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
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
import type { ServiceWithTranslationsDTO } from "../dto/service.dto";

export class SupabaseServiceRepository implements IServiceRepository {
  private get supabase() {
    return createClient();
  }

  private async getValidLanguageCodes(): Promise<string[]> {
    try {
      const { data } = await (this.supabase.from("languages" as any) as any).select("code");
      if (data && data.length > 0) {
        return data.map((l: any) => l.code);
      }
    } catch {}
    return ["en", "ar", "ku"];
  }

  private resolveLangCode(lang: string, dbCodes: string[]): string {
    if (dbCodes.includes(lang)) return lang;
    if (lang === "ckb" && dbCodes.includes("ku")) return "ku";
    if (lang === "ku" && dbCodes.includes("ckb")) return "ckb";
    if (lang === "en" && dbCodes.includes("en-US")) return "en-US";
    if (lang === "ar" && dbCodes.includes("ar-IQ")) return "ar-IQ";

    const basePrefix = lang.split("-")[0];
    const matched = dbCodes.find((c) => c === basePrefix || c.startsWith(basePrefix + "-"));
    if (matched) return matched;

    return dbCodes[0] || lang;
  }

  private async logActivity(
    action: "created" | "updated" | "deleted",
    entityId: string | null,
    entityTitle: string | null,
    metadata?: Record<string, unknown>
  ) {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      await (this.supabase.from("activity_log" as any) as any).insert({
        action,
        entity_type: "services",
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
    const sortBy = params?.sortBy === "name_en" ? "sort_order" : (params?.sortBy ?? "created_at");
    const sortOrder = params?.sortOrder ?? "desc";

    let query = (this.supabase.from("services" as any) as any)
      .select("*, service_translations(*)", { count: "exact" })
      .is("deleted_at", null);

    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    if (params?.isFeatured !== undefined) {
      query = query.eq("is_featured", params.isFeatured);
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error || !data) {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }

    let items = (data as ServiceWithTranslationsDTO[]).map(toServiceEntity);

    if (params?.search && params.search.trim() !== "") {
      const searchLower = params.search.trim().toLowerCase();
      items = items.filter(
        (serv) =>
          serv.nameEn.toLowerCase().includes(searchLower) ||
          serv.nameAr.toLowerCase().includes(searchLower) ||
          (serv.nameKu && serv.nameKu.toLowerCase().includes(searchLower)) ||
          serv.slug.toLowerCase().includes(searchLower)
      );
    }

    const total = count ?? items.length;
    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getServiceById(id: string): Promise<ServiceEntity | null> {
    const { data, error } = await (this.supabase.from("services" as any) as any)
      .select("*, service_translations(*)")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toServiceEntity(data as ServiceWithTranslationsDTO);
  }

  async getServiceBySlug(slug: string): Promise<ServiceEntity | null> {
    const { data: transData, error: transErr } = await (this.supabase.from("service_translations" as any) as any)
      .select("service_id")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (transErr || !transData?.service_id) return null;
    return this.getServiceById(transData.service_id);
  }

  async checkSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    let query = (this.supabase.from("service_translations" as any) as any)
      .select("service_id")
      .eq("slug", slug);

    if (excludeId) {
      query = query.neq("service_id", excludeId);
    }

    const { data } = await query;
    return !data || data.length === 0;
  }

  async createService(input: CreateServiceInput): Promise<ServiceEntity> {
    // 1. Insert into services (ONLY base table fields)
    const { data, error } = await (this.supabase.from("services" as any) as any)
      .insert({
        icon: input.icon ?? null,
        hero_image_url: input.heroImageUrl ?? null,
        status: input.status ?? "published",
        is_featured: input.isFeatured ?? false,
        featured_order: input.featuredOrder ?? 0,
        sort_order: input.sortOrder ?? 0,
      })
      .select("id")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create service");

    const serviceId = data.id;
    const dbCodes = await this.getValidLanguageCodes();

    // 2. Insert into service_translations
    if (input.translations && Object.keys(input.translations).length > 0) {
      const transPayloads = Object.entries(input.translations)
        .filter(([, val]) => val && val.name && val.name.trim() !== "")
        .map(([lang, val]) => ({
          service_id: serviceId,
          language_code: this.resolveLangCode(lang, dbCodes),
          slug: val.slug,
          name: val.name.trim(),
          description: val.description ?? null,
          applications: val.applications ?? null,
        }));

      if (transPayloads.length > 0) {
        const { error: transErr } = await (this.supabase.from("service_translations" as any) as any)
          .insert(transPayloads);
        if (transErr) throw new Error(transErr.message || "Failed to create service translations");
      }
    }

    const created = await this.getServiceById(serviceId);
    if (!created) throw new Error("Failed to retrieve created service");
    await this.logActivity("created", created.id, created.nameEn);
    return created;
  }

  async updateService(input: UpdateServiceInput): Promise<ServiceEntity> {
    // 1. Update services base table
    const serviceUpdatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (input.icon !== undefined) serviceUpdatePayload.icon = input.icon;
    if (input.heroImageUrl !== undefined) serviceUpdatePayload.hero_image_url = input.heroImageUrl;
    if (input.status !== undefined) serviceUpdatePayload.status = input.status;
    if (input.isFeatured !== undefined) serviceUpdatePayload.is_featured = input.isFeatured;
    if (input.featuredOrder !== undefined) serviceUpdatePayload.featured_order = input.featuredOrder;
    if (input.sortOrder !== undefined) serviceUpdatePayload.sort_order = input.sortOrder;

    const { error: baseErr } = await (this.supabase.from("services" as any) as any)
      .update(serviceUpdatePayload)
      .eq("id", input.id);

    if (baseErr) throw new Error(baseErr.message || "Failed to update service");

    const dbCodes = await this.getValidLanguageCodes();
    const languagesToCheck = ["en", "ar", "ku"];

    // 2. Upsert / Delete service_translations
    if (input.translations) {
      for (const langKey of languagesToCheck) {
        const val = input.translations[langKey];
        const targetLangCode = this.resolveLangCode(langKey, dbCodes);

        if (val && val.name && val.name.trim() !== "") {
          const { error: transErr } = await (this.supabase.from("service_translations" as any) as any)
            .upsert(
              {
                service_id: input.id,
                language_code: targetLangCode,
                slug: val.slug,
                name: val.name.trim(),
                description: val.description ?? null,
                applications: val.applications ?? null,
              },
              { onConflict: "service_id,language_code" }
            );
          if (transErr) throw new Error(transErr.message || "Failed to update service translations");
        } else if (langKey !== "en") {
          await (this.supabase.from("service_translations" as any) as any)
            .delete()
            .eq("service_id", input.id)
            .eq("language_code", targetLangCode);
        }
      }
    }

    const updated = await this.getServiceById(input.id);
    if (!updated) throw new Error("Failed to retrieve updated service");
    await this.logActivity("updated", updated.id, updated.nameEn);
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    const existing = await this.getServiceById(id);

    const { error } = await (this.supabase.from("services" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.nameEn ?? "Service");
  }

  async duplicateService(id: string): Promise<ServiceEntity> {
    const existing = await this.getServiceById(id);
    if (!existing) throw new Error("Service not found");

    const newTranslations: Record<string, any> = {};
    for (const [lang, val] of Object.entries(existing.translations)) {
      newTranslations[lang] = {
        ...val,
        slug: `${val.slug}-copy-${Date.now()}`,
        name: `Copy of ${val.name}`,
      };
    }

    return this.createService({
      icon: existing.icon,
      heroImageUrl: existing.heroImageUrl,
      status: "draft",
      isFeatured: false,
      featuredOrder: 0,
      sortOrder: existing.sortOrder,
      translations: newTranslations,
    });
  }

  async toggleFeatureService(id: string, isFeatured: boolean): Promise<ServiceEntity> {
    return this.updateService({ id, isFeatured });
  }

  async bulkDeleteServices(ids: string[]): Promise<void> {
    const { error } = await (this.supabase.from("services" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .in("id", ids);

    if (error) throw new Error(error.message);
  }

  async bulkUpdateServiceStatus(ids: string[], status: ServiceStatus): Promise<void> {
    const { error } = await (this.supabase.from("services" as any) as any)
      .update({ status })
      .in("id", ids);

    if (error) throw new Error(error.message);
  }
}
