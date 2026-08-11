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
    let profileId = 1;
    const { data: existing } = await (this.supabase.from("company_profile" as any) as any)
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      profileId = existing.id;
    } else {
      const { data: created, error: createErr } = await (this.supabase.from("company_profile" as any) as any)
        .insert({ id: 1 })
        .select("id")
        .maybeSingle();
      if (createErr) throw new Error(createErr.message || "Failed to initialize company profile row");
      if (created?.id) profileId = created.id;
    }

    // Determine the exact language_code existing in public.languages table
    let targetLangCode = input.language_code;

    const { data: validLangs } = await (this.supabase.from("languages" as any) as any)
      .select("code");

    if (validLangs && validLangs.length > 0) {
      const dbCodes: string[] = validLangs.map((l: any) => l.code);
      if (!dbCodes.includes(targetLangCode)) {
        if (targetLangCode === "ckb" && dbCodes.includes("ku")) {
          targetLangCode = "ku";
        } else if (targetLangCode === "ku" && dbCodes.includes("ckb")) {
          targetLangCode = "ckb";
        } else if (targetLangCode === "en" && dbCodes.includes("en-US")) {
          targetLangCode = "en-US";
        } else if (targetLangCode === "ar" && dbCodes.includes("ar-IQ")) {
          targetLangCode = "ar-IQ";
        } else {
          const basePrefix = targetLangCode.split("-")[0];
          const matched = dbCodes.find((c) => c === basePrefix || c.startsWith(basePrefix + "-"));
          if (matched) {
            targetLangCode = matched;
          }
        }
      }
    }

    const { error: upsertErr } = await (this.supabase.from("company_profile_translations" as any) as any).upsert(
      {
        company_profile_id: profileId,
        language_code: targetLangCode,
        history: input.history || "",
        mission: input.mission || "",
        vision: input.vision || "",
      },
      { onConflict: "company_profile_id,language_code" }
    );

    if (upsertErr) {
      throw new Error(upsertErr.message || "Failed to update company profile information in database.");
    }

    return (await this.getCompanyInfo())!;
  }

  async updateCompanyInfoTranslationsBatch(inputs: UpdateCompanyInfoTranslationInput[]): Promise<CompanyInfoEntity> {
    let profileId = 1;
    const { data: existing } = await (this.supabase.from("company_profile" as any) as any)
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      profileId = existing.id;
    } else {
      const { data: created, error: createErr } = await (this.supabase.from("company_profile" as any) as any)
        .insert({ id: 1 })
        .select("id")
        .maybeSingle();
      if (createErr) throw new Error(createErr.message || "Failed to initialize company profile row");
      if (created?.id) profileId = created.id;
    }

    const dbCodes = await this.getValidLanguageCodes();

    const payloads = inputs.map((input) => ({
      company_profile_id: profileId,
      language_code: this.resolveLangCode(input.language_code, dbCodes),
      history: input.history || "",
      mission: input.mission || "",
      vision: input.vision || "",
    }));

    if (payloads.length > 0) {
      const { error: upsertErr } = await (this.supabase.from("company_profile_translations" as any) as any).upsert(
        payloads,
        { onConflict: "company_profile_id,language_code" }
      );

      if (upsertErr) {
        throw new Error(upsertErr.message || "Failed to update company profile information in database.");
      }
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
            status: item.status ?? "published",
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

  private async getValidLanguageCodes(): Promise<string[]> {
    try {
      const { data } = await (this.supabase.from("languages" as any) as any).select("code");
      if (data && data.length > 0) {
        return data.map((l: any) => l.code);
      }
    } catch {}
    return ["en", "ar", "ku"];
  }

  private resolveLangCode(lang: string, dbCodes: string[]): string {
    if (dbCodes.includes(lang)) return lang;
    if (lang === "ckb" && dbCodes.includes("ku")) return "ku";
    if (lang === "ku" && dbCodes.includes("ckb")) return "ckb";
    if (lang === "en" && dbCodes.includes("en-US")) return "en-US";
    if (lang === "ar" && dbCodes.includes("ar-IQ")) return "ar-IQ";

    const basePrefix = lang.split("-")[0];
    const matched = dbCodes.find((c) => c === basePrefix || c.startsWith(basePrefix + "-"));
    if (matched) return matched;

    return dbCodes[0] || lang;
  }

  async createCoreValue(input: SaveCoreValueInput): Promise<CoreValueEntity> {
    const { data, error } = await (this.supabase.from("core_values" as any) as any)
      .insert({
        icon: input.icon ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "published",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create core value");

    const dbCodes = await this.getValidLanguageCodes();
    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      core_value_id: data.id,
      language_code: this.resolveLangCode(lang, dbCodes),
      title: val.title || "",
      description: val.description || "",
    }));

    if (transPayloads.length > 0) {
      const { error: transErr } = await (this.supabase.from("core_value_translations" as any) as any).insert(transPayloads);
      if (transErr) throw new Error(transErr.message || "Failed to create core value translations");
    }

    const list = await this.getCoreValues();
    return list.find((v) => v.id === String(data.id))!;
  }

  async updateCoreValue(id: string, input: SaveCoreValueInput): Promise<CoreValueEntity> {
    const { error: baseErr } = await (this.supabase.from("core_values" as any) as any)
      .update({
        icon: input.icon ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "published",
      })
      .eq("id", id);

    if (baseErr) throw new Error(baseErr.message || "Failed to update core value");

    const dbCodes = await this.getValidLanguageCodes();
    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      core_value_id: id,
      language_code: this.resolveLangCode(lang, dbCodes),
      title: val.title || "",
      description: val.description || "",
    }));

    for (const payload of transPayloads) {
      const { error: transErr } = await (this.supabase.from("core_value_translations" as any) as any).upsert(payload, {
        onConflict: "core_value_id,language_code",
      });
      if (transErr) throw new Error(transErr.message || "Failed to update core value translations");
    }

    const list = await this.getCoreValues();
    return list.find((v) => v.id === id)!;
  }

  async deleteCoreValue(id: string): Promise<void> {
    const { error } = await (this.supabase.from("core_values" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id);
    if (error) throw new Error(error.message || "Failed to delete core value");
  }

  async reorderCoreValues(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("core_values" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message || "Failed to reorder core values");
  }

  async bulkDeleteCoreValues(ids: string[]): Promise<void> {
    const { error } = await (this.supabase.from("core_values" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .in("id", ids);
    if (error) throw new Error(error.message || "Failed to bulk delete core values");
  }

  async bulkUpdateCoreValuesStatus(ids: string[], status: SectionStatus): Promise<void> {
    const { error } = await (this.supabase.from("core_values" as any) as any)
      .update({ status })
      .in("id", ids);
    if (error) throw new Error(error.message || "Failed to bulk update status for core values");
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
            status: item.status ?? "published",
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
    const parsedYear = parseInt(String(input.eventYear), 10) || new Date().getFullYear();
    const { data, error } = await (this.supabase.from("timeline_events" as any) as any)
      .insert({
        event_year: parsedYear,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "published",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create timeline event");

    const dbCodes = await this.getValidLanguageCodes();
    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      timeline_event_id: data.id,
      language_code: this.resolveLangCode(lang, dbCodes),
      title: val.title || "",
      description: val.description || "",
    }));

    if (transPayloads.length > 0) {
      const { error: transErr } = await (this.supabase.from("timeline_event_translations" as any) as any).insert(transPayloads);
      if (transErr) throw new Error(transErr.message || "Failed to create timeline event translations");
    }

    const list = await this.getTimeline();
    return list.find((t) => t.id === String(data.id))!;
  }

  async updateTimeline(id: string, input: SaveTimelineInput): Promise<TimelineEntity> {
    const parsedYear = parseInt(String(input.eventYear), 10) || new Date().getFullYear();
    const { error: baseErr } = await (this.supabase.from("timeline_events" as any) as any)
      .update({
        event_year: parsedYear,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "published",
      })
      .eq("id", id);

    if (baseErr) throw new Error(baseErr.message || "Failed to update timeline event");

    const dbCodes = await this.getValidLanguageCodes();
    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      timeline_event_id: id,
      language_code: this.resolveLangCode(lang, dbCodes),
      title: val.title || "",
      description: val.description || "",
    }));

    for (const payload of transPayloads) {
      const { error: transErr } = await (this.supabase.from("timeline_event_translations" as any) as any).upsert(payload, {
        onConflict: "timeline_event_id,language_code",
      });
      if (transErr) throw new Error(transErr.message || "Failed to update timeline event translations");
    }

    const list = await this.getTimeline();
    return list.find((t) => t.id === id)!;
  }

  async deleteTimeline(id: string): Promise<void> {
    const { error } = await (this.supabase.from("timeline_events" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id);
    if (error) throw new Error(error.message || "Failed to delete timeline event");
  }

  async reorderTimeline(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("timeline_events" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message || "Failed to reorder timeline events");
  }

  async bulkDeleteTimeline(ids: string[]): Promise<void> {
    const { error } = await (this.supabase.from("timeline_events" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .in("id", ids);
    if (error) throw new Error(error.message || "Failed to bulk delete timeline events");
  }

  async bulkUpdateTimelineStatus(ids: string[], status: SectionStatus): Promise<void> {
    const { error } = await (this.supabase.from("timeline_events" as any) as any)
      .update({ status })
      .in("id", ids);
    if (error) throw new Error(error.message || "Failed to bulk update status for timeline events");
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
            status: item.status ?? "published",
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
        status: input.status ?? "published",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create team member");

    const dbCodes = await this.getValidLanguageCodes();
    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      team_member_id: data.id,
      language_code: this.resolveLangCode(lang, dbCodes),
      name: val.name || "",
      position: val.position || "",
      bio: val.bio || "",
    }));

    if (transPayloads.length > 0) {
      const { error: transErr } = await (this.supabase.from("team_member_translations" as any) as any).insert(transPayloads);
      if (transErr) throw new Error(transErr.message || "Failed to create team member translations");
    }

    const list = await this.getTeamMembers();
    return list.find((m) => m.id === String(data.id))!;
  }

  async updateTeamMember(id: string, input: SaveTeamMemberInput): Promise<TeamMemberEntity> {
    const { error: baseErr } = await (this.supabase.from("team_members" as any) as any)
      .update({
        photo_url: input.photoUrl ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "published",
      })
      .eq("id", id);

    if (baseErr) throw new Error(baseErr.message || "Failed to update team member");

    const dbCodes = await this.getValidLanguageCodes();
    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      team_member_id: id,
      language_code: this.resolveLangCode(lang, dbCodes),
      name: val.name || "",
      position: val.position || "",
      bio: val.bio || "",
    }));

    for (const payload of transPayloads) {
      const { error: transErr } = await (this.supabase.from("team_member_translations" as any) as any).upsert(payload, {
        onConflict: "team_member_id,language_code",
      });
      if (transErr) throw new Error(transErr.message || "Failed to update team member translations");
    }

    const list = await this.getTeamMembers();
    return list.find((m) => m.id === id)!;
  }

  async deleteTeamMember(id: string): Promise<void> {
    const { error } = await (this.supabase.from("team_members" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id);
    if (error) throw new Error(error.message || "Failed to delete team member");
  }

  async reorderTeamMembers(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("team_members" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message || "Failed to reorder team members");
  }

  async bulkDeleteTeamMembers(ids: string[]): Promise<void> {
    const { error } = await (this.supabase.from("team_members" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .in("id", ids);
    if (error) throw new Error(error.message || "Failed to bulk delete team members");
  }

  async bulkUpdateTeamMembersStatus(ids: string[], status: SectionStatus): Promise<void> {
    const { error } = await (this.supabase.from("team_members" as any) as any)
      .update({ status })
      .in("id", ids);
    if (error) throw new Error(error.message || "Failed to bulk update status for team members");
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
            status: item.status ?? "published",
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
        status: input.status ?? "published",
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create certificate");

    const dbCodes = await this.getValidLanguageCodes();
    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      certification_id: data.id,
      language_code: this.resolveLangCode(lang, dbCodes),
      title: val.title || "",
      description: val.description || "",
    }));

    if (transPayloads.length > 0) {
      const { error: transErr } = await (this.supabase.from("certification_translations" as any) as any).insert(transPayloads);
      if (transErr) throw new Error(transErr.message || "Failed to create certificate translations");
    }

    const list = await this.getCertificates();
    return list.find((c) => c.id === String(data.id))!;
  }

  async updateCertificate(id: string, input: SaveCertificateInput): Promise<AboutCertificateEntity> {
    const { error: baseErr } = await (this.supabase.from("certifications" as any) as any)
      .update({
        image_url: input.imageUrl ?? null,
        issued_by: input.issuedBy ?? null,
        issued_date: input.issuedDate ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "published",
      })
      .eq("id", id);

    if (baseErr) throw new Error(baseErr.message || "Failed to update certificate");

    const dbCodes = await this.getValidLanguageCodes();
    const transPayloads = Object.entries(input.translations).map(([lang, val]) => ({
      certification_id: id,
      language_code: this.resolveLangCode(lang, dbCodes),
      title: val.title || "",
      description: val.description || "",
    }));

    for (const payload of transPayloads) {
      const { error: transErr } = await (this.supabase.from("certification_translations" as any) as any).upsert(payload, {
        onConflict: "certification_id,language_code",
      });
      if (transErr) throw new Error(transErr.message || "Failed to update certificate translations");
    }

    const list = await this.getCertificates();
    return list.find((c) => c.id === id)!;
  }

  async deleteCertificate(id: string): Promise<void> {
    const { error } = await (this.supabase.from("certifications" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .eq("id", id);
    if (error) throw new Error(error.message || "Failed to delete certificate");
  }

  async reorderCertificates(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      (this.supabase.from("certifications" as any) as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message || "Failed to reorder certificates");
  }

  async bulkDeleteCertificates(ids: string[]): Promise<void> {
    const { error } = await (this.supabase.from("certifications" as any) as any)
      .update({ deleted_at: new Date().toISOString(), status: "archived" })
      .in("id", ids);
    if (error) throw new Error(error.message || "Failed to bulk delete certificates");
  }

  async bulkUpdateCertificatesStatus(ids: string[], status: SectionStatus): Promise<void> {
    const { error } = await (this.supabase.from("certifications" as any) as any)
      .update({ status })
      .in("id", ids);
    if (error) throw new Error(error.message || "Failed to bulk update status for certificates");
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
