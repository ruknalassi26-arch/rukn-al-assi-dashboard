// ==============================================================================
// features/projects/data/repositories/supabase-project.repository.ts
// Supabase Data Repository Implementation for Projects & Project Categories
// Strictly matching SQL Schema (projects, project_translations, project_images, project_categories, project_category_translations)
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import { logSystemActivity } from "@core/services/activity-logger.service";
import type {
  IProjectRepository,
  ProjectFilters,
  PaginatedProjects,
  CreateProjectInput,
  UpdateProjectInput,
} from "../../domain/repositories/i-project.repository";
import { ProjectEntity, type ProjectStatus } from "../../domain/entities/project.entity";
import { ProjectCategoryEntity } from "../../domain/entities/project-category.entity";
import { toProjectCategoryEntity } from "../mapper/project-category.mapper";
import type { ProjectCategoryJoinDTO } from "../dto/project-category.dto";

interface TranslationDTO {
  project_id: string;
  language_code: string;
  slug: string | null;
  title: string | null;
  description: string | null;
  challenge: string | null;
  solution: string | null;
}

interface ImageDTO {
  id?: string;
  project_id: string;
  image_url: string;
  mime_type?: string | null;
  sort_order: number;
}

interface ProjectJoinDTO {
  id: string;
  category_id: string | null;
  client_name: string | null;
  location: string | null;
  completion_date: string | null;
  status: string;
  is_featured: boolean;
  featured_order: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  project_translations: TranslationDTO[] | null;
  project_images: ImageDTO[] | null;
}

function mapProjectDTOToEntity(item: ProjectJoinDTO): ProjectEntity {
  const transList = item.project_translations || [];
  const en = transList.find((t) => t.language_code === "en") || { slug: null, title: null, description: null, challenge: null, solution: null };
  const ar = transList.find((t) => t.language_code === "ar") || { slug: null, title: null, description: null, challenge: null, solution: null };
  const ku = transList.find((t) => t.language_code === "ku" || t.language_code === "ckb") || { slug: null, title: null, description: null, challenge: null, solution: null };

  const rawImages = (item.project_images || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const images = rawImages.map((img) => img.image_url);

  return new ProjectEntity({
    id: item.id,
    categoryId: item.category_id ?? null,
    clientName: item.client_name ?? null,
    location: item.location ?? null,
    completionDate: item.completion_date ?? null,
    status: (item.status as ProjectStatus) || "published",
    isFeatured: item.is_featured ?? false,
    featuredOrder: item.featured_order ?? 0,
    sortOrder: item.sort_order ?? 0,

    titleEn: en.title || "Untitled Project",
    titleAr: ar.title || null,
    titleKu: ku.title || null,
    slugEn: en.slug || null,
    slugAr: ar.slug || null,
    slugKu: ku.slug || null,
    descriptionEn: en.description || null,
    descriptionAr: ar.description || null,
    descriptionKu: ku.description || null,
    challengeEn: en.challenge || null,
    challengeAr: ar.challenge || null,
    challengeKu: ku.challenge || null,
    solutionEn: en.solution || null,
    solutionAr: ar.solution || null,
    solutionKu: ku.solution || null,

    images,
    createdAt: item.created_at ? new Date(item.created_at) : new Date(),
    updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
  });
}

export class SupabaseProjectRepository implements IProjectRepository {
  private get supabase() {
    return createClient();
  }

  async getProjectCategories(): Promise<ProjectCategoryEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("project_categories" as any) as any)
        .select("*, project_category_translations(*)")
        .is("deleted_at", null);

      if (error || !data) return [];
      return (data as unknown as ProjectCategoryJoinDTO[]).map(toProjectCategoryEntity);
    } catch {
      return [];
    }
  }

  private async resolveValidCategoryId(categoryId?: string | null): Promise<string | null> {
    if (!categoryId || categoryId === "none" || categoryId.trim() === "") return null;
    try {
      const { data } = await (this.supabase.from("project_categories" as any) as any)
        .select("id")
        .eq("id", categoryId.trim())
        .is("deleted_at", null)
        .maybeSingle();
      return data?.id ?? null;
    } catch {
      return null;
    }
  }

  private async logActivity(
    action: "created" | "updated" | "deleted",
    entityId: string | null,
    entityTitle: string | null,
    metadata?: Record<string, unknown>
  ) {
    await logSystemActivity(this.supabase, action, "project", entityId, {
      entity_title: entityTitle,
      ...metadata,
    });
  }

  async getProjects(filters: ProjectFilters = {}): Promise<PaginatedProjects> {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, filters.pageSize ?? 10));
    const offset = (page - 1) * pageSize;

    try {
      let query = (this.supabase.from("projects" as any) as any)
        .select("*, project_translations(*), project_images(*)", { count: "exact" })
        .is("deleted_at", null);

      if (filters.categoryId && filters.categoryId !== "all") {
        query = query.eq("category_id", filters.categoryId);
      }

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.isFeatured !== undefined) {
        query = query.eq("is_featured", filters.isFeatured);
      }

      const sortBy = filters.sortBy ?? "created_at";
      const ascending = filters.sortOrder === "asc";
      query = query.order(sortBy, { ascending }).range(offset, offset + pageSize - 1);

      const { data, count, error } = await query;

      if (error || !data) {
        return { items: [], total: 0, page, pageSize, totalPages: 0 };
      }

      const rawRows = data as unknown as ProjectJoinDTO[];
      let items = rawRows.map(mapProjectDTOToEntity);

      if (filters.search && filters.search.trim() !== "") {
        const term = filters.search.trim().toLowerCase();
        items = items.filter(
          (item) =>
            item.titleEn.toLowerCase().includes(term) ||
            (item.titleAr && item.titleAr.toLowerCase().includes(term)) ||
            (item.clientName && item.clientName.toLowerCase().includes(term)) ||
            (item.location && item.location.toLowerCase().includes(term))
        );
      }

      const total = count ?? items.length;
      const totalPages = Math.ceil(total / pageSize);

      return { items, total, page, pageSize, totalPages };
    } catch {
      return { items: [], total: 0, page, pageSize, totalPages: 0 };
    }
  }

  async getProjectById(id: string): Promise<ProjectEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("projects" as any) as any)
        .select("*, project_translations(*), project_images(*)")
        .eq("id", id)
        .single();

      if (error || !data) return null;
      return mapProjectDTOToEntity(data as unknown as ProjectJoinDTO);
    } catch {
      return null;
    }
  }

  async createProject(input: CreateProjectInput): Promise<ProjectEntity> {
    const validCategoryId = await this.resolveValidCategoryId(input.categoryId);

    const { data, error } = await (this.supabase.from("projects" as any) as any)
      .insert({
        category_id: validCategoryId,
        client_name: input.clientName || null,
        location: input.location || null,
        completion_date: input.completionDate || null,
        status: input.status ?? "published",
        is_featured: input.isFeatured ?? false,
        featured_order: input.featuredOrder ?? 0,
        sort_order: input.sortOrder ?? 0,
      })
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create project");

    const defaultSlug = input.slugEn || input.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const transPayloads = [];
    if (input.titleEn?.trim()) {
      transPayloads.push({
        project_id: data.id,
        language_code: "en",
        slug: input.slugEn || defaultSlug,
        title: input.titleEn.trim(),
        description: input.descriptionEn || null,
        challenge: input.challengeEn || null,
        solution: input.solutionEn || null,
      });
    }

    if (input.titleAr?.trim()) {
      transPayloads.push({
        project_id: data.id,
        language_code: "ar",
        slug: input.slugAr || input.slugEn || defaultSlug,
        title: input.titleAr.trim(),
        description: input.descriptionAr || null,
        challenge: input.challengeAr || null,
        solution: input.solutionAr || null,
      });
    }

    if (input.titleKu?.trim()) {
      transPayloads.push({
        project_id: data.id,
        language_code: "ku",
        slug: input.slugKu || input.slugEn || defaultSlug,
        title: input.titleKu.trim(),
        description: input.descriptionKu || null,
        challenge: input.challengeKu || null,
        solution: input.solutionKu || null,
      });
    }

    if (transPayloads.length > 0) {
      const { error: transErr } = await (this.supabase.from("project_translations" as any) as any).insert(transPayloads);
      if (transErr) throw new Error(transErr.message || "Failed to save project translations");
    }

    if (input.images && input.images.length > 0) {
      const imagePayloads = input.images.map((url, idx) => ({
        project_id: data.id,
        image_url: url,
        sort_order: idx,
      }));
      await (this.supabase.from("project_images" as any) as any).insert(imagePayloads);
    }

    const created = (await this.getProjectById(data.id))!;
    await this.logActivity("created", created.id, created.titleEn);
    return created;
  }

  async updateProject(input: UpdateProjectInput): Promise<ProjectEntity> {
    const updatePayload: Record<string, any> = {};

    if (input.categoryId !== undefined) {
      updatePayload.category_id = await this.resolveValidCategoryId(input.categoryId);
    }
    if (input.clientName !== undefined) updatePayload.client_name = input.clientName || null;
    if (input.location !== undefined) updatePayload.location = input.location || null;
    if (input.completionDate !== undefined) updatePayload.completion_date = input.completionDate || null;
    if (input.status !== undefined) updatePayload.status = input.status;
    if (input.isFeatured !== undefined) updatePayload.is_featured = input.isFeatured;
    if (input.featuredOrder !== undefined) updatePayload.featured_order = input.featuredOrder;
    if (input.sortOrder !== undefined) updatePayload.sort_order = input.sortOrder;

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await (this.supabase.from("projects" as any) as any)
        .update(updatePayload)
        .eq("id", input.id);
      if (error) throw new Error(error.message);
    }

    const defaultSlug = input.slugEn || input.titleEn?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || input.id;

    // English Translation
    if (input.titleEn !== undefined) {
      if (input.titleEn?.trim()) {
        await (this.supabase.from("project_translations" as any) as any).upsert(
          {
            project_id: input.id,
            language_code: "en",
            slug: input.slugEn || defaultSlug,
            title: input.titleEn.trim(),
            description: input.descriptionEn || null,
            challenge: input.challengeEn || null,
            solution: input.solutionEn || null,
          },
          { onConflict: "project_id,language_code" }
        );
      }
    }

    // Arabic Translation
    if (input.titleAr !== undefined || input.descriptionAr !== undefined || input.challengeAr !== undefined || input.solutionAr !== undefined) {
      if (input.titleAr?.trim()) {
        await (this.supabase.from("project_translations" as any) as any).upsert(
          {
            project_id: input.id,
            language_code: "ar",
            slug: input.slugAr || input.slugEn || defaultSlug,
            title: input.titleAr.trim(),
            description: input.descriptionAr || null,
            challenge: input.challengeAr || null,
            solution: input.solutionAr || null,
          },
          { onConflict: "project_id,language_code" }
        );
      } else {
        await (this.supabase.from("project_translations" as any) as any)
          .delete()
          .eq("project_id", input.id)
          .eq("language_code", "ar");
      }
    }

    // Kurdish Translation
    if (input.titleKu !== undefined || input.descriptionKu !== undefined || input.challengeKu !== undefined || input.solutionKu !== undefined) {
      if (input.titleKu?.trim()) {
        await (this.supabase.from("project_translations" as any) as any).upsert(
          {
            project_id: input.id,
            language_code: "ku",
            slug: input.slugKu || input.slugEn || defaultSlug,
            title: input.titleKu.trim(),
            description: input.descriptionKu || null,
            challenge: input.challengeKu || null,
            solution: input.solutionKu || null,
          },
          { onConflict: "project_id,language_code" }
        );
      } else {
        await (this.supabase.from("project_translations" as any) as any)
          .delete()
          .eq("project_id", input.id)
          .eq("language_code", "ku");
      }
    }

    // Update Images
    if (input.images !== undefined) {
      await (this.supabase.from("project_images" as any) as any)
        .delete()
        .eq("project_id", input.id);

      if (input.images.length > 0) {
        const imagePayloads = input.images.map((url, idx) => ({
          project_id: input.id,
          image_url: url,
          sort_order: idx,
        }));
        await (this.supabase.from("project_images" as any) as any).insert(imagePayloads);
      }
    }

    const updated = (await this.getProjectById(input.id))!;
    await this.logActivity("updated", updated.id, updated.titleEn);
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    const existing = await this.getProjectById(id);
    await (this.supabase.from("projects" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    await this.logActivity("deleted", id, existing?.titleEn ?? "Project");
  }

  async bulkDeleteProjects(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await (this.supabase.from("projects" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids);

    await this.logActivity("deleted", null, `Bulk deleted ${ids.length} projects`);
  }

  async toggleProjectStatus(id: string, status: ProjectStatus): Promise<ProjectEntity> {
    await (this.supabase.from("projects" as any) as any)
      .update({ status })
      .eq("id", id);

    const updated = (await this.getProjectById(id))!;
    await this.logActivity("updated", id, `Changed status to ${status}`);
    return updated;
  }

  async toggleProjectFeatured(id: string, isFeatured: boolean): Promise<ProjectEntity> {
    await (this.supabase.from("projects" as any) as any)
      .update({ is_featured: isFeatured })
      .eq("id", id);

    const updated = (await this.getProjectById(id))!;
    await this.logActivity("updated", id, `Featured set to ${isFeatured}`);
    return updated;
  }
}
