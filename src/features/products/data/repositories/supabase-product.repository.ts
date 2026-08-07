// ==============================================================================
// features/products/data/repositories/supabase-product.repository.ts
// Supabase Data Repository Implementation for Products Management
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { UpdateTables } from "@core/types/database.types";
import type {
  IProductRepository,
  ProductFilterParams,
  PaginatedProducts,
  CreateProductInput,
  UpdateProductInput,
} from "../../domain/repositories/i-product.repository";
import { ProductEntity, ProductCategoryEntity } from "../../domain/entities/product.entity";
import type { ProductStatus } from "../../domain/entities/product.entity";
import { toProductEntity, toProductCategoryEntity } from "../mapper/product.mapper";
import type { ProductWithCategoryDTO, ProductCategoryDTO } from "../dto/product.dto";

export class SupabaseProductRepository implements IProductRepository {
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
    const sortBy = params?.sortBy ?? "created_at";
    const sortOrder = params?.sortOrder ?? "desc";

    let query = this.supabase
      .from("products")
      .select("*, product_categories(*)", { count: "exact" });

    // Search filter
    if (params?.search && params.search.trim() !== "") {
      const searchStr = params.search.trim();
      query = query.or(`name_en.ilike.%${searchStr}%,name_ar.ilike.%${searchStr}%,slug.ilike.%${searchStr}%`);
    }

    // Category filter
    if (params?.categoryId && params.categoryId !== "all") {
      query = query.eq("category_id", params.categoryId);
    }

    // Status filter
    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    // Featured filter
    if (params?.isFeatured !== undefined) {
      query = query.eq("is_featured", params.isFeatured);
    }

    // Sorting & Pagination
    query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error || !data) {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }

    const items = (data as ProductWithCategoryDTO[]).map(toProductEntity);
    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getProductById(id: string): Promise<ProductEntity | null> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, product_categories(*)")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toProductEntity(data as ProductWithCategoryDTO);
  }

  async getProductBySlug(slug: string): Promise<ProductEntity | null> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*, product_categories(*)")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return toProductEntity(data as ProductWithCategoryDTO);
  }

  async createProduct(input: CreateProductInput): Promise<ProductEntity> {
    const payload = {
      slug: input.slug,
      name_en: input.nameEn,
      name_ar: input.nameAr,
      short_description_en: input.shortDescriptionEn ?? null,
      short_description_ar: input.shortDescriptionAr ?? null,
      description_en: input.descriptionEn ?? null,
      description_ar: input.descriptionAr ?? null,
      seo_title_en: input.seoTitleEn ?? null,
      seo_title_ar: input.seoTitleAr ?? null,
      seo_description_en: input.seoDescriptionEn ?? null,
      seo_description_ar: input.seoDescriptionAr ?? null,
      category_id: input.categoryId ?? null,
      images: input.images ?? [],
      thumbnail: input.thumbnail ?? (input.images && input.images.length > 0 ? input.images[0] : null),
      datasheet_url: input.datasheetUrl ?? null,
      seo_image: input.seoImage ?? null,
      status: input.status ?? "active",
      is_featured: input.isFeatured ?? false,
      sort_order: input.sortOrder ?? 0,
    };

    const { data, error } = await this.supabase
      .from("products")
      .insert(payload)
      .select("*, product_categories(*)")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create product");

    const created = toProductEntity(data as ProductWithCategoryDTO);
    await this.logActivity("created", created.id, created.nameEn);
    return created;
  }

  async updateProduct(input: UpdateProductInput): Promise<ProductEntity> {
    const payload: UpdateTables<"products"> = {
      updated_at: new Date().toISOString(),
    };

    if (input.slug !== undefined) payload.slug = input.slug;
    if (input.nameEn !== undefined) payload.name_en = input.nameEn;
    if (input.nameAr !== undefined) payload.name_ar = input.nameAr;
    if (input.shortDescriptionEn !== undefined) payload.short_description_en = input.shortDescriptionEn;
    if (input.shortDescriptionAr !== undefined) payload.short_description_ar = input.shortDescriptionAr;
    if (input.descriptionEn !== undefined) payload.description_en = input.descriptionEn;
    if (input.descriptionAr !== undefined) payload.description_ar = input.descriptionAr;
    if (input.seoTitleEn !== undefined) payload.seo_title_en = input.seoTitleEn;
    if (input.seoTitleAr !== undefined) payload.seo_title_ar = input.seoTitleAr;
    if (input.seoDescriptionEn !== undefined) payload.seo_description_en = input.seoDescriptionEn;
    if (input.seoDescriptionAr !== undefined) payload.seo_description_ar = input.seoDescriptionAr;
    if (input.categoryId !== undefined) payload.category_id = input.categoryId;
    if (input.images !== undefined) payload.images = input.images;
    if (input.thumbnail !== undefined) payload.thumbnail = input.thumbnail;
    if (input.datasheetUrl !== undefined) payload.datasheet_url = input.datasheetUrl;
    if (input.seoImage !== undefined) payload.seo_image = input.seoImage;
    if (input.status !== undefined) payload.status = input.status;
    if (input.isFeatured !== undefined) payload.is_featured = input.isFeatured;
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;

    const { data, error } = await this.supabase
      .from("products")
      .update(payload)
      .eq("id", input.id)
      .select("*, product_categories(*)")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update product");

    const updated = toProductEntity(data as ProductWithCategoryDTO);
    await this.logActivity("updated", updated.id, updated.nameEn);
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    const existing = await this.getProductById(id);

    const { error } = await this.supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.nameEn ?? "Product");
  }

  async duplicateProduct(id: string): Promise<ProductEntity> {
    const original = await this.getProductById(id);
    if (!original) throw new Error("Original product not found");

    const newSlug = `${original.slug}-copy-${Date.now()}`;
    const newNameEn = `${original.nameEn} (Copy)`;
    const newNameAr = `${original.nameAr} (نسخة)`;

    return this.createProduct({
      slug: newSlug,
      nameEn: newNameEn,
      nameAr: newNameAr,
      shortDescriptionEn: original.shortDescriptionEn,
      shortDescriptionAr: original.shortDescriptionAr,
      descriptionEn: original.descriptionEn,
      descriptionAr: original.descriptionAr,
      seoTitleEn: original.seoTitleEn,
      seoTitleAr: original.seoTitleAr,
      seoDescriptionEn: original.seoDescriptionEn,
      seoDescriptionAr: original.seoDescriptionAr,
      categoryId: original.categoryId,
      images: original.images,
      thumbnail: original.thumbnail,
      datasheetUrl: original.datasheetUrl,
      seoImage: original.seoImage,
      status: "draft",
      isFeatured: false,
      sortOrder: original.sortOrder + 1,
    });
  }

  async toggleFeatureProduct(id: string, isFeatured: boolean): Promise<ProductEntity> {
    return this.updateProduct({ id, isFeatured });
  }

  async bulkDeleteProducts(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("products")
      .delete()
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("deleted", null, `${ids.length} products`, { count: ids.length });
  }

  async bulkUpdateProductStatus(ids: string[], status: ProductStatus): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("products")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("updated", null, `Bulk updated status to ${status}`, { ids, status });
  }

  async getCategories(): Promise<ProductCategoryEntity[]> {
    const { data, error } = await this.supabase
      .from("product_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return (data as ProductCategoryDTO[]).map(toProductCategoryEntity);
  }

  async checkSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    let query = this.supabase
      .from("products")
      .select("id")
      .eq("slug", slug);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data } = await query;
    return !data || data.length === 0;
  }
}
