// ==============================================================================
// features/about/data/repository/supabase-about.repository.ts
// Concrete Supabase implementation of IAboutRepository strictly adhering
// to the official Rukn Al Assi Database Schema v2 (company_profile, core_values,
// timeline_events, team_members, certifications, activity_log).
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@core/types/database.types";
import type { IAboutRepository } from "../../domain/repositories/i-about.repository";
import {
  CompanyInfoEntity,
  MissionEntity,
  VisionEntity,
  CoreValueEntity,
  TimelineEntity,
  TeamMemberEntity,
  AboutCertificateEntity,
} from "../../domain/entities/about.entity";

export class SupabaseAboutRepository implements IAboutRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // ============================================================================
  // COMPANY PROFILE & TRANSLATIONS (Official Table: company_profile & company_profile_translations)
  // ============================================================================
  async getCompanyInfo(): Promise<CompanyInfoEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("company_profile" as any) as any)
        .select("*, company_profile_translations(*)")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const transList: any[] = data.company_profile_translations || [];
        const en = transList.find((t: any) => t.language_code === "en") || {};
        const ar = transList.find((t: any) => t.language_code === "ar") || {};

        return new CompanyInfoEntity({
          id: String(data.id || 1),
          companyNameEn: en.company_name || "Rukn Al Assi Co.",
          companyNameAr: ar.company_name || "شركة ركن العاصي",
          shortDescriptionEn: en.short_summary || "Engineering & Hydraulic Solutions",
          shortDescriptionAr: ar.short_summary || "حلول الهندسة والهيدروليك",
          fullDescriptionEn: en.full_story || en.short_summary || "Rukn Al Assi is a premier provider of industrial hydraulic equipment.",
          fullDescriptionAr: ar.full_story || ar.short_summary || "شركة ركن العاصي هي مزود رائد للمعدات الهيدروليكية الصناعية.",
          establishedYear: Number(data.established_year) || 2010,
          headquarters: data.headquarters || "Erbil, Iraq",
          website: data.website || "https://ruknalassi.com",
          phone: data.phone || "+964 750 000 0000",
          email: data.email || "info@ruknalassi.com",
          status: data.status || "active",
          updatedAt: new Date(data.updated_at || Date.now()),
        });
      }
    } catch {
      // Fallback
    }

    return new CompanyInfoEntity({
      id: "1",
      companyNameEn: "Rukn Al Assi Co.",
      companyNameAr: "شركة ركن العاصي",
      shortDescriptionEn: "Engineering & Hydraulic Solutions",
      shortDescriptionAr: "حلول الهندسة والهيدروليك",
      fullDescriptionEn: "Rukn Al Assi is a premier provider of industrial hydraulic equipment, spare parts, and specialized engineering services.",
      fullDescriptionAr: "شركة ركن العاصي هي مزود رائد للمعدات الهيدروليكية الصناعية وقطع الغيار والخدمات الهندسية المتخصصة.",
      establishedYear: 2010,
      headquarters: "Erbil, Iraq",
      website: "https://ruknalassi.com",
      phone: "+964 750 000 0000",
      email: "info@ruknalassi.com",
      status: "active",
      updatedAt: new Date(),
    });
  }

  async updateCompanyInfo(data: Partial<CompanyInfoEntity>): Promise<CompanyInfoEntity> {
    try {
      // 1. Get or create company_profile base row
      let profileId = 1;
      const { data: existing } = await (this.supabase.from("company_profile" as any) as any)
        .select("id")
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        profileId = existing.id;
      }

      const basePayload: Record<string, unknown> = {};
      if (data.establishedYear !== undefined) basePayload.established_year = data.establishedYear;
      if (data.headquarters !== undefined) basePayload.headquarters = data.headquarters;
      if (data.phone !== undefined) basePayload.phone = data.phone;
      if (data.email !== undefined) basePayload.email = data.email;
      if (data.website !== undefined) basePayload.website = data.website;
      if (data.status !== undefined) basePayload.status = data.status;

      if (Object.keys(basePayload).length > 0) {
        await (this.supabase.from("company_profile" as any) as any)
          .upsert({ id: profileId, ...basePayload });
      }

      // 2. Upsert translations in company_profile_translations
      const transPayloads = [];

      if (
        data.companyNameEn !== undefined ||
        data.shortDescriptionEn !== undefined ||
        data.fullDescriptionEn !== undefined
      ) {
        transPayloads.push({
          company_profile_id: profileId,
          language_code: "en",
          company_name: data.companyNameEn || "Rukn Al Assi Co.",
          short_summary: data.shortDescriptionEn || "",
          full_story: data.fullDescriptionEn || "",
        });
      }

      if (
        data.companyNameAr !== undefined ||
        data.shortDescriptionAr !== undefined ||
        data.fullDescriptionAr !== undefined
      ) {
        transPayloads.push({
          company_profile_id: profileId,
          language_code: "ar",
          company_name: data.companyNameAr || "شركة ركن العاصي",
          short_summary: data.shortDescriptionAr || "",
          full_story: data.fullDescriptionAr || "",
        });
      }

      if (transPayloads.length > 0) {
        await (this.supabase.from("company_profile_translations" as any) as any)
          .upsert(transPayloads, { onConflict: "company_profile_id,language_code" });
      }
    } catch (err) {
      console.error("[SupabaseAboutRepository] updateCompanyInfo error:", err);
    }

    return (await this.getCompanyInfo())!;
  }

  // ============================================================================
  // MISSION (Official Table: company_profile_translations.mission)
  // ============================================================================
  async getMission(): Promise<MissionEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("company_profile_translations" as any) as any)
        .select("*")
        .eq("company_profile_id", 1);

      if (!error && data && data.length > 0) {
        const en = data.find((t: any) => t.language_code === "en") || {};
        const ar = data.find((t: any) => t.language_code === "ar") || {};
        return new MissionEntity({
          id: "1",
          titleEn: "Our Mission",
          titleAr: "مهمتنا",
          contentEn: en.mission || "To deliver high-precision hydraulic solutions and superior industrial equipment services.",
          contentAr: ar.mission || "تقديم حلول هيدروليكية عالية الدقة وخدمات معدات صناعية متميزة.",
          icon: "target",
          status: "active",
          updatedAt: new Date(),
        });
      }
    } catch {
      // Fallback
    }

    return new MissionEntity({
      id: "1",
      titleEn: "Our Mission",
      titleAr: "مهمتنا",
      contentEn: "To deliver high-precision hydraulic solutions and superior industrial equipment services.",
      contentAr: "تقديم حلول هيدروليكية عالية الدقة وخدمات معدات صناعية متميزة.",
      icon: "target",
      status: "active",
      updatedAt: new Date(),
    });
  }

  async updateMission(data: Partial<MissionEntity>): Promise<MissionEntity> {
    try {
      await (this.supabase.from("company_profile_translations" as any) as any).upsert([
        {
          company_profile_id: 1,
          language_code: "en",
          mission: data.contentEn || "",
        },
        {
          company_profile_id: 1,
          language_code: "ar",
          mission: data.contentAr || "",
        },
      ]);
    } catch {
      // Fallback
    }

    return (await this.getMission())!;
  }

  // ============================================================================
  // VISION (Official Table: company_profile_translations.vision)
  // ============================================================================
  async getVision(): Promise<VisionEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("company_profile_translations" as any) as any)
        .select("*")
        .eq("company_profile_id", 1);

      if (!error && data && data.length > 0) {
        const en = data.find((t: any) => t.language_code === "en") || {};
        const ar = data.find((t: any) => t.language_code === "ar") || {};
        return new VisionEntity({
          id: "1",
          titleEn: "Our Vision",
          titleAr: "رؤيتنا",
          contentEn: en.vision || "To be the leading industrial hydraulics & engineering provider in the Middle East.",
          contentAr: ar.vision || "أن نكون المزود الرائد للهيدروليك والهندسة الصناعية في الشرق الأوسط.",
          icon: "eye",
          status: "active",
          updatedAt: new Date(),
        });
      }
    } catch {
      // Fallback
    }

    return new VisionEntity({
      id: "1",
      titleEn: "Our Vision",
      titleAr: "رؤيتنا",
      contentEn: "To be the leading industrial hydraulics & engineering provider in the Middle East.",
      contentAr: "أن نكون المزود الرائد للهيدروليك والهندسة الصناعية في الشرق الأوسط.",
      icon: "eye",
      status: "active",
      updatedAt: new Date(),
    });
  }

  async updateVision(data: Partial<VisionEntity>): Promise<VisionEntity> {
    try {
      await (this.supabase.from("company_profile_translations" as any) as any).upsert([
        {
          company_profile_id: 1,
          language_code: "en",
          vision: data.contentEn || "",
        },
        {
          company_profile_id: 1,
          language_code: "ar",
          vision: data.contentAr || "",
        },
      ]);
    } catch {
      // Fallback
    }

    return (await this.getVision())!;
  }

  // ============================================================================
  // CORE VALUES (Official Table: core_values & core_value_translations)
  // ============================================================================
  async getCoreValues(): Promise<CoreValueEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("core_values" as any) as any)
        .select("*, core_value_translations(*)")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map((item: any) => {
          const transList: any[] = item.core_value_translations || [];
          const en = transList.find((t: any) => t.language_code === "en") || {};
          const ar = transList.find((t: any) => t.language_code === "ar") || {};
          return new CoreValueEntity({
            id: item.id,
            titleEn: en.title || "Core Value",
            titleAr: ar.title || "قيمة جوهرية",
            descriptionEn: en.description || "",
            descriptionAr: ar.description || "",
            icon: item.icon || "star",
            sortOrder: item.sort_order ?? 0,
            status: item.status === "published" ? "active" : "draft",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
    } catch {
      // Fallback
    }

    return [];
  }

  async createCoreValue(value: Omit<CoreValueEntity, "id" | "createdAt" | "updatedAt">): Promise<CoreValueEntity> {
    const { data, error } = await (this.supabase.from("core_values" as any) as any)
      .insert({
        icon: value.icon,
        sort_order: value.sortOrder,
        status: value.status === "active" ? "published" : "draft",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create core value");

    await (this.supabase.from("core_value_translations" as any) as any).insert([
      { core_value_id: data.id, language_code: "en", title: value.titleEn, description: value.descriptionEn },
      { core_value_id: data.id, language_code: "ar", title: value.titleAr, description: value.descriptionAr },
    ]);

    return new CoreValueEntity({
      id: data.id,
      titleEn: value.titleEn,
      titleAr: value.titleAr,
      descriptionEn: value.descriptionEn,
      descriptionAr: value.descriptionAr,
      icon: value.icon,
      sortOrder: value.sortOrder,
      status: value.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateCoreValue(id: string, value: Partial<CoreValueEntity>): Promise<CoreValueEntity> {
    await (this.supabase.from("core_values" as any) as any)
      .update({
        icon: value.icon,
        sort_order: value.sortOrder,
        status: value.status === "active" ? "published" : "draft",
      })
      .eq("id", id);

    if (value.titleEn !== undefined || value.descriptionEn !== undefined) {
      await (this.supabase.from("core_value_translations" as any) as any).upsert({
        core_value_id: id,
        language_code: "en",
        title: value.titleEn || "",
        description: value.descriptionEn || "",
      });
    }
    if (value.titleAr !== undefined || value.descriptionAr !== undefined) {
      await (this.supabase.from("core_value_translations" as any) as any).upsert({
        core_value_id: id,
        language_code: "ar",
        title: value.titleAr || "",
        description: value.descriptionAr || "",
      });
    }

    const list = await this.getCoreValues();
    return list.find((v) => v.id === id) || new CoreValueEntity({
      id,
      titleEn: value.titleEn || "",
      titleAr: value.titleAr || "",
      descriptionEn: value.descriptionEn || "",
      descriptionAr: value.descriptionAr || "",
      icon: value.icon || "star",
      sortOrder: value.sortOrder || 0,
      status: value.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async deleteCoreValue(id: string): Promise<void> {
    await (this.supabase.from("core_values" as any) as any).update({ deleted_at: new Date().toISOString() }).eq("id", id);
  }

  async reorderCoreValues(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("core_values" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteCoreValues(ids: string[]): Promise<void> {
    await (this.supabase.from("core_values" as any) as any).update({ deleted_at: new Date().toISOString() }).in("id", ids);
  }

  async bulkUpdateCoreValuesStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    await (this.supabase.from("core_values" as any) as any)
      .update({ status: status === "active" ? "published" : "draft" })
      .in("id", ids);
  }

  // ============================================================================
  // TIMELINE EVENTS (Official Table: timeline_events & timeline_event_translations)
  // ============================================================================
  async getTimeline(): Promise<TimelineEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("timeline_events" as any) as any)
        .select("*, timeline_event_translations(*)")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map((item: any) => {
          const transList: any[] = item.timeline_event_translations || [];
          const en = transList.find((t: any) => t.language_code === "en") || {};
          const ar = transList.find((t: any) => t.language_code === "ar") || {};
          return new TimelineEntity({
            id: item.id,
            year: String(item.event_year ?? 2020),
            titleEn: en.title || "Milestone",
            titleAr: ar.title || "حدث هاما",
            descriptionEn: en.description || "",
            descriptionAr: ar.description || "",
            image: "",
            sortOrder: item.sort_order ?? 0,
            status: item.status === "published" ? "active" : "draft",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
    } catch {
      // Fallback
    }

    return [];
  }

  async createTimeline(item: Omit<TimelineEntity, "id" | "createdAt" | "updatedAt">): Promise<TimelineEntity> {
    const { data, error } = await (this.supabase.from("timeline_events" as any) as any)
      .insert({
        event_year: item.year,
        sort_order: item.sortOrder,
        status: item.status === "active" ? "published" : "draft",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create timeline event");

    await (this.supabase.from("timeline_event_translations" as any) as any).insert([
      { timeline_event_id: data.id, language_code: "en", title: item.titleEn, description: item.descriptionEn },
      { timeline_event_id: data.id, language_code: "ar", title: item.titleAr, description: item.descriptionAr },
    ]);

    return new TimelineEntity({
      id: data.id,
      year: item.year,
      titleEn: item.titleEn,
      titleAr: item.titleAr,
      descriptionEn: item.descriptionEn,
      descriptionAr: item.descriptionAr,
      image: item.image,
      sortOrder: item.sortOrder,
      status: item.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateTimeline(id: string, item: Partial<TimelineEntity>): Promise<TimelineEntity> {
    await (this.supabase.from("timeline_events" as any) as any)
      .update({
        event_year: item.year,
        sort_order: item.sortOrder,
        status: item.status === "active" ? "published" : "draft",
      })
      .eq("id", id);

    if (item.titleEn !== undefined || item.descriptionEn !== undefined) {
      await (this.supabase.from("timeline_event_translations" as any) as any).upsert({
        timeline_event_id: id,
        language_code: "en",
        title: item.titleEn || "",
        description: item.descriptionEn || "",
      });
    }
    if (item.titleAr !== undefined || item.descriptionAr !== undefined) {
      await (this.supabase.from("timeline_event_translations" as any) as any).upsert({
        timeline_event_id: id,
        language_code: "ar",
        title: item.titleAr || "",
        description: item.descriptionAr || "",
      });
    }

    const list = await this.getTimeline();
    return list.find((t) => t.id === id) || new TimelineEntity({
      id,
      year: String(item.year || 2020),
      titleEn: item.titleEn || "",
      titleAr: item.titleAr || "",
      descriptionEn: item.descriptionEn || "",
      descriptionAr: item.descriptionAr || "",
      image: item.image || "",
      sortOrder: item.sortOrder || 0,
      status: item.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async deleteTimeline(id: string): Promise<void> {
    await (this.supabase.from("timeline_events" as any) as any).update({ deleted_at: new Date().toISOString() }).eq("id", id);
  }

  async reorderTimeline(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("timeline_events" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteTimeline(ids: string[]): Promise<void> {
    await (this.supabase.from("timeline_events" as any) as any).update({ deleted_at: new Date().toISOString() }).in("id", ids);
  }

  async bulkUpdateTimelineStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    await (this.supabase.from("timeline_events" as any) as any)
      .update({ status: status === "active" ? "published" : "draft" })
      .in("id", ids);
  }

  // ============================================================================
  // TEAM MEMBERS (Official Table: team_members & team_member_translations)
  // ============================================================================
  async getTeamMembers(): Promise<TeamMemberEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("team_members" as any) as any)
        .select("*, team_member_translations(*)")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map((item: any) => {
          const transList: any[] = item.team_member_translations || [];
          const en = transList.find((t: any) => t.language_code === "en") || {};
          const ar = transList.find((t: any) => t.language_code === "ar") || {};
          return new TeamMemberEntity({
            id: item.id,
            photo: item.photo_url || "",
            fullNameEn: en.name || "Team Member",
            fullNameAr: ar.name || "عضو الفريق",
            positionEn: en.position || "",
            positionAr: ar.position || "",
            biographyEn: en.bio || "",
            biographyAr: ar.bio || "",
            linkedin: "",
            email: "",
            phone: "",
            sortOrder: item.sort_order ?? 0,
            status: item.status === "published" ? "active" : "draft",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
    } catch {
      // Fallback
    }

    return [];
  }

  async createTeamMember(member: Omit<TeamMemberEntity, "id" | "createdAt" | "updatedAt">): Promise<TeamMemberEntity> {
    const { data, error } = await (this.supabase.from("team_members" as any) as any)
      .insert({
        photo_url: member.photo,
        sort_order: member.sortOrder,
        status: member.status === "active" ? "published" : "draft",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create team member");

    await (this.supabase.from("team_member_translations" as any) as any).insert([
      { team_member_id: data.id, language_code: "en", name: member.fullNameEn, position: member.positionEn, bio: member.biographyEn },
      { team_member_id: data.id, language_code: "ar", name: member.fullNameAr, position: member.positionAr, bio: member.biographyAr },
    ]);

    return new TeamMemberEntity({
      id: data.id,
      photo: member.photo,
      fullNameEn: member.fullNameEn,
      fullNameAr: member.fullNameAr,
      positionEn: member.positionEn,
      positionAr: member.positionAr,
      biographyEn: member.biographyEn,
      biographyAr: member.biographyAr,
      linkedin: member.linkedin,
      email: member.email,
      phone: member.phone,
      sortOrder: member.sortOrder,
      status: member.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateTeamMember(id: string, member: Partial<TeamMemberEntity>): Promise<TeamMemberEntity> {
    await (this.supabase.from("team_members" as any) as any)
      .update({
        photo_url: member.photo,
        sort_order: member.sortOrder,
        status: member.status === "active" ? "published" : "draft",
      })
      .eq("id", id);

    if (member.fullNameEn !== undefined || member.positionEn !== undefined || member.biographyEn !== undefined) {
      await (this.supabase.from("team_member_translations" as any) as any).upsert({
        team_member_id: id,
        language_code: "en",
        name: member.fullNameEn || "",
        position: member.positionEn || "",
        bio: member.biographyEn || "",
      });
    }
    if (member.fullNameAr !== undefined || member.positionAr !== undefined || member.biographyAr !== undefined) {
      await (this.supabase.from("team_member_translations" as any) as any).upsert({
        team_member_id: id,
        language_code: "ar",
        name: member.fullNameAr || "",
        position: member.positionAr || "",
        bio: member.biographyAr || "",
      });
    }

    const list = await this.getTeamMembers();
    return list.find((m) => m.id === id) || new TeamMemberEntity({
      id,
      photo: member.photo || "",
      fullNameEn: member.fullNameEn || "",
      fullNameAr: member.fullNameAr || "",
      positionEn: member.positionEn || "",
      positionAr: member.positionAr || "",
      biographyEn: member.biographyEn || "",
      biographyAr: member.biographyAr || "",
      linkedin: member.linkedin || "",
      email: member.email || "",
      phone: member.phone || "",
      sortOrder: member.sortOrder || 0,
      status: member.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async deleteTeamMember(id: string): Promise<void> {
    await (this.supabase.from("team_members" as any) as any).update({ deleted_at: new Date().toISOString() }).eq("id", id);
  }

  async reorderTeamMembers(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("team_members" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteTeamMembers(ids: string[]): Promise<void> {
    await (this.supabase.from("team_members" as any) as any).update({ deleted_at: new Date().toISOString() }).in("id", ids);
  }

  async bulkUpdateTeamMembersStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    await (this.supabase.from("team_members" as any) as any)
      .update({ status: status === "active" ? "published" : "draft" })
      .in("id", ids);
  }

  // ============================================================================
  // CERTIFICATIONS (Official Table: certifications & certification_translations)
  // ============================================================================
  async getCertificates(): Promise<AboutCertificateEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("certifications" as any) as any)
        .select("*, certification_translations(*)")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map((item: any) => {
          const transList: any[] = item.certification_translations || [];
          const en = transList.find((t: any) => t.language_code === "en") || {};
          const ar = transList.find((t: any) => t.language_code === "ar") || {};
          return new AboutCertificateEntity({
            id: item.id,
            titleEn: en.title || "Certification",
            titleAr: ar.title || "شهادة اعتمادات",
            descriptionEn: en.description || "",
            descriptionAr: ar.description || "",
            image: item.image_url || "",
            issueDate: item.issued_date || "",
            expiryDate: "",
            organization: item.issued_by || "",
            sortOrder: item.sort_order ?? 0,
            status: item.status === "published" ? "active" : "draft",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
    } catch {
      // Fallback
    }

    return [];
  }

  async createCertificate(cert: Omit<AboutCertificateEntity, "id" | "createdAt" | "updatedAt">): Promise<AboutCertificateEntity> {
    const { data, error } = await (this.supabase.from("certifications" as any) as any)
      .insert({
        image_url: cert.image,
        issued_by: cert.organization,
        issued_date: cert.issueDate || null,
        sort_order: cert.sortOrder,
        status: cert.status === "active" ? "published" : "draft",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create certificate");

    await (this.supabase.from("certification_translations" as any) as any).insert([
      { certification_id: data.id, language_code: "en", title: cert.titleEn, description: cert.descriptionEn },
      { certification_id: data.id, language_code: "ar", title: cert.titleAr, description: cert.descriptionAr },
    ]);

    return new AboutCertificateEntity({
      id: data.id,
      titleEn: cert.titleEn,
      titleAr: cert.titleAr,
      descriptionEn: cert.descriptionEn,
      descriptionAr: cert.descriptionAr,
      image: cert.image,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      organization: cert.organization,
      sortOrder: cert.sortOrder,
      status: cert.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateCertificate(id: string, cert: Partial<AboutCertificateEntity>): Promise<AboutCertificateEntity> {
    await (this.supabase.from("certifications" as any) as any)
      .update({
        image_url: cert.image,
        issued_by: cert.organization,
        issued_date: cert.issueDate || null,
        sort_order: cert.sortOrder,
        status: cert.status === "active" ? "published" : "draft",
      })
      .eq("id", id);

    if (cert.titleEn !== undefined || cert.descriptionEn !== undefined) {
      await (this.supabase.from("certification_translations" as any) as any).upsert({
        certification_id: id,
        language_code: "en",
        title: cert.titleEn || "",
        description: cert.descriptionEn || "",
      });
    }
    if (cert.titleAr !== undefined || cert.descriptionAr !== undefined) {
      await (this.supabase.from("certification_translations" as any) as any).upsert({
        certification_id: id,
        language_code: "ar",
        title: cert.titleAr || "",
        description: cert.descriptionAr || "",
      });
    }

    const list = await this.getCertificates();
    return list.find((c) => c.id === id) || new AboutCertificateEntity({
      id,
      titleEn: cert.titleEn || "",
      titleAr: cert.titleAr || "",
      descriptionEn: cert.descriptionEn || "",
      descriptionAr: cert.descriptionAr || "",
      image: cert.image || "",
      issueDate: cert.issueDate || "",
      expiryDate: cert.expiryDate || "",
      organization: cert.organization || "",
      sortOrder: cert.sortOrder || 0,
      status: cert.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async deleteCertificate(id: string): Promise<void> {
    await (this.supabase.from("certifications" as any) as any).update({ deleted_at: new Date().toISOString() }).eq("id", id);
  }

  async reorderCertificates(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("certifications" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteCertificates(ids: string[]): Promise<void> {
    await (this.supabase.from("certifications" as any) as any).update({ deleted_at: new Date().toISOString() }).in("id", ids);
  }

  async bulkUpdateCertificatesStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    await (this.supabase.from("certifications" as any) as any)
      .update({ status: status === "active" ? "published" : "draft" })
      .in("id", ids);
  }

  // ============================================================================
  // ACTIVITY LOGGING (Official Table: activity_log)
  // ============================================================================
  async logActivity(
    action: string,
    entityType: string,
    entityTitle?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      let validAdminId: string | null = null;
      if (userData?.user?.id) {
        const { data: profile } = await (this.supabase.from("admin_profiles" as any) as any)
          .select("id")
          .eq("id", userData.user.id)
          .maybeSingle();
        if (profile) validAdminId = profile.id;
      }
      await (this.supabase.from("activity_log" as any) as any).insert({
        action,
        entity_type: entityType,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: validAdminId,
      });
    } catch {
      // Non-blocking log insertion
    }
  }
}
