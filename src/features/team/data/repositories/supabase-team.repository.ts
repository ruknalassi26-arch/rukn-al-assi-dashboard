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

export class SupabaseTeamRepository implements ITeamRepository {
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

      const items = data.map((item: any) => {
        const transList: any[] = item.team_member_translations || [];
        const en = transList.find((t: any) => t.language_code === "en") || {};
        const ar = transList.find((t: any) => t.language_code === "ar") || {};
        const ku = transList.find((t: any) => t.language_code === "ku") || {};
        return new TeamMemberEntity({
          id: item.id,
          fullNameEn: en.name || "Team Member",
          fullNameAr: ar.name || "عضو الفريق",
          fullNameKu: ku.name || "",
          positionEn: en.position || "",
          positionAr: ar.position || "",
          positionKu: ku.position || "",
          departmentEn: "",
          departmentAr: "",
          departmentKu: "",
          biographyEn: en.bio || "",
          biographyAr: ar.bio || "",
          biographyKu: ku.bio || "",
          photo: item.photo_url || "",
          linkedin: "",
          email: "",
          phone: "",
          sortOrder: item.sort_order ?? 0,
          status: item.status === "published" ? "active" : "draft",
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
        });
      });

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

      const transList: any[] = data.team_member_translations || [];
      const en = transList.find((t: any) => t.language_code === "en") || {};
      const ar = transList.find((t: any) => t.language_code === "ar") || {};
      const ku = transList.find((t: any) => t.language_code === "ku") || {};

      return new TeamMemberEntity({
        id: data.id,
        fullNameEn: en.name || "Team Member",
        fullNameAr: ar.name || "عضو الفريق",
        fullNameKu: ku.name || "",
        positionEn: en.position || "",
        positionAr: ar.position || "",
        positionKu: ku.position || "",
        departmentEn: "",
        departmentAr: "",
        departmentKu: "",
        biographyEn: en.bio || "",
        biographyAr: ar.bio || "",
        biographyKu: ku.bio || "",
        photo: data.photo_url || "",
        linkedin: "",
        email: "",
        phone: "",
        sortOrder: data.sort_order ?? 0,
        status: data.status === "published" ? "active" : "draft",
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
      });
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

    await (this.supabase.from("team_member_translations" as any) as any).insert([
      { team_member_id: data.id, language_code: "en", name: input.fullNameEn, position: input.positionEn, bio: input.biographyEn },
      { team_member_id: data.id, language_code: "ar", name: input.fullNameAr, position: input.positionAr, bio: input.biographyAr },
      { team_member_id: data.id, language_code: "ku", name: input.fullNameKu ?? input.fullNameEn, position: input.positionKu, bio: input.biographyKu },
    ]);

    const created = (await this.getTeamMemberById(data.id))!;
    await this.logActivity("created", created.id, created.fullNameEn);
    return created;
  }

  async updateTeamMember(input: UpdateTeamMemberInput): Promise<TeamMemberEntity> {
    await (this.supabase.from("team_members" as any) as any)
      .update({
        photo_url: input.photo,
        sort_order: input.sortOrder,
        status: input.status === "active" ? "published" : "draft",
      })
      .eq("id", input.id);

    if (input.fullNameEn !== undefined || input.positionEn !== undefined || input.biographyEn !== undefined) {
      await (this.supabase.from("team_member_translations" as any) as any).upsert({
        team_member_id: input.id,
        language_code: "en",
        name: input.fullNameEn || "",
        position: input.positionEn || "",
        bio: input.biographyEn || "",
      });
    }
    if (input.fullNameAr !== undefined || input.positionAr !== undefined || input.biographyAr !== undefined) {
      await (this.supabase.from("team_member_translations" as any) as any).upsert({
        team_member_id: input.id,
        language_code: "ar",
        name: input.fullNameAr || "",
        position: input.positionAr || "",
        bio: input.biographyAr || "",
      });
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
