// ==============================================================================
// features/about/data/repository/supabase-about.repository.ts
// Concrete Supabase implementation of IAboutRepository
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@core/types/database.types";
import type { IAboutRepository } from "../../domain/repositories/i-about.repository";
import type {
  CompanyInfoEntity,
  MissionEntity,
  VisionEntity,
  CoreValueEntity,
  TimelineEntity,
  TeamMemberEntity,
  AboutCertificateEntity,
} from "../../domain/entities/about.entity";
import {
  toCompanyInfoEntity,
  toMissionEntity,
  toVisionEntity,
  toCoreValueEntity,
  toTimelineEntity,
  toTeamMemberEntity,
  toAboutCertificateEntity,
} from "../mapper/about.mapper";

export class SupabaseAboutRepository implements IAboutRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // ============================================================================
  // COMPANY INFO
  // ============================================================================
  async getCompanyInfo(): Promise<CompanyInfoEntity | null> {
    const { data, error } = await this.supabase.from("company_info").select("*").limit(1).single();
    if (error || !data) return null;
    return toCompanyInfoEntity(data);
  }

  async updateCompanyInfo(data: Partial<CompanyInfoEntity>): Promise<CompanyInfoEntity> {
    const existing = await this.getCompanyInfo();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.companyNameEn !== undefined) payload.company_name_en = data.companyNameEn;
    if (data.companyNameAr !== undefined) payload.company_name_ar = data.companyNameAr;
    if (data.shortDescriptionEn !== undefined) payload.short_description_en = data.shortDescriptionEn;
    if (data.shortDescriptionAr !== undefined) payload.short_description_ar = data.shortDescriptionAr;
    if (data.fullDescriptionEn !== undefined) payload.full_description_en = data.fullDescriptionEn;
    if (data.fullDescriptionAr !== undefined) payload.full_description_ar = data.fullDescriptionAr;
    if (data.establishedYear !== undefined) payload.established_year = data.establishedYear;
    if (data.headquarters !== undefined) payload.headquarters = data.headquarters;
    if (data.website !== undefined) payload.website = data.website;
    if (data.phone !== undefined) payload.phone = data.phone;
    if (data.email !== undefined) payload.email = data.email;
    if (data.status !== undefined) payload.status = data.status;

    let resData: unknown;
    let resError: unknown;

    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (this.supabase.from("company_info") as any)
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      resData = res.data;
      resError = res.error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (this.supabase.from("company_info") as any)
        .insert({
          company_name_en: data.companyNameEn ?? "Rukn Al Assi",
          company_name_ar: data.companyNameAr ?? "ركن العاصي",
          ...payload,
        })
        .select()
        .single();
      resData = res.data;
      resError = res.error;
    }

    if (resError || !resData) throw new Error((resError as { message?: string })?.message ?? "Failed to save company info");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toCompanyInfoEntity(resData as any);
  }

  // ============================================================================
  // MISSION
  // ============================================================================
  async getMission(): Promise<MissionEntity | null> {
    const { data, error } = await this.supabase.from("company_mission").select("*").limit(1).single();
    if (error || !data) return null;
    return toMissionEntity(data);
  }

  async updateMission(data: Partial<MissionEntity>): Promise<MissionEntity> {
    const existing = await this.getMission();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.titleEn !== undefined) payload.title_en = data.titleEn;
    if (data.titleAr !== undefined) payload.title_ar = data.titleAr;
    if (data.contentEn !== undefined) payload.content_en = data.contentEn;
    if (data.contentAr !== undefined) payload.content_ar = data.contentAr;
    if (data.icon !== undefined) payload.icon = data.icon;
    if (data.status !== undefined) payload.status = data.status;

    let resData: unknown;
    let resError: unknown;

    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (this.supabase.from("company_mission") as any)
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      resData = res.data;
      resError = res.error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (this.supabase.from("company_mission") as any)
        .insert({
          title_en: data.titleEn ?? "Our Mission",
          title_ar: data.titleAr ?? "مهمتنا",
          ...payload,
        })
        .select()
        .single();
      resData = res.data;
      resError = res.error;
    }

    if (resError || !resData) throw new Error((resError as { message?: string })?.message ?? "Failed to save mission");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toMissionEntity(resData as any);
  }

  // ============================================================================
  // VISION
  // ============================================================================
  async getVision(): Promise<VisionEntity | null> {
    const { data, error } = await this.supabase.from("company_vision").select("*").limit(1).single();
    if (error || !data) return null;
    return toVisionEntity(data);
  }

  async updateVision(data: Partial<VisionEntity>): Promise<VisionEntity> {
    const existing = await this.getVision();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.titleEn !== undefined) payload.title_en = data.titleEn;
    if (data.titleAr !== undefined) payload.title_ar = data.titleAr;
    if (data.contentEn !== undefined) payload.content_en = data.contentEn;
    if (data.contentAr !== undefined) payload.content_ar = data.contentAr;
    if (data.icon !== undefined) payload.icon = data.icon;
    if (data.status !== undefined) payload.status = data.status;

    let resData: unknown;
    let resError: unknown;

    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (this.supabase.from("company_vision") as any)
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      resData = res.data;
      resError = res.error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (this.supabase.from("company_vision") as any)
        .insert({
          title_en: data.titleEn ?? "Our Vision",
          title_ar: data.titleAr ?? "رؤيتنا",
          ...payload,
        })
        .select()
        .single();
      resData = res.data;
      resError = res.error;
    }

    if (resError || !resData) throw new Error((resError as { message?: string })?.message ?? "Failed to save vision");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toVisionEntity(resData as any);
  }

  // ============================================================================
  // CORE VALUES
  // ============================================================================
  async getCoreValues(): Promise<CoreValueEntity[]> {
    const { data, error } = await this.supabase
      .from("core_values")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(toCoreValueEntity);
  }

  async createCoreValue(value: Omit<CoreValueEntity, "id" | "createdAt" | "updatedAt">): Promise<CoreValueEntity> {
    const payload = {
      title_en: value.titleEn,
      title_ar: value.titleAr,
      description_en: value.descriptionEn,
      description_ar: value.descriptionAr,
      icon: value.icon,
      sort_order: value.sortOrder,
      status: value.status,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("core_values") as any)
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create core value");
    return toCoreValueEntity(data);
  }

  async updateCoreValue(id: string, value: Partial<CoreValueEntity>): Promise<CoreValueEntity> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (value.titleEn !== undefined) payload.title_en = value.titleEn;
    if (value.titleAr !== undefined) payload.title_ar = value.titleAr;
    if (value.descriptionEn !== undefined) payload.description_en = value.descriptionEn;
    if (value.descriptionAr !== undefined) payload.description_ar = value.descriptionAr;
    if (value.icon !== undefined) payload.icon = value.icon;
    if (value.sortOrder !== undefined) payload.sort_order = value.sortOrder;
    if (value.status !== undefined) payload.status = value.status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("core_values") as any)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update core value");
    return toCoreValueEntity(data);
  }

  async deleteCoreValue(id: string): Promise<void> {
    const { error } = await this.supabase.from("core_values").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderCoreValues(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.supabase.from("core_values") as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteCoreValues(ids: string[]): Promise<void> {
    const { error } = await this.supabase.from("core_values").delete().in("id", ids);
    if (error) throw new Error(error.message);
  }

  async bulkUpdateCoreValuesStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (this.supabase.from("core_values") as any)
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
  }

  // ============================================================================
  // TIMELINE
  // ============================================================================
  async getTimeline(): Promise<TimelineEntity[]> {
    const { data, error } = await this.supabase
      .from("company_timeline")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(toTimelineEntity);
  }

  async createTimeline(item: Omit<TimelineEntity, "id" | "createdAt" | "updatedAt">): Promise<TimelineEntity> {
    const payload = {
      year: item.year,
      title_en: item.titleEn,
      title_ar: item.titleAr,
      description_en: item.descriptionEn,
      description_ar: item.descriptionAr,
      image: item.image,
      sort_order: item.sortOrder,
      status: item.status,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("company_timeline") as any)
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create timeline event");
    return toTimelineEntity(data);
  }

  async updateTimeline(id: string, item: Partial<TimelineEntity>): Promise<TimelineEntity> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (item.year !== undefined) payload.year = item.year;
    if (item.titleEn !== undefined) payload.title_en = item.titleEn;
    if (item.titleAr !== undefined) payload.title_ar = item.titleAr;
    if (item.descriptionEn !== undefined) payload.description_en = item.descriptionEn;
    if (item.descriptionAr !== undefined) payload.description_ar = item.descriptionAr;
    if (item.image !== undefined) payload.image = item.image;
    if (item.sortOrder !== undefined) payload.sort_order = item.sortOrder;
    if (item.status !== undefined) payload.status = item.status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("company_timeline") as any)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update timeline event");
    return toTimelineEntity(data);
  }

  async deleteTimeline(id: string): Promise<void> {
    const { error } = await this.supabase.from("company_timeline").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderTimeline(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.supabase.from("company_timeline") as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteTimeline(ids: string[]): Promise<void> {
    const { error } = await this.supabase.from("company_timeline").delete().in("id", ids);
    if (error) throw new Error(error.message);
  }

  async bulkUpdateTimelineStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (this.supabase.from("company_timeline") as any)
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
  }

  // ============================================================================
  // MANAGEMENT TEAM
  // ============================================================================
  async getTeamMembers(): Promise<TeamMemberEntity[]> {
    const { data, error } = await this.supabase
      .from("management_team")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(toTeamMemberEntity);
  }

  async createTeamMember(member: Omit<TeamMemberEntity, "id" | "createdAt" | "updatedAt">): Promise<TeamMemberEntity> {
    const payload = {
      photo: member.photo,
      full_name_en: member.fullNameEn,
      full_name_ar: member.fullNameAr,
      position_en: member.positionEn,
      position_ar: member.positionAr,
      biography_en: member.biographyEn,
      biography_ar: member.biographyAr,
      linkedin: member.linkedin,
      email: member.email,
      phone: member.phone,
      sort_order: member.sortOrder,
      status: member.status,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("management_team") as any)
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create team member");
    return toTeamMemberEntity(data);
  }

  async updateTeamMember(id: string, member: Partial<TeamMemberEntity>): Promise<TeamMemberEntity> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (member.photo !== undefined) payload.photo = member.photo;
    if (member.fullNameEn !== undefined) payload.full_name_en = member.fullNameEn;
    if (member.fullNameAr !== undefined) payload.full_name_ar = member.fullNameAr;
    if (member.positionEn !== undefined) payload.position_en = member.positionEn;
    if (member.positionAr !== undefined) payload.position_ar = member.positionAr;
    if (member.biographyEn !== undefined) payload.biography_en = member.biographyEn;
    if (member.biographyAr !== undefined) payload.biography_ar = member.biographyAr;
    if (member.linkedin !== undefined) payload.linkedin = member.linkedin;
    if (member.email !== undefined) payload.email = member.email;
    if (member.phone !== undefined) payload.phone = member.phone;
    if (member.sortOrder !== undefined) payload.sort_order = member.sortOrder;
    if (member.status !== undefined) payload.status = member.status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("management_team") as any)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update team member");
    return toTeamMemberEntity(data);
  }

  async deleteTeamMember(id: string): Promise<void> {
    const { error } = await this.supabase.from("management_team").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderTeamMembers(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.supabase.from("management_team") as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteTeamMembers(ids: string[]): Promise<void> {
    const { error } = await this.supabase.from("management_team").delete().in("id", ids);
    if (error) throw new Error(error.message);
  }

  async bulkUpdateTeamMembersStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (this.supabase.from("management_team") as any)
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
  }

  // ============================================================================
  // CERTIFICATES
  // ============================================================================
  async getCertificates(): Promise<AboutCertificateEntity[]> {
    const { data, error } = await this.supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(toAboutCertificateEntity);
  }

  async createCertificate(cert: Omit<AboutCertificateEntity, "id" | "createdAt" | "updatedAt">): Promise<AboutCertificateEntity> {
    const payload = {
      title_en: cert.titleEn,
      title_ar: cert.titleAr,
      description_en: cert.descriptionEn,
      description_ar: cert.descriptionAr,
      image: cert.image,
      issue_date: cert.issueDate,
      expiry_date: cert.expiryDate,
      organization: cert.organization,
      sort_order: cert.sortOrder,
      status: cert.status,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("certificates") as any)
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create certificate");
    return toAboutCertificateEntity(data);
  }

  async updateCertificate(id: string, cert: Partial<AboutCertificateEntity>): Promise<AboutCertificateEntity> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (cert.titleEn !== undefined) payload.title_en = cert.titleEn;
    if (cert.titleAr !== undefined) payload.title_ar = cert.titleAr;
    if (cert.descriptionEn !== undefined) payload.description_en = cert.descriptionEn;
    if (cert.descriptionAr !== undefined) payload.description_ar = cert.descriptionAr;
    if (cert.image !== undefined) payload.image = cert.image;
    if (cert.issueDate !== undefined) payload.issue_date = cert.issueDate;
    if (cert.expiryDate !== undefined) payload.expiry_date = cert.expiryDate;
    if (cert.organization !== undefined) payload.organization = cert.organization;
    if (cert.sortOrder !== undefined) payload.sort_order = cert.sortOrder;
    if (cert.status !== undefined) payload.status = cert.status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("certificates") as any)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update certificate");
    return toAboutCertificateEntity(data);
  }

  async deleteCertificate(id: string): Promise<void> {
    const { error } = await this.supabase.from("certificates").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderCertificates(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.supabase.from("certificates") as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteCertificates(ids: string[]): Promise<void> {
    const { error } = await this.supabase.from("certificates").delete().in("id", ids);
    if (error) throw new Error(error.message);
  }

  async bulkUpdateCertificatesStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (this.supabase.from("certificates") as any)
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
  }

  // ============================================================================
  // ACTIVITY LOGGING
  // ============================================================================
  async logActivity(
    action: string,
    entityType: string,
    entityTitle?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const user = (await this.supabase.auth.getUser()).data.user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (this.supabase.from("activity_logs") as any).insert({
        action: action as any,
        entity_type: entityType as any,
        entity_title: entityTitle ?? null,
        user_id: user?.id ?? null,
        user_email: user?.email ?? null,
        metadata: metadata ?? null,
      });
    } catch {
      // Activity log insertion is non-blocking
    }
  }
}
