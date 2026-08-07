// ==============================================================================
// features/categories/data/repositories/supabase-category.repository.ts
// Supabase Data Repository Implementation for Categories Management
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { UpdateTables } from "@core/types/database.types";
import type {
  ICategoryRepository,
  CategoryFilterParams,
  PaginatedCategories,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../domain/repositories/i-category.repository";
import { CategoryEntity } from "../../domain/entities/category.entity";
import { toCategoryEntity } from "../mapper/category.mapper";
import type { CategoryDTO } from "../dto/category.dto";

export class SupabaseCategoryRepository implements ICategoryRepository {
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
      await (this.supabase.from("activity_log" as any) as any).insert({
        action,
        entity_type: "categories",
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getCategories(params?: CategoryFilterParams): Promise<PaginatedCategories> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;
    const sortBy = params?.sortBy ?? "sort_order";
    const sortOrder = params?.sortOrder ?? "asc";

    let query = this.supabase
      .from("product_categories")
      .select("*", { count: "exact" });

    // Search filter
    if (params?.search && params.search.trim() !== "") {
      const searchStr = params.search.trim();
      query = query.or(`name_en.ilike.%${searchStr}%,name_ar.ilike.%${searchStr}%,slug.ilike.%${searchStr}%`);
    }

    // Status filter
    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error || !data) {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }

    const items = (data as CategoryDTO[]).map(toCategoryEntity);
    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getCategoryById(id: string): Promise<CategoryEntity | null> {
    const { data, error } = await this.supabase
      .from("product_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toCategoryEntity(data as CategoryDTO);
  }

  async getCategoryBySlug(slug: string): Promise<CategoryEntity | null> {
    const { data, error } = await this.supabase
      .from("product_categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return toCategoryEntity(data as CategoryDTO);
  }

  async createCategory(input: CreateCategoryInput): Promise<CategoryEntity> {
    const payload = {
      slug: input.slug,
      name_en: input.nameEn,
      name_ar: input.nameAr,
      name_ku: input.nameKu ?? null,
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
      sort_order: input.sortOrder ?? 0,
      status: input.status ?? "active",
    };

    const { data, error } = await this.supabase
      .from("product_categories")
      .insert(payload)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create category");

    const created = toCategoryEntity(data as CategoryDTO);
    await this.logActivity("created", created.id, created.nameEn);
    return created;
  }

  async updateCategory(input: UpdateCategoryInput): Promise<CategoryEntity> {
    const payload: UpdateTables<"product_categories"> = {
      updated_at: new Date().toISOString(),
    };

    if (input.slug !== undefined) payload.slug = input.slug;
    if (input.nameEn !== undefined) payload.name_en = input.nameEn;
    if (input.nameAr !== undefined) payload.name_ar = input.nameAr;
    if (input.nameKu !== undefined) payload.name_ku = input.nameKu;
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
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;
    if (input.status !== undefined) payload.status = input.status;

    const { data, error } = await this.supabase
      .from("product_categories")
      .update(payload)
      .eq("id", input.id)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update category");

    const updated = toCategoryEntity(data as CategoryDTO);
    await this.logActivity("updated", updated.id, updated.nameEn);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const existing = await this.getCategoryById(id);

    const { error } = await this.supabase
      .from("product_categories")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.nameEn ?? "Category");
  }
}
