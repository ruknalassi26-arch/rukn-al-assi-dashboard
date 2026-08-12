// ==============================================================================
// features/team/data/repositories/supabase-team.repository.ts
// Supabase Data Repository Implementation for Team Members Management
// Strictly matching official SQL Schema (team_members & team_member_translations)
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  ITeamRepository,
  TeamFilterParams,
  PaginatedTeamMembers,
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
} from "../../domain/repositories/i-team.repository";
import { TeamMemberEntity } from "../../domain/entities/team-member.entity";
import type { TeamMemberStatus } from "../../domain/entities/team-member.entity";

interface TeamTranslationDTO {
  team_member_id: string;
  language_code: string;
  name: string | null;
  position: string | null;
  bio: string | null;
}

interface TeamMemberJoinDTO {
  id: string;
  photo_url: string | null;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
  team_member_translations: TeamTranslationDTO[] | null;
}

function mapTeamMemberDTOToEntity(item: TeamMemberJoinDTO): TeamMemberEntity {
  const transList = item.team_member_translations || [];
  const en = transList.find((t) => t.language_code === "en") || { name: null, position: null, bio: null };
  const ar = transList.find((t) => t.language_code === "ar") || { name: null, position: null, bio: null };
  const ku = transList.find((t) => t.language_code === "ku" || t.language_code === "ckb") || { name: null, position: null, bio: null };

  return new TeamMemberEntity({
    id: item.id,
    fullNameEn: en.name || "",
    fullNameAr: ar.name || "",
    fullNameKu: ku.name || "",
    positionEn: en.position || "",
    positionAr: ar.position || "",
    positionKu: ku.position || "",
    biographyEn: en.bio || "",
    biographyAr: ar.bio || "",
    biographyKu: ku.bio || "",
    photo: item.photo_url || null,
    sortOrder: item.sort_order ?? 0,
    status: item.status === "published" ? "active" : "draft",
    createdAt: item.created_at ? new Date(item.created_at) : new Date(),
    updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
  });
}

export class SupabaseTeamRepository implements ITeamRepository {
  private get supabase() {
    return createClient();
  }

  private async logActivity(
    action: string,
    entityId: string | null,
    entityTitle: string | null,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      await (this.supabase.from("activity_log" as any) as any).insert({
        action,
        entity_type: "team",
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getTeamMembers(params?: TeamFilterParams): Promise<PaginatedTeamMembers> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;

    try {
      const { data, count, error } = await (this.supabase.from("team_members" as any) as any)
        .select("*, team_member_translations(*)", { count: "exact" })
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .range(offset, offset + limit - 1);

      if (error || !data) {
        return { items: [], total: 0, page, limit, totalPages: 0 };
      }

      const rawRows = data as unknown as TeamMemberJoinDTO[];
      const items = rawRows.map(mapTeamMemberDTOToEntity);

      const total = count ?? items.length;
      const totalPages = Math.ceil(total / limit);

      return { items, total, page, limit, totalPages };
    } catch {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }
  }

  async getTeamMemberById(id: string): Promise<TeamMemberEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("team_members" as any) as any)
        .select("*, team_member_translations(*)")
        .eq("id", id)
        .single();

      if (error || !data) return null;

      return mapTeamMemberDTOToEntity(data as unknown as TeamMemberJoinDTO);
    } catch {
      return null;
    }
  }

  async createTeamMember(input: CreateTeamMemberInput): Promise<TeamMemberEntity> {
    const { data, error } = await (this.supabase.from("team_members" as any) as any)
      .insert({
        photo_url: input.photo ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status === "active" ? "published" : "draft",
      })
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create team member");

    const transPayloads = [];

    if (input.fullNameEn?.trim()) {
      transPayloads.push({
        team_member_id: data.id,
        language_code: "en",
        name: input.fullNameEn.trim(),
        position: input.positionEn?.trim() || null,
        bio: input.biographyEn?.trim() || null,
      });
    }

    if (input.fullNameAr?.trim()) {
      transPayloads.push({
        team_member_id: data.id,
        language_code: "ar",
        name: input.fullNameAr.trim(),
        position: input.positionAr?.trim() || null,
        bio: input.biographyAr?.trim() || null,
      });
    }

    if (input.fullNameKu?.trim()) {
      transPayloads.push({
        team_member_id: data.id,
        language_code: "ku",
        name: input.fullNameKu.trim(),
        position: input.positionKu?.trim() || null,
        bio: input.biographyKu?.trim() || null,
      });
    }

    if (transPayloads.length > 0) {
      const { error: transErr } = await (this.supabase.from("team_member_translations" as any) as any).insert(transPayloads);
      if (transErr) throw new Error(transErr.message || "Failed to save team member translations");
    }

    const created = (await this.getTeamMemberById(data.id))!;
    await this.logActivity("created", created.id, created.fullNameEn);
    return created;
  }

  async updateTeamMember(input: UpdateTeamMemberInput): Promise<TeamMemberEntity> {
    const updatePayload: Record<string, any> = {};
    if (input.photo !== undefined) updatePayload.photo_url = input.photo;
    if (input.sortOrder !== undefined) updatePayload.sort_order = input.sortOrder;
    if (input.status !== undefined) updatePayload.status = input.status === "active" ? "published" : "draft";

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await (this.supabase.from("team_members" as any) as any)
        .update(updatePayload)
        .eq("id", input.id);
      if (error) throw new Error(error.message);
    }

    // English Translation
    if (input.fullNameEn !== undefined || input.positionEn !== undefined || input.biographyEn !== undefined) {
      if (input.fullNameEn?.trim()) {
        await (this.supabase.from("team_member_translations" as any) as any).upsert(
          {
            team_member_id: input.id,
            language_code: "en",
            name: input.fullNameEn.trim(),
            position: input.positionEn?.trim() || null,
            bio: input.biographyEn?.trim() || null,
          },
          { onConflict: "team_member_id,language_code" }
        );
      }
    }

    // Arabic Translation
    if (input.fullNameAr !== undefined || input.positionAr !== undefined || input.biographyAr !== undefined) {
      if (input.fullNameAr?.trim()) {
        await (this.supabase.from("team_member_translations" as any) as any).upsert(
          {
            team_member_id: input.id,
            language_code: "ar",
            name: input.fullNameAr.trim(),
            position: input.positionAr?.trim() || null,
            bio: input.biographyAr?.trim() || null,
          },
          { onConflict: "team_member_id,language_code" }
        );
      } else {
        await (this.supabase.from("team_member_translations" as any) as any)
          .delete()
          .eq("team_member_id", input.id)
          .eq("language_code", "ar");
      }
    }

    // Kurdish Translation
    if (input.fullNameKu !== undefined || input.positionKu !== undefined || input.biographyKu !== undefined) {
      if (input.fullNameKu?.trim()) {
        await (this.supabase.from("team_member_translations" as any) as any).upsert(
          {
            team_member_id: input.id,
            language_code: "ku",
            name: input.fullNameKu.trim(),
            position: input.positionKu?.trim() || null,
            bio: input.biographyKu?.trim() || null,
          },
          { onConflict: "team_member_id,language_code" }
        );
      } else {
        await (this.supabase.from("team_member_translations" as any) as any)
          .delete()
          .eq("team_member_id", input.id)
          .eq("language_code", "ku");
      }
    }

    const updated = (await this.getTeamMemberById(input.id))!;
    await this.logActivity("updated", updated.id, updated.fullNameEn);
    return updated;
  }

  async deleteTeamMember(id: string): Promise<void> {
    const existing = await this.getTeamMemberById(id);
    await (this.supabase.from("team_members" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    await this.logActivity("deleted", id, existing?.fullNameEn ?? "Team Member");
  }

  async bulkDeleteTeamMembers(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await (this.supabase.from("team_members" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids);
    await this.logActivity("deleted", null, `${ids.length} team members`, { count: ids.length });
  }

  async bulkUpdateTeamMemberStatus(ids: string[], status: TeamMemberStatus): Promise<void> {
    if (ids.length === 0) return;
    await (this.supabase.from("team_members" as any) as any)
      .update({ status: status === "active" ? "published" : "draft" })
      .in("id", ids);
    await this.logActivity("updated", null, `Bulk updated status to ${status}`, { ids, status });
  }
}
