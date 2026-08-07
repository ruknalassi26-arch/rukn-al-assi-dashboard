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

  private mapToEntity(row: any): CareerApplicationEntity {
    return {
      id: row.id,
      jobId: row.job_id ?? null,
      jobTitle: row.job_title ?? null,
      applicantName: row.applicant_name,
      email: row.email,
      phone: row.phone,
      coverMessage: row.cover_message ?? null,
      cvFileUrl: row.cv_file_url,
      cvFileName: row.cv_file_name,
      status: row.status ?? "new",
      notes: row.notes ?? null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getApplications(options?: GetCareerApplicationsOptions): Promise<{ data: CareerApplicationEntity[]; total: number }> {
    let query = (this.supabase.from("career_applications" as any) as any).select("*", { count: "exact" });

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    if (options?.jobId) {
      query = query.eq("job_id", options.jobId);
    }

    if (options?.search && options.search.trim() !== "") {
      const search = options.search.trim();
      query = query.or(`applicant_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,job_title.ilike.%${search}%`);
    }

    query = query.order("created_at", { ascending: false });

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

  async getApplicationById(id: string): Promise<CareerApplicationEntity | null> {
    const { data, error } = await (this.supabase.from("career_applications" as any) as any)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? this.mapToEntity(data) : null;
  }

  async submitApplication(application: Omit<CareerApplicationEntity, "id" | "createdAt" | "updatedAt">): Promise<CareerApplicationEntity> {
    const payload = {
      job_id: application.jobId ?? null,
      job_title: application.jobTitle ?? null,
      applicant_name: application.applicantName,
      email: application.email,
      phone: application.phone,
      cover_message: application.coverMessage ?? null,
      cv_file_url: application.cvFileUrl,
      cv_file_name: application.cvFileName,
      status: application.status ?? "new",
      notes: application.notes ?? null,
    };

    const { data, error } = await (this.supabase.from("career_applications" as any) as any)
      .insert(payload)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    const entity = this.mapToEntity(data);
    await this.logActivity("created", entity.id, `Application from ${entity.applicantName}`);
    return entity;
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string | null): Promise<CareerApplicationEntity> {
    const payload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (notes !== undefined) {
      payload.notes = notes;
    }

    const { data, error } = await (this.supabase.from("career_applications" as any) as any)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    const entity = this.mapToEntity(data);
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
