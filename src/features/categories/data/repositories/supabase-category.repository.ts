// ==============================================================================
// features/categories/data/repositories/supabase-category.repository.ts
// Supabase Data Repository Implementation for Categories Management
// Strictly matching product_categories and product_category_translations DB schema
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  ICategoryRepository,
  CategoryFilterParams,
  PaginatedCategories,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../domain/repositories/i-category.repository";
import { CategoryEntity } from "../../domain/entities/category.entity";
import { toCategoryEntity } from "../mapper/category.mapper";
import type { CategoryWithTranslationsDTO } from "../dto/category.dto";

export class SupabaseCategoryRepository implements ICategoryRepository {
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
    const sortBy = params?.sortBy === "name_en" ? "sort_order" : (params?.sortBy ?? "sort_order");
    const sortOrder = params?.sortOrder ?? "asc";

    let query = (this.supabase.from("product_categories" as any) as any)
      .select("*, product_category_translations(*)", { count: "exact" })
      .is("deleted_at", null);

    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error || !data) {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }

    let items = (data as CategoryWithTranslationsDTO[]).map(toCategoryEntity);

    if (params?.search && params.search.trim() !== "") {
      const searchLower = params.search.trim().toLowerCase();
      items = items.filter(
        (cat) =>
          cat.nameEn.toLowerCase().includes(searchLower) ||
          cat.nameAr.toLowerCase().includes(searchLower) ||
          (cat.nameKu && cat.nameKu.toLowerCase().includes(searchLower)) ||
          cat.slug.toLowerCase().includes(searchLower)
      );
    }

    const total = count ?? items.length;
    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getCategoryById(id: string): Promise<CategoryEntity | null> {
    const { data, error } = await (this.supabase.from("product_categories" as any) as any)
      .select("*, product_category_translations(*)")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toCategoryEntity(data as CategoryWithTranslationsDTO);
  }

  async getCategoryBySlug(slug: string): Promise<CategoryEntity | null> {
    const { data: transData, error: transErr } = await (this.supabase.from("product_category_translations" as any) as any)
      .select("product_category_id")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (transErr || !transData?.product_category_id) return null;
    return this.getCategoryById(transData.product_category_id);
  }

  async createCategory(input: CreateCategoryInput): Promise<CategoryEntity> {
    // 1. Insert into product_categories (ONLY image_url, status, sort_order)
    const { data, error } = await (this.supabase.from("product_categories" as any) as any)
      .insert({
        image_url: input.imageUrl ?? null,
        status: input.status ?? "published",
        sort_order: input.sortOrder ?? 0,
      })
      .select("id")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create product category");

    const categoryId = data.id;
    const dbCodes = await this.getValidLanguageCodes();

    // 2. Insert into product_category_translations
    if (input.translations && Object.keys(input.translations).length > 0) {
      const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
        product_category_id: categoryId,
        language_code: this.resolveLangCode(lang, dbCodes),
        slug: val.slug,
        name: val.name,
        description: val.description ?? null,
      }));

      const { error: transErr } = await (this.supabase.from("product_category_translations" as any) as any)
        .insert(transPayloads);

      if (transErr) throw new Error(transErr.message || "Failed to create category translations");
    }

    const created = await this.getCategoryById(categoryId);
    if (!created) throw new Error("Failed to retrieve created category");
    await this.logActivity("created", created.id, created.nameEn);
    return created;
  }

  async updateCategory(input: UpdateCategoryInput): Promise<CategoryEntity> {
    // 1. Update product_categories (ONLY image_url, status, sort_order)
    const categoryUpdatePayload: Record<string, any> = {};
    if (input.imageUrl !== undefined) categoryUpdatePayload.image_url = input.imageUrl;
    if (input.status !== undefined) categoryUpdatePayload.status = input.status;
    if (input.sortOrder !== undefined) categoryUpdatePayload.sort_order = input.sortOrder;

    if (Object.keys(categoryUpdatePayload).length > 0) {
      const { error: baseErr } = await (this.supabase.from("product_categories" as any) as any)
        .update(categoryUpdatePayload)
        .eq("id", input.id);

      if (baseErr) throw new Error(baseErr.message || "Failed to update product category");
    }

    // 2. Upsert product_category_translations
    if (input.translations && Object.keys(input.translations).length > 0) {
      const dbCodes = await this.getValidLanguageCodes();
      const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
        product_category_id: input.id,
        language_code: this.resolveLangCode(lang, dbCodes),
        slug: val.slug,
        name: val.name,
        description: val.description ?? null,
      }));

      for (const payload of transPayloads) {
        const { error: transErr } = await (this.supabase.from("product_category_translations" as any) as any)
          .upsert(payload, { onConflict: "product_category_id,language_code" });
        if (transErr) throw new Error(transErr.message || "Failed to update category translations");
      }
    }

    const updated = await this.getCategoryById(input.id);
    if (!updated) throw new Error("Failed to retrieve updated category");
    await this.logActivity("updated", updated.id, updated.nameEn);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const existing = await this.getCategoryById(id);

    const { error } = await (this.supabase.from("product_categories" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.nameEn ?? "Category");
  }
}
