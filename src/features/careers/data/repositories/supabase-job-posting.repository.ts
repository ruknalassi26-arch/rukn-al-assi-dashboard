// ==============================================================================
// features/careers/data/repositories/supabase-job-posting.repository.ts
// Supabase Implementation of JobPostingRepository
// Strictly matching SQL schema: job_postings + job_posting_translations
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type {
  JobPostingRepository,
  GetJobPostingsOptions,
} from "../../domain/repositories/job-posting.repository";
import type { JobPostingEntity } from "../../domain/entities/career.entity";
import type { JobPostingStatus } from "../../domain/enums/career.enum";

interface JobPostingTranslationDTO {
  job_posting_id: string;
  language_code: string;
  slug: string | null;
  title: string | null;
  description: string | null;
  requirements: string | null;
}

interface JobPostingJoinDTO {
  id: string;
  department: string | null;
  employment_type: string;
  location: string | null;
  closes_at: string | null;
  sort_order: number;
  status: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  job_posting_translations: JobPostingTranslationDTO[] | null;
}

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

  private mapToEntity(row: JobPostingJoinDTO): JobPostingEntity {
    const transList = row.job_posting_translations || [];
    const emptyTrans: Partial<JobPostingTranslationDTO> = {};
    const en = transList.find((t) => t.language_code === "en") || emptyTrans;
    const ar = transList.find((t) => t.language_code === "ar") || emptyTrans;
    const ku = transList.find((t) => t.language_code === "ku" || t.language_code === "ckb") || emptyTrans;

    return {
      id: row.id,
      slug: en.slug || ar.slug || ku.slug || row.id,
      titleEn: en.title || "Untitled Job",
      titleAr: ar.title || null,
      titleKu: ku.title || null,
      descriptionEn: en.description || null,
      descriptionAr: ar.description || null,
      descriptionKu: ku.description || null,
      requirementsEn: en.requirements || null,
      requirementsAr: ar.requirements || null,
      requirementsKu: ku.requirements || null,
      department: row.department ?? null,
      employmentType: (row.employment_type as any) ?? "full_time",
      location: row.location ?? null,
      closingDate: row.closes_at ?? null,
      sortOrder: row.sort_order ?? 0,
      status: (row.status as any) ?? "draft",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getPostings(options?: GetJobPostingsOptions): Promise<{ data: JobPostingEntity[]; total: number }> {
    let query = (this.supabase.from("job_postings" as any) as any)
      .select("*, job_posting_translations(*)", { count: "exact" })
      .is("deleted_at", null);

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    query = query.order("sort_order", { ascending: true }).order("created_at", { ascending: false });

    if (typeof options?.limit === "number") {
      const offset = options.offset ?? 0;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    let items = (data as unknown as JobPostingJoinDTO[] ?? []).map((r) => this.mapToEntity(r));

    if (options?.search && options.search.trim() !== "") {
      const term = options.search.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.titleEn.toLowerCase().includes(term) ||
          (item.titleAr && item.titleAr.toLowerCase().includes(term)) ||
          (item.department && item.department.toLowerCase().includes(term)) ||
          (item.location && item.location.toLowerCase().includes(term))
      );
    }

    return {
      data: items,
      total: count ?? items.length,
    };
  }

  async getPostingById(id: string): Promise<JobPostingEntity | null> {
    const { data, error } = await (this.supabase.from("job_postings" as any) as any)
      .select("*, job_posting_translations(*)")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToEntity(data as unknown as JobPostingJoinDTO);
  }

  async getPostingBySlug(slug: string): Promise<JobPostingEntity | null> {
    // Query job_posting_translations to find matching job_posting_id
    const { data: trans } = await (this.supabase.from("job_posting_translations" as any) as any)
      .select("job_posting_id")
      .eq("slug", slug)
      .maybeSingle();

    if (!trans?.job_posting_id) return null;
    return this.getPostingById(trans.job_posting_id);
  }

  async getPublishedPostings(): Promise<JobPostingEntity[]> {
    const { data, error } = await (this.supabase.from("job_postings" as any) as any)
      .select("*, job_posting_translations(*)")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return (data as unknown as JobPostingJoinDTO[]).map((r) => this.mapToEntity(r));
  }

  async createPosting(posting: Omit<JobPostingEntity, "id" | "createdAt" | "updatedAt">): Promise<JobPostingEntity> {
    const jobPayload = {
      department: posting.department ?? null,
      employment_type: posting.employmentType,
      location: posting.location ?? null,
      closes_at: posting.closingDate ?? null,
      sort_order: posting.sortOrder ?? 0,
      status: posting.status ?? "draft",
    };

    const { data, error } = await (this.supabase.from("job_postings" as any) as any)
      .insert(jobPayload)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create job posting");

    const defaultSlug = posting.slug || posting.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const transPayloads = [];

    if (posting.titleEn?.trim()) {
      transPayloads.push({
        job_posting_id: data.id,
        language_code: "en",
        slug: defaultSlug,
        title: posting.titleEn.trim(),
        description: posting.descriptionEn || null,
        requirements: posting.requirementsEn || null,
      });
    }

    if (posting.titleAr?.trim()) {
      transPayloads.push({
        job_posting_id: data.id,
        language_code: "ar",
        slug: defaultSlug,
        title: posting.titleAr.trim(),
        description: posting.descriptionAr || null,
        requirements: posting.requirementsAr || null,
      });
    }

    if (posting.titleKu?.trim()) {
      transPayloads.push({
        job_posting_id: data.id,
        language_code: "ku",
        slug: defaultSlug,
        title: posting.titleKu.trim(),
        description: posting.descriptionKu || null,
        requirements: posting.requirementsKu || null,
      });
    }

    if (transPayloads.length > 0) {
      const { error: transErr } = await (this.supabase.from("job_posting_translations" as any) as any)
        .insert(transPayloads);
      if (transErr) throw new Error(transErr.message || "Failed to save job posting translations");
    }

    const created = (await this.getPostingById(data.id))!;
    await this.logActivity("created", created.id, created.titleEn);
    return created;
  }

  async updatePosting(
    id: string,
    posting: Partial<Omit<JobPostingEntity, "id" | "createdAt" | "updatedAt">>
  ): Promise<JobPostingEntity> {
    const jobPayload: Record<string, any> = {};
    if (posting.department !== undefined) jobPayload.department = posting.department || null;
    if (posting.employmentType !== undefined) jobPayload.employment_type = posting.employmentType;
    if (posting.location !== undefined) jobPayload.location = posting.location || null;
    if (posting.closingDate !== undefined) jobPayload.closes_at = posting.closingDate || null;
    if (posting.sortOrder !== undefined) jobPayload.sort_order = posting.sortOrder;
    if (posting.status !== undefined) jobPayload.status = posting.status;
    jobPayload.updated_at = new Date().toISOString();

    if (Object.keys(jobPayload).length > 0) {
      const { error } = await (this.supabase.from("job_postings" as any) as any)
        .update(jobPayload)
        .eq("id", id);
      if (error) throw new Error(error.message);
    }

    const defaultSlug = posting.slug || posting.titleEn?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || id;

    // English Translation
    if (posting.titleEn !== undefined) {
      if (posting.titleEn?.trim()) {
        await (this.supabase.from("job_posting_translations" as any) as any).upsert(
          {
            job_posting_id: id,
            language_code: "en",
            slug: defaultSlug,
            title: posting.titleEn.trim(),
            description: posting.descriptionEn || null,
            requirements: posting.requirementsEn || null,
          },
          { onConflict: "job_posting_id,language_code" }
        );
      }
    }

    // Arabic Translation
    if (posting.titleAr !== undefined || posting.descriptionAr !== undefined || posting.requirementsAr !== undefined) {
      if (posting.titleAr?.trim()) {
        await (this.supabase.from("job_posting_translations" as any) as any).upsert(
          {
            job_posting_id: id,
            language_code: "ar",
            slug: defaultSlug,
            title: posting.titleAr.trim(),
            description: posting.descriptionAr || null,
            requirements: posting.requirementsAr || null,
          },
          { onConflict: "job_posting_id,language_code" }
        );
      } else {
        await (this.supabase.from("job_posting_translations" as any) as any)
          .delete()
          .eq("job_posting_id", id)
          .eq("language_code", "ar");
      }
    }

    // Kurdish Translation
    if (posting.titleKu !== undefined || posting.descriptionKu !== undefined || posting.requirementsKu !== undefined) {
      if (posting.titleKu?.trim()) {
        await (this.supabase.from("job_posting_translations" as any) as any).upsert(
          {
            job_posting_id: id,
            language_code: "ku",
            slug: defaultSlug,
            title: posting.titleKu.trim(),
            description: posting.descriptionKu || null,
            requirements: posting.requirementsKu || null,
          },
          { onConflict: "job_posting_id,language_code" }
        );
      } else {
        await (this.supabase.from("job_posting_translations" as any) as any)
          .delete()
          .eq("job_posting_id", id)
          .eq("language_code", "ku");
      }
    }

    const updated = (await this.getPostingById(id))!;
    await this.logActivity("updated", updated.id, updated.titleEn);
    return updated;
  }

  async deletePosting(id: string): Promise<void> {
    const existing = await this.getPostingById(id);
    const { error } = await (this.supabase.from("job_postings" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.titleEn ?? null);
  }

  async updatePostingStatus(id: string, status: JobPostingStatus): Promise<JobPostingEntity> {
    return this.updatePosting(id, { status });
  }
}
