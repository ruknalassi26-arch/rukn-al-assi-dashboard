// ==============================================================================
// features/careers/data/repositories/supabase-job-posting.repository.ts
// Supabase Implementation of JobPostingRepository
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type {
  JobPostingRepository,
  GetJobPostingsOptions,
} from "../../domain/repositories/job-posting.repository";
import type { JobPostingEntity } from "../../domain/entities/career.entity";
import type { JobPostingStatus } from "../../domain/enums/career.enum";

export class SupabaseJobPostingRepository implements JobPostingRepository {
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
        entity_type: "career",
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  private mapToEntity(row: any): JobPostingEntity {
    return {
      id: row.id,
      slug: row.slug,
      titleEn: row.title_en,
      titleAr: row.title_ar,
      titleKu: row.title_ku ?? null,
      descriptionEn: row.description_en ?? null,
      descriptionAr: row.description_ar ?? null,
      descriptionKu: row.description_ku ?? null,
      requirementsEn: row.requirements_en ?? null,
      requirementsAr: row.requirements_ar ?? null,
      requirementsKu: row.requirements_ku ?? null,
      department: row.department ?? null,
      employmentType: row.employment_type ?? "full_time",
      location: row.location ?? null,
      closingDate: row.closing_date ?? null,
      sortOrder: row.sort_order ?? 0,
      status: row.status ?? "draft",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getPostings(options?: GetJobPostingsOptions): Promise<{ data: JobPostingEntity[]; total: number }> {
    let query = (this.supabase.from("job_postings" as any) as any).select("*", { count: "exact" });

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    if (options?.search && options.search.trim() !== "") {
      const search = options.search.trim();
      query = query.or(`title_en.ilike.%${search}%,title_ar.ilike.%${search}%,department.ilike.%${search}%,location.ilike.%${search}%`);
    }

    query = query.order("sort_order", { ascending: true }).order("created_at", { ascending: false });

    if (typeof options?.limit === "number") {
      const offset = options.offset ?? 0;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    return {
      data: (data ?? []).map((r: any) => this.mapToEntity(r)),
      total: count ?? 0,
    };
  }

  async getPostingById(id: string): Promise<JobPostingEntity | null> {
    const { data, error } = await (this.supabase.from("job_postings" as any) as any)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? this.mapToEntity(data) : null;
  }

  async getPostingBySlug(slug: string): Promise<JobPostingEntity | null> {
    const { data, error } = await (this.supabase.from("job_postings" as any) as any)
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? this.mapToEntity(data) : null;
  }

  async getPublishedPostings(): Promise<JobPostingEntity[]> {
    const { data, error } = await (this.supabase.from("job_postings" as any) as any)
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map((r: any) => this.mapToEntity(r));
  }

  async createPosting(posting: Omit<JobPostingEntity, "id" | "createdAt" | "updatedAt">): Promise<JobPostingEntity> {
    const payload = {
      slug: posting.slug,
      title_en: posting.titleEn,
      title_ar: posting.titleAr,
      title_ku: posting.titleKu ?? null,
      description_en: posting.descriptionEn ?? null,
      description_ar: posting.descriptionAr ?? null,
      description_ku: posting.descriptionKu ?? null,
      requirements_en: posting.requirementsEn ?? null,
      requirements_ar: posting.requirementsAr ?? null,
      requirements_ku: posting.requirementsKu ?? null,
      department: posting.department ?? null,
      employment_type: posting.employmentType,
      location: posting.location ?? null,
      closing_date: posting.closingDate ?? null,
      sort_order: posting.sortOrder ?? 0,
      status: posting.status ?? "draft",
    };

    const { data, error } = await (this.supabase.from("job_postings" as any) as any)
      .insert(payload)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    const entity = this.mapToEntity(data);
    await this.logActivity("created", entity.id, entity.titleEn);
    return entity;
  }

  async updatePosting(
    id: string,
    posting: Partial<Omit<JobPostingEntity, "id" | "createdAt" | "updatedAt">>
  ): Promise<JobPostingEntity> {
    const payload: Record<string, any> = {};
    if (posting.slug !== undefined) payload.slug = posting.slug;
    if (posting.titleEn !== undefined) payload.title_en = posting.titleEn;
    if (posting.titleAr !== undefined) payload.title_ar = posting.titleAr;
    if (posting.titleKu !== undefined) payload.title_ku = posting.titleKu;
    if (posting.descriptionEn !== undefined) payload.description_en = posting.descriptionEn;
    if (posting.descriptionAr !== undefined) payload.description_ar = posting.descriptionAr;
    if (posting.descriptionKu !== undefined) payload.description_ku = posting.descriptionKu;
    if (posting.requirementsEn !== undefined) payload.requirements_en = posting.requirementsEn;
    if (posting.requirementsAr !== undefined) payload.requirements_ar = posting.requirementsAr;
    if (posting.requirementsKu !== undefined) payload.requirements_ku = posting.requirementsKu;
    if (posting.department !== undefined) payload.department = posting.department;
    if (posting.employmentType !== undefined) payload.employment_type = posting.employmentType;
    if (posting.location !== undefined) payload.location = posting.location;
    if (posting.closingDate !== undefined) payload.closing_date = posting.closingDate;
    if (posting.sortOrder !== undefined) payload.sort_order = posting.sortOrder;
    if (posting.status !== undefined) payload.status = posting.status;
    payload.updated_at = new Date().toISOString();

    const { data, error } = await (this.supabase.from("job_postings" as any) as any)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    const entity = this.mapToEntity(data);
    await this.logActivity("updated", entity.id, entity.titleEn);
    return entity;
  }

  async deletePosting(id: string): Promise<void> {
    const existing = await this.getPostingById(id);
    const { error } = await (this.supabase.from("job_postings" as any) as any)
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.titleEn ?? null);
  }

  async updatePostingStatus(id: string, status: JobPostingStatus): Promise<JobPostingEntity> {
    return this.updatePosting(id, { status });
  }
}
