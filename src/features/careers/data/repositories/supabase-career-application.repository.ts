// ==============================================================================
// features/careers/data/repositories/supabase-career-application.repository.ts
// Supabase Implementation of CareerApplicationRepository
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type {
  CareerApplicationRepository,
  GetCareerApplicationsOptions,
} from "../../domain/repositories/career-application.repository";
import type { CareerApplicationEntity } from "../../domain/entities/career.entity";
import type { ApplicationStatus } from "../../domain/enums/career.enum";
import {
  toCareerApplicationEntity,
  toCareerApplicationInsertPayload,
} from "../mapper/career-application.mapper";

export class SupabaseCareerApplicationRepository implements CareerApplicationRepository {
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

  async getApplications(options?: GetCareerApplicationsOptions): Promise<{ data: CareerApplicationEntity[]; total: number }> {
    let query = (this.supabase.from("career_applications" as any) as any).select(
      "*, job_postings:job_posting_id(id, job_posting_translations(language_code, title))",
      { count: "exact" }
    );

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    if (options?.jobId) {
      query = query.eq("job_posting_id", options.jobId);
    }

    if (options?.search && options.search.trim() !== "") {
      const search = options.search.trim();
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    query = query.order("created_at", { ascending: false });

    if (typeof options?.limit === "number") {
      const offset = options.offset ?? 0;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    return {
      data: (data ?? []).map((r: any) => toCareerApplicationEntity(r)),
      total: count ?? 0,
    };
  }

  async getApplicationById(id: string): Promise<CareerApplicationEntity | null> {
    const { data, error } = await (this.supabase.from("career_applications" as any) as any)
      .select("*, job_postings:job_posting_id(id, job_posting_translations(language_code, title))")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? toCareerApplicationEntity(data) : null;
  }

  async submitApplication(application: Omit<CareerApplicationEntity, "id" | "createdAt" | "updatedAt">): Promise<CareerApplicationEntity> {
    const payload = toCareerApplicationInsertPayload(application);

    const { data, error } = await (this.supabase.from("career_applications" as any) as any)
      .insert(payload)
      .select("*, job_postings:job_posting_id(id, job_posting_translations(language_code, title))")
      .single();

    if (error) throw new Error(error.message);

    const entity = toCareerApplicationEntity(data);
    await this.logActivity("created", entity.id, `Application from ${entity.applicantName}`);
    return entity;
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string | null): Promise<CareerApplicationEntity> {
    const payload: Record<string, any> = {
      status,
    };

    const { data, error } = await (this.supabase.from("career_applications" as any) as any)
      .update(payload)
      .eq("id", id)
      .select("*, job_postings:job_posting_id(id, job_posting_translations(language_code, title))")
      .single();

    if (error) throw new Error(error.message);

    const entity = toCareerApplicationEntity(data);
    await this.logActivity("updated", entity.id, `Application status: ${status}`);
    return entity;
  }

  async deleteApplication(id: string): Promise<void> {
    const existing = await this.getApplicationById(id);
    const { error } = await (this.supabase.from("career_applications" as any) as any)
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.applicantName ?? null);
  }

  async uploadCv(file: File): Promise<{ url: string; fileName: string }> {
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filePath = `cv_${timestamp}_${randomStr}.${fileExt}`;

    const { data, error } = await this.supabase.storage
      .from("career-cvs")
      .upload(filePath, file, { upsert: true });

    if (error) {
      throw new Error(`Failed to upload CV file: ${error.message}`);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from("career-cvs")
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      fileName: file.name,
    };
  }
}
