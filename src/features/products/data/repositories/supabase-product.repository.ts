// ==============================================================================
// features/products/data/repositories/supabase-product.repository.ts
// Supabase Data Repository Implementation for Products Management
// Strictly matching products, product_translations, product_images, & product_categories DB schema
// Without querying invalid seo_meta foreign-key relationship
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IProductRepository,
  ProductFilterParams,
  PaginatedProducts,
  CreateProductInput,
  UpdateProductInput,
} from "../../domain/repositories/i-product.repository";
import { ProductEntity } from "../../domain/entities/product.entity";
import type { ProductStatus } from "../../domain/entities/product.entity";
import { CategoryEntity } from "@features/categories/domain/entities/category.entity";
import { toCategoryEntity } from "@features/categories/data/mapper/category.mapper";
import { toProductEntity } from "../mapper/product.mapper";
import type { ProductWithRelationsDTO } from "../dto/product.dto";
import type { CategoryWithTranslationsDTO } from "@features/categories/data/dto/category.dto";

export class SupabaseProductRepository implements IProductRepository {
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
        entity_type: "products",
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getProducts(params?: ProductFilterParams): Promise<PaginatedProducts> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;
    const sortBy = params?.sortBy === "name_en" ? "sort_order" : (params?.sortBy ?? "created_at");
    const sortOrder = params?.sortOrder ?? "desc";

    let query = (this.supabase.from("products" as any) as any)
      .select("*, product_translations(*), product_images(*), product_categories(*, product_category_translations(*))", { count: "exact" })
      .is("deleted_at", null);

    if (params?.categoryId && params.categoryId !== "all") {
      query = query.eq("category_id", params.categoryId);
    }

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

    let items = (data as ProductWithRelationsDTO[]).map(toProductEntity);

    if (params?.search && params.search.trim() !== "") {
      const searchLower = params.search.trim().toLowerCase();
      items = items.filter(
        (prod) =>
          prod.nameEn.toLowerCase().includes(searchLower) ||
          prod.nameAr.toLowerCase().includes(searchLower) ||
          (prod.nameKu && prod.nameKu.toLowerCase().includes(searchLower)) ||
          prod.slug.toLowerCase().includes(searchLower) ||
          (prod.sku && prod.sku.toLowerCase().includes(searchLower))
      );
    }

    const total = count ?? items.length;
    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getProductById(id: string): Promise<ProductEntity | null> {
    const { data, error } = await (this.supabase.from("products" as any) as any)
      .select("*, product_translations(*), product_images(*), product_categories(*, product_category_translations(*))")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toProductEntity(data as ProductWithRelationsDTO);
  }

  async getProductBySlug(slug: string): Promise<ProductEntity | null> {
    const { data: transData, error: transErr } = await (this.supabase.from("product_translations" as any) as any)
      .select("product_id")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (transErr || !transData?.product_id) return null;
    return this.getProductById(transData.product_id);
  }

  async checkSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    let query = (this.supabase.from("product_translations" as any) as any)
      .select("product_id")
      .eq("slug", slug);

    if (excludeId) {
      query = query.neq("product_id", excludeId);
    }

    const { data } = await query;
    return !data || data.length === 0;
  }

  async createProduct(input: CreateProductInput): Promise<ProductEntity> {
    // 1. Insert into products (ONLY base table fields)
    const { data, error } = await (this.supabase.from("products" as any) as any)
      .insert({
        category_id: input.categoryId ?? null,
        sku: input.sku ?? null,
        datasheet_url: input.datasheetUrl ?? null,
        status: input.status ?? "published",
        is_featured: input.isFeatured ?? false,
        featured_order: input.featuredOrder ?? 0,
        sort_order: input.sortOrder ?? 0,
      })
      .select("id")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create product");

    const productId = data.id;
    const dbCodes = await this.getValidLanguageCodes();

    // 2. Insert into product_translations
    if (input.translations && Object.keys(input.translations).length > 0) {
      const transPayloads = Object.entries(input.translations)
        .filter(([, val]) => val && val.name && val.name.trim() !== "")
        .map(([lang, val]) => ({
          product_id: productId,
          language_code: this.resolveLangCode(lang, dbCodes),
          slug: val.slug,
          name: val.name.trim(),
          short_description: val.shortDescription ?? null,
          specifications: val.specifications ?? null,
        }));

      if (transPayloads.length > 0) {
        const { error: transErr } = await (this.supabase.from("product_translations" as any) as any)
          .insert(transPayloads);
        if (transErr) throw new Error(transErr.message || "Failed to create product translations");
      }
    }

    // 3. Insert into product_images
    if (input.images && input.images.length > 0) {
      const imagePayloads = input.images.map((img) => ({
        product_id: productId,
        image_url: img.imageUrl,
        mime_type: "image/jpeg",
        is_primary: img.isPrimary,
        sort_order: img.sortOrder,
      }));

      const { error: imgErr } = await (this.supabase.from("product_images" as any) as any)
        .insert(imagePayloads);
      if (imgErr) throw new Error(imgErr.message || "Failed to save product images");
    }

    const created = await this.getProductById(productId);
    if (!created) throw new Error("Failed to retrieve created product");
    await this.logActivity("created", created.id, created.nameEn);
    return created;
  }

  async updateProduct(input: UpdateProductInput): Promise<ProductEntity> {
    // 1. Update products base table
    const productUpdatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (input.categoryId !== undefined) productUpdatePayload.category_id = input.categoryId;
    if (input.sku !== undefined) productUpdatePayload.sku = input.sku;
    if (input.datasheetUrl !== undefined) productUpdatePayload.datasheet_url = input.datasheetUrl;
    if (input.status !== undefined) productUpdatePayload.status = input.status;
    if (input.isFeatured !== undefined) productUpdatePayload.is_featured = input.isFeatured;
    if (input.featuredOrder !== undefined) productUpdatePayload.featured_order = input.featuredOrder;
    if (input.sortOrder !== undefined) productUpdatePayload.sort_order = input.sortOrder;

    const { error: baseErr } = await (this.supabase.from("products" as any) as any)
      .update(productUpdatePayload)
      .eq("id", input.id);

    if (baseErr) throw new Error(baseErr.message || "Failed to update product");

    const dbCodes = await this.getValidLanguageCodes();
    const languagesToCheck = ["en", "ar", "ku"];

    // 2. Upsert / Delete product_translations
    if (input.translations) {
      for (const langKey of languagesToCheck) {
        const val = input.translations[langKey];
        const targetLangCode = this.resolveLangCode(langKey, dbCodes);

        if (val && val.name && val.name.trim() !== "") {
          const { error: transErr } = await (this.supabase.from("product_translations" as any) as any)
            .upsert(
              {
                product_id: input.id,
                language_code: targetLangCode,
                slug: val.slug,
                name: val.name.trim(),
                short_description: val.shortDescription ?? null,
                specifications: val.specifications ?? null,
              },
              { onConflict: "product_id,language_code" }
            );
          if (transErr) throw new Error(transErr.message || "Failed to update product translations");
        } else if (langKey !== "en") {
          await (this.supabase.from("product_translations" as any) as any)
            .delete()
            .eq("product_id", input.id)
            .eq("language_code", targetLangCode);
        }
      }
    }

    // 3. Update product_images
    if (input.images !== undefined) {
      await (this.supabase.from("product_images" as any) as any)
        .delete()
        .eq("product_id", input.id);

      if (input.images.length > 0) {
        const imagePayloads = input.images.map((img) => ({
          product_id: input.id,
          image_url: img.imageUrl,
          mime_type: "image/jpeg",
          is_primary: img.isPrimary,
          sort_order: img.sortOrder,
        }));

        const { error: imgErr } = await (this.supabase.from("product_images" as any) as any)
          .insert(imagePayloads);
        if (imgErr) throw new Error(imgErr.message || "Failed to update product images");
      }
    }

    const updated = await this.getProductById(input.id);
    if (!updated) throw new Error("Failed to retrieve updated product");
    await this.logActivity("updated", updated.id, updated.nameEn);
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    const existing = await this.getProductById(id);

    const { error } = await (this.supabase.from("products" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.nameEn ?? "Product");
  }

  async duplicateProduct(id: string): Promise<ProductEntity> {
    const existing = await this.getProductById(id);
    if (!existing) throw new Error("Product not found");

    const newTranslations: Record<string, any> = {};
    for (const [lang, val] of Object.entries(existing.translations)) {
      newTranslations[lang] = {
        ...val,
        slug: `${val.slug}-copy-${Date.now()}`,
        name: `Copy of ${val.name}`,
      };
    }

    return this.createProduct({
      sku: existing.sku ? `${existing.sku}-COPY` : null,
      categoryId: existing.categoryId,
      datasheetUrl: existing.datasheetUrl,
      status: "draft",
      isFeatured: false,
      featuredOrder: 0,
      sortOrder: existing.sortOrder,
      translations: newTranslations,
      images: existing.images,
    });
  }

  async toggleFeatureProduct(id: string, isFeatured: boolean): Promise<ProductEntity> {
    return this.updateProduct({ id, isFeatured });
  }

  async bulkDeleteProducts(ids: string[]): Promise<void> {
    const { error } = await (this.supabase.from("products" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .in("id", ids);

    if (error) throw new Error(error.message);
  }

  async bulkUpdateProductStatus(ids: string[], status: ProductStatus): Promise<void> {
    const { error } = await (this.supabase.from("products" as any) as any)
      .update({ status })
      .in("id", ids);

    if (error) throw new Error(error.message);
  }

  async getCategories(): Promise<CategoryEntity[]> {
    const { data, error } = await (this.supabase.from("product_categories" as any) as any)
      .select("*, product_category_translations(*)")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return (data as CategoryWithTranslationsDTO[]).map(toCategoryEntity);
  }
}
