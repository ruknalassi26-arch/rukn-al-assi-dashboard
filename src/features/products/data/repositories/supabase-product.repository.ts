// ==============================================================================
// features/products/data/repositories/supabase-product.repository.ts
// Concrete Supabase implementation of IProductRepository
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@core/types/database.types";
import type { ListParams, PaginatedResponse } from "@core/types/api.types";
import type { ProductEntity, ProductSummary } from "../../domain/entities/product.entity";
import type { IProductRepository, ProductFilters } from "../../domain/repositories/i-product.repository";
import { toProductEntity, toProductSummary, toProductInsert, toProductUpdate } from "./product.mapper";
import type { ProductSummaryDTO } from "../models/product.dto";

export class SupabaseProductRepository implements IProductRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findAll(
    params: ListParams & ProductFilters
  ): Promise<PaginatedResponse<ProductSummary>> {
    const {
      page = 1,
      pageSize = 10,
      search,
      sortBy = "sort_order",
      sortOrder = "asc",
      status,
      categoryId,
      isFeatured,
    } = params;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.supabase
      .from("products")
      .select(
        "id, slug, name_en, name_ar, images, status, is_featured, sort_order",
        { count: "exact" }
      );

    if (status) query = query.eq("status", status);
    if (categoryId) query = query.eq("category_id", categoryId);
    if (isFeatured !== undefined) query = query.eq("is_featured", isFeatured);
    if (search) {
      query = query.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (error) throw new Error(error.message);

    const total = count ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: (data as ProductSummaryDTO[]).map(toProductSummary),
      meta: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      error: null,
    };
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return toProductEntity(data);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toProductEntity(data);
  }

  async findFeatured(limit: number = 6): Promise<ProductSummary[]> {
    const { data, error } = await this.supabase
      .from("products")
      .select("id, slug, name_en, name_ar, images, status, is_featured, sort_order")
      .eq("is_featured", true)
      .eq("status", "active")
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error || !data) return [];
    return (data as ProductSummaryDTO[]).map(toProductSummary);
  }

  async create(
    data: Omit<ProductEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<ProductEntity> {
    const payload = toProductInsert(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: created, error } = await (this.supabase.from("products") as any)
      .insert(payload)
      .select()
      .single();

    if (error || !created) throw new Error(error?.message ?? "Failed to create product");
    return toProductEntity(created);
  }

  async update(id: string, data: Partial<ProductEntity>): Promise<ProductEntity> {
    const payload = toProductUpdate(data);
    payload.updated_at = new Date().toISOString();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated, error } = await (this.supabase.from("products") as any)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) throw new Error(error?.message ?? "Failed to update product");
    return toProductEntity(updated);
  }

  async archive(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (this.supabase.from("products") as any)
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}
