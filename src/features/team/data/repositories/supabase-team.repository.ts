// ==============================================================================
// features/team/data/repositories/supabase-team.repository.ts
// Supabase Data Repository Implementation for Team Members Management
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { UpdateTables } from "@core/types/database.types";
import type {
  ITeamRepository,
  TeamFilterParams,
  PaginatedTeamMembers,
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
} from "../../domain/repositories/i-team.repository";
import { TeamMemberEntity } from "../../domain/entities/team-member.entity";
import type { TeamMemberStatus } from "../../domain/entities/team-member.entity";
import { toTeamMemberEntity } from "../mapper/team-member.mapper";
import type { TeamMemberDTO } from "../dto/team-member.dto";

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
      await this.supabase.from("activity_logs").insert({
        action,
        entity_type: "homepage",
        entity_id: entityId,
        entity_title: entityTitle,
        user_id: userData.user?.id ?? null,
        user_email: userData.user?.email ?? null,
        metadata: metadata ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getTeamMembers(params?: TeamFilterParams): Promise<PaginatedTeamMembers> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;
    const sortBy = params?.sortBy ?? "sort_order";
    const sortOrder = params?.sortOrder ?? "asc";

    let query = this.supabase
      .from("management_team")
      .select("*", { count: "exact" });

    // Search filter
    if (params?.search && params.search.trim() !== "") {
      const searchStr = params.search.trim();
      query = query.or(
        `full_name_en.ilike.%${searchStr}%,full_name_ar.ilike.%${searchStr}%,position_en.ilike.%${searchStr}%,email.ilike.%${searchStr}%`
      );
    }

    // Status filter
    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error || !data) {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }

    const items = (data as TeamMemberDTO[]).map(toTeamMemberEntity);
    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getTeamMemberById(id: string): Promise<TeamMemberEntity | null> {
    const { data, error } = await this.supabase
      .from("management_team")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toTeamMemberEntity(data as TeamMemberDTO);
  }

  async createTeamMember(input: CreateTeamMemberInput): Promise<TeamMemberEntity> {
    const payload = {
      full_name_en: input.fullNameEn,
      full_name_ar: input.fullNameAr,
      full_name_ku: input.fullNameKu ?? null,
      position_en: input.positionEn ?? null,
      position_ar: input.positionAr ?? null,
      position_ku: input.positionKu ?? null,
      department_en: input.departmentEn ?? null,
      department_ar: input.departmentAr ?? null,
      department_ku: input.departmentKu ?? null,
      biography_en: input.biographyEn ?? null,
      biography_ar: input.biographyAr ?? null,
      biography_ku: input.biographyKu ?? null,
      photo: input.photo ?? null,
      linkedin: input.linkedin ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      sort_order: input.sortOrder ?? 0,
      status: input.status ?? "active",
    };

    const { data, error } = await this.supabase
      .from("management_team")
      .insert(payload)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create team member");

    const created = toTeamMemberEntity(data as TeamMemberDTO);
    await this.logActivity("created", created.id, created.fullNameEn);
    return created;
  }

  async updateTeamMember(input: UpdateTeamMemberInput): Promise<TeamMemberEntity> {
    const payload: UpdateTables<"management_team"> = {
      updated_at: new Date().toISOString(),
    };

    if (input.fullNameEn !== undefined) payload.full_name_en = input.fullNameEn;
    if (input.fullNameAr !== undefined) payload.full_name_ar = input.fullNameAr;
    if (input.fullNameKu !== undefined) payload.full_name_ku = input.fullNameKu;
    if (input.positionEn !== undefined) payload.position_en = input.positionEn;
    if (input.positionAr !== undefined) payload.position_ar = input.positionAr;
    if (input.positionKu !== undefined) payload.position_ku = input.positionKu;
    if (input.departmentEn !== undefined) payload.department_en = input.departmentEn;
    if (input.departmentAr !== undefined) payload.department_ar = input.departmentAr;
    if (input.departmentKu !== undefined) payload.department_ku = input.departmentKu;
    if (input.biographyEn !== undefined) payload.biography_en = input.biographyEn;
    if (input.biographyAr !== undefined) payload.biography_ar = input.biographyAr;
    if (input.biographyKu !== undefined) payload.biography_ku = input.biographyKu;
    if (input.photo !== undefined) payload.photo = input.photo;
    if (input.linkedin !== undefined) payload.linkedin = input.linkedin;
    if (input.email !== undefined) payload.email = input.email;
    if (input.phone !== undefined) payload.phone = input.phone;
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;
    if (input.status !== undefined) payload.status = input.status;

    const { data, error } = await this.supabase
      .from("management_team")
      .update(payload)
      .eq("id", input.id)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update team member");

    const updated = toTeamMemberEntity(data as TeamMemberDTO);
    await this.logActivity("updated", updated.id, updated.fullNameEn);
    return updated;
  }

  async deleteTeamMember(id: string): Promise<void> {
    const existing = await this.getTeamMemberById(id);

    const { error } = await this.supabase
      .from("management_team")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.fullNameEn ?? "Team Member");
  }

  async bulkDeleteTeamMembers(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("management_team")
      .delete()
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("deleted", null, `${ids.length} team members`, { count: ids.length });
  }

  async bulkUpdateTeamMemberStatus(ids: string[], status: TeamMemberStatus): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("management_team")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("updated", null, `Bulk updated status to ${status}`, { ids, status });
  }
}
