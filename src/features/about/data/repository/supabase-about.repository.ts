// ==============================================================================
// features/about/data/repository/supabase-about.repository.ts
// Concrete Supabase implementation of IAboutRepository strictly adhering
// to the official Rukn Al Assi Database Schema:
// 1. company_profile & company_profile_translations
// 2. core_values & core_value_translations
// 3. timeline_events & timeline_event_translations
// 4. team_members & team_member_translations
// 5. certifications & certification_translations
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@core/types/database.types";
import type {
  IAboutRepository,
  UpdateCompanyInfoTranslationInput,
  SaveCoreValueInput,
  SaveTimelineInput,
  SaveTeamMemberInput,
  SaveCertificateInput,
} from "../../domain/repositories/i-about.repository";
import {
  CompanyInfoEntity,
  CoreValueEntity,
  TimelineEntity,
  TeamMemberEntity,
  AboutCertificateEntity,
  SectionStatus,
} from "../../domain/entities/about.entity";

export class SupabaseAboutRepository implements IAboutRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // ============================================================================
  // 1. COMPANY PROFILE & TRANSLATIONS
  // Tables: company_profile (id)
  //         company_profile_translations (company_profile_id, language_code, history, mission, vision)
  // ============================================================================
  async getCompanyInfo(): Promise<CompanyInfoEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("company_profile" as any) as any)
        .select("*, company_profile_translations(*)")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const transList: any[] = data.company_profile_translations || [];
        const translations: Record<string, { history: string; mission: string; vision: string }> = {};

        for (const t of transList) {
          if (t.language_code) {
            translations[t.language_code] = {
              history: t.history || "",
              mission: t.mission || "",
              vision: t.vision || "",
            };
          }
        }

        return new CompanyInfoEntity({
          id: String(data.id || 1),
          translations,
          updatedAt: new Date(data.updated_at || Date.now()),
        });
      }
    } catch {
      // Fallback
    }

    return new CompanyInfoEntity({
      id: "1",
      translations: {
        en: { history: "", mission: "", vision: "" },
        ar: { history: "", mission: "", vision: "" },
      },
      updatedAt: new Date(),
    });
  }

  async updateCompanyInfoTranslation(input: UpdateCompanyInfoTranslationInput): Promise<CompanyInfoEntity> {
    try {
      let profileId = 1;
      const { data: existing } = await (this.supabase.from("company_profile" as any) as any)
        .select("id")
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        profileId = existing.id;
      } else {
        const { data: created } = await (this.supabase.from("company_profile" as any) as any)
          .insert({ id: 1 })
          .select("id")
          .maybeSingle();
        if (created?.id) profileId = created.id;
      }

      await (this.supabase.from("company_profile_translations" as any) as any).upsert(
        {
          company_profile_id: profileId,
          language_code: input.language_code,
          history: input.history || "",
          mission: input.mission || "",
          vision: input.vision || "",
        },
        { onConflict: "company_profile_id,language_code" }
      );
    } catch (err) {
      console.error("[SupabaseAboutRepository] updateCompanyInfoTranslation error:", err);
    }

    return (await this.getCompanyInfo())!;
  }

  // ============================================================================
  // 2. CORE VALUES
  // Tables: core_values (id, icon, sort_order, status, deleted_at)
  //         core_value_translations (core_value_id, language_code, title, description)
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
          const translations: Record<string, { title: string; description: string }> = {};
          for (const t of transList) {
            if (t.language_code) {
              translations[t.language_code] = {
                title: t.title || "",
                description: t.description || "",
              };
            }
          }

          return new CoreValueEntity({
            id: String(item.id),
            icon: item.icon ?? null,
            sortOrder: item.sort_order ?? 0,
            status: item.status ?? "active",
            translations,
            createdAt: new Date(item.created_at || Date.now()),
            updatedAt: new Date(item.updated_at || Date.now()),
          });
        });
      }
    } catch {
      // Fallback
    }

    return [];
  }

  async createCoreValue(input: SaveCoreValueInput): Promise<CoreValueEntity> {
    const { data, error } = await (this.supabase.from("core_values" as any) as any)
      .insert({
        icon: input.icon ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "active",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create core value");

    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      core_value_id: data.id,
      language_code: lang,
      title: val.title || "",
      description: val.description || "",
    }));

    if (transPayloads.length > 0) {
      await (this.supabase.from("core_value_translations" as any) as any).insert(transPayloads);
    }

    const list = await this.getCoreValues();
    return list.find((v) => v.id === String(data.id))!;
  }

  async updateCoreValue(id: string, input: SaveCoreValueInput): Promise<CoreValueEntity> {
    await (this.supabase.from("core_values" as any) as any)
      .update({
        icon: input.icon ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "active",
      })
      .eq("id", id);

    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      core_value_id: id,
      language_code: lang,
      title: val.title || "",
      description: val.description || "",
    }));

    for (const payload of transPayloads) {
      await (this.supabase.from("core_value_translations" as any) as any).upsert(payload, {
        onConflict: "core_value_id,language_code",
      });
    }

    const list = await this.getCoreValues();
    return list.find((v) => v.id === id)!;
  }

  async deleteCoreValue(id: string): Promise<void> {
    await (this.supabase.from("core_values" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
  }

  async reorderCoreValues(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("core_values" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteCoreValues(ids: string[]): Promise<void> {
    await (this.supabase.from("core_values" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids);
  }

  async bulkUpdateCoreValuesStatus(ids: string[], status: SectionStatus): Promise<void> {
    await (this.supabase.from("core_values" as any) as any)
      .update({ status })
      .in("id", ids);
  }

  // ============================================================================
  // 3. TIMELINE EVENTS
  // Tables: timeline_events (id, event_year, sort_order, status, deleted_at)
  //         timeline_event_translations (timeline_event_id, language_code, title, description)
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
          const translations: Record<string, { title: string; description: string }> = {};
          for (const t of transList) {
            if (t.language_code) {
              translations[t.language_code] = {
                title: t.title || "",
                description: t.description || "",
              };
            }
          }

          return new TimelineEntity({
            id: String(item.id),
            eventYear: String(item.event_year ?? ""),
            sortOrder: item.sort_order ?? 0,
            status: item.status ?? "active",
            translations,
            createdAt: new Date(item.created_at || Date.now()),
            updatedAt: new Date(item.updated_at || Date.now()),
          });
        });
      }
    } catch {
      // Fallback
    }

    return [];
  }

  async createTimeline(input: SaveTimelineInput): Promise<TimelineEntity> {
    const { data, error } = await (this.supabase.from("timeline_events" as any) as any)
      .insert({
        event_year: input.eventYear,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "active",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create timeline event");

    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      timeline_event_id: data.id,
      language_code: lang,
      title: val.title || "",
      description: val.description || "",
    }));

    if (transPayloads.length > 0) {
      await (this.supabase.from("timeline_event_translations" as any) as any).insert(transPayloads);
    }

    const list = await this.getTimeline();
    return list.find((t) => t.id === String(data.id))!;
  }

  async updateTimeline(id: string, input: SaveTimelineInput): Promise<TimelineEntity> {
    await (this.supabase.from("timeline_events" as any) as any)
      .update({
        event_year: input.eventYear,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "active",
      })
      .eq("id", id);

    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      timeline_event_id: id,
      language_code: lang,
      title: val.title || "",
      description: val.description || "",
    }));

    for (const payload of transPayloads) {
      await (this.supabase.from("timeline_event_translations" as any) as any).upsert(payload, {
        onConflict: "timeline_event_id,language_code",
      });
    }

    const list = await this.getTimeline();
    return list.find((t) => t.id === id)!;
  }

  async deleteTimeline(id: string): Promise<void> {
    await (this.supabase.from("timeline_events" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
  }

  async reorderTimeline(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("timeline_events" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteTimeline(ids: string[]): Promise<void> {
    await (this.supabase.from("timeline_events" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids);
  }

  async bulkUpdateTimelineStatus(ids: string[], status: SectionStatus): Promise<void> {
    await (this.supabase.from("timeline_events" as any) as any)
      .update({ status })
      .in("id", ids);
  }

  // ============================================================================
  // 4. MANAGEMENT TEAM
  // Tables: team_members (id, photo_url, sort_order, status, deleted_at)
  //         team_member_translations (team_member_id, language_code, name, position, bio)
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
          const translations: Record<string, { name: string; position: string; bio: string }> = {};
          for (const t of transList) {
            if (t.language_code) {
              translations[t.language_code] = {
                name: t.name || "",
                position: t.position || "",
                bio: t.bio || "",
              };
            }
          }

          return new TeamMemberEntity({
            id: String(item.id),
            photoUrl: item.photo_url ?? null,
            sortOrder: item.sort_order ?? 0,
            status: item.status ?? "active",
            translations,
            createdAt: new Date(item.created_at || Date.now()),
            updatedAt: new Date(item.updated_at || Date.now()),
          });
        });
      }
    } catch {
      // Fallback
    }

    return [];
  }

  async createTeamMember(input: SaveTeamMemberInput): Promise<TeamMemberEntity> {
    const { data, error } = await (this.supabase.from("team_members" as any) as any)
      .insert({
        photo_url: input.photoUrl ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "active",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create team member");

    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      team_member_id: data.id,
      language_code: lang,
      name: val.name || "",
      position: val.position || "",
      bio: val.bio || "",
    }));

    if (transPayloads.length > 0) {
      await (this.supabase.from("team_member_translations" as any) as any).insert(transPayloads);
    }

    const list = await this.getTeamMembers();
    return list.find((m) => m.id === String(data.id))!;
  }

  async updateTeamMember(id: string, input: SaveTeamMemberInput): Promise<TeamMemberEntity> {
    await (this.supabase.from("team_members" as any) as any)
      .update({
        photo_url: input.photoUrl ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "active",
      })
      .eq("id", id);

    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      team_member_id: id,
      language_code: lang,
      name: val.name || "",
      position: val.position || "",
      bio: val.bio || "",
    }));

    for (const payload of transPayloads) {
      await (this.supabase.from("team_member_translations" as any) as any).upsert(payload, {
        onConflict: "team_member_id,language_code",
      });
    }

    const list = await this.getTeamMembers();
    return list.find((m) => m.id === id)!;
  }

  async deleteTeamMember(id: string): Promise<void> {
    await (this.supabase.from("team_members" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
  }

  async reorderTeamMembers(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("team_members" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteTeamMembers(ids: string[]): Promise<void> {
    await (this.supabase.from("team_members" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids);
  }

  async bulkUpdateTeamMembersStatus(ids: string[], status: SectionStatus): Promise<void> {
    await (this.supabase.from("team_members" as any) as any)
      .update({ status })
      .in("id", ids);
  }

  // ============================================================================
  // 5. CERTIFICATES
  // Tables: certifications (id, image_url, issued_by, issued_date, sort_order, status, deleted_at)
  //         certification_translations (certification_id, language_code, title, description)
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
          const translations: Record<string, { title: string; description: string }> = {};
          for (const t of transList) {
            if (t.language_code) {
              translations[t.language_code] = {
                title: t.title || "",
                description: t.description || "",
              };
            }
          }

          return new AboutCertificateEntity({
            id: String(item.id),
            imageUrl: item.image_url ?? null,
            issuedBy: item.issued_by ?? null,
            issuedDate: item.issued_date ?? null,
            sortOrder: item.sort_order ?? 0,
            status: item.status ?? "active",
            translations,
            createdAt: new Date(item.created_at || Date.now()),
            updatedAt: new Date(item.updated_at || Date.now()),
          });
        });
      }
    } catch {
      // Fallback
    }

    return [];
  }

  async createCertificate(input: SaveCertificateInput): Promise<AboutCertificateEntity> {
    const { data, error } = await (this.supabase.from("certifications" as any) as any)
      .insert({
        image_url: input.imageUrl ?? null,
        issued_by: input.issuedBy ?? null,
        issued_date: input.issuedDate ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "active",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create certificate");

    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      certification_id: data.id,
      language_code: lang,
      title: val.title || "",
      description: val.description || "",
    }));

    if (transPayloads.length > 0) {
      await (this.supabase.from("certification_translations" as any) as any).insert(transPayloads);
    }

    const list = await this.getCertificates();
    return list.find((c) => c.id === String(data.id))!;
  }

  async updateCertificate(id: string, input: SaveCertificateInput): Promise<AboutCertificateEntity> {
    await (this.supabase.from("certifications" as any) as any)
      .update({
        image_url: input.imageUrl ?? null,
        issued_by: input.issuedBy ?? null,
        issued_date: input.issuedDate ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "active",
      })
      .eq("id", id);

    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      certification_id: id,
      language_code: lang,
      title: val.title || "",
      description: val.description || "",
    }));

    for (const payload of transPayloads) {
      await (this.supabase.from("certification_translations" as any) as any).upsert(payload, {
        onConflict: "certification_id,language_code",
      });
    }

    const list = await this.getCertificates();
    return list.find((c) => c.id === id)!;
  }

  async deleteCertificate(id: string): Promise<void> {
    await (this.supabase.from("certifications" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
  }

  async reorderCertificates(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("certifications" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteCertificates(ids: string[]): Promise<void> {
    await (this.supabase.from("certifications" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids);
  }

  async bulkUpdateCertificatesStatus(ids: string[], status: SectionStatus): Promise<void> {
    await (this.supabase.from("certifications" as any) as any)
      .update({ status })
      .in("id", ids);
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
      // Non-blocking
    }
  }
}
