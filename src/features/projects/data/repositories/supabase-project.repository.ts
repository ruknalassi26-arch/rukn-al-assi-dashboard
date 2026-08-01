// ==============================================================================
// features/projects/data/repositories/supabase-project.repository.ts
// Supabase Data Repository Implementation for Projects
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IProjectRepository,
  ProjectFilters,
  PaginatedProjects,
  CreateProjectInput,
  UpdateProjectInput,
} from "../../domain/repositories/i-project.repository";
import { ProjectEntity, type ProjectStatus } from "../../domain/entities/project.entity";
import { toProjectEntity } from "../mapper/project.mapper";
import type { ProjectDTO } from "../dto/project.dto";

export class SupabaseProjectRepository implements IProjectRepository {
  private get supabase() {
    return createClient();
  }

  async getProjects(filters: ProjectFilters = {}): Promise<PaginatedProjects> {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, filters.pageSize ?? 10));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const sortBy = filters.sortBy ?? "created_at";
    const ascending = filters.sortOrder === "asc";

    let query = (this.supabase as any).from("projects").select("*", { count: "exact" });

    // Search filter across title_en, title_ar, client, location
    if (filters.search && filters.search.trim() !== "") {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`title_en.ilike.${term},title_ar.ilike.${term},client.ilike.${term},location.ilike.${term}`);
    }

    // Category filter
    if (filters.categoryId && filters.categoryId !== "all") {
      query = query.eq("category_id", filters.categoryId);
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    // Featured filter
    if (filters.isFeatured !== undefined) {
      query = query.eq("is_featured", filters.isFeatured);
    }

    // Sorting & Pagination
    query = query.order(sortBy, { ascending }).range(from, to);

    const { data, count, error } = await query;

    if (error || !data) {
      return {
        items: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / pageSize);
    const items = (data as ProjectDTO[]).map((dto) => toProjectEntity(dto));

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getProjectById(id: string): Promise<ProjectEntity | null> {
    const { data, error } = await (this.supabase as any)
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return toProjectEntity(data as ProjectDTO);
  }

  async createProject(input: CreateProjectInput): Promise<ProjectEntity> {
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
      category_id: input.categoryId ?? null,
      client: input.client ?? null,
      location: input.location ?? null,
      year: input.year ?? null,
      completion_date: input.completionDate ?? null,
      cover_image: input.coverImage ?? null,
      images: input.images ?? [],
      status: input.status,
      is_featured: input.isFeatured,
      sort_order: input.sortOrder,
    };

    const { data, error } = await (this.supabase as any)
      .from("projects")
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to create project");
    }

    // Audit log
    await this.logActivity("created", data.id, input.titleEn);

    return toProjectEntity(data as ProjectDTO);
  }

  async updateProject(input: UpdateProjectInput): Promise<ProjectEntity> {
    const payload: Record<string, unknown> = {};

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
    if (input.categoryId !== undefined) payload.category_id = input.categoryId;
    if (input.client !== undefined) payload.client = input.client;
    if (input.location !== undefined) payload.location = input.location;
    if (input.year !== undefined) payload.year = input.year;
    if (input.completionDate !== undefined) payload.completion_date = input.completionDate;
    if (input.coverImage !== undefined) payload.cover_image = input.coverImage;
    if (input.images !== undefined) payload.images = input.images;
    if (input.status !== undefined) payload.status = input.status;
    if (input.isFeatured !== undefined) payload.is_featured = input.isFeatured;
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;

    payload.updated_at = new Date().toISOString();

    const { data, error } = await (this.supabase as any)
      .from("projects")
      .update(payload)
      .eq("id", input.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to update project");
    }

    // Audit log
    await this.logActivity("updated", data.id, input.titleEn || data.title_en);

    return toProjectEntity(data as ProjectDTO);
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await (this.supabase as any)
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message || "Failed to delete project");
    }

    // Audit log
    await this.logActivity("deleted", id, `Project #${id}`);
  }

  async bulkDeleteProjects(ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    const { error } = await (this.supabase as any)
      .from("projects")
      .delete()
      .in("id", ids);

    if (error) {
      throw new Error(error.message || "Failed to bulk delete projects");
    }

    // Audit log
    await this.logActivity("deleted", ids[0], `Bulk deleted ${ids.length} projects`);
  }

  async toggleProjectStatus(id: string, status: ProjectStatus): Promise<ProjectEntity> {
    const { data, error } = await (this.supabase as any)
      .from("projects")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to update project status");
    }

    // Audit log
    await this.logActivity("updated", id, `Changed status to ${status}`);

    return toProjectEntity(data as ProjectDTO);
  }

  async toggleProjectFeatured(id: string, isFeatured: boolean): Promise<ProjectEntity> {
    const { data, error } = await (this.supabase as any)
      .from("projects")
      .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to toggle project featured status");
    }

    // Audit log
    await this.logActivity("updated", id, `Featured set to ${isFeatured}`);

    return toProjectEntity(data as ProjectDTO);
  }

  private async logActivity(action: string, entityId: string, entityTitle: string) {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      await (this.supabase as any).from("activity_logs").insert({
        action,
        entity_type: "project",
        entity_id: entityId,
        entity_title: entityTitle,
        user_id: userData?.user?.id ?? null,
        user_email: userData?.user?.email ?? null,
      });
    } catch {
      // Non-blocking fallback
    }
  }
}
