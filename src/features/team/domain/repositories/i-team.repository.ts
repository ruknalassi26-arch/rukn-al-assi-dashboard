// ==============================================================================
// features/team/domain/repositories/i-team.repository.ts
// ITeamRepository Contract Interface
// ==============================================================================
import type { TeamMemberEntity, TeamMemberStatus } from "../entities/team-member.entity";

export interface TeamFilterParams {
  search?: string;
  status?: TeamMemberStatus | "all";
  page?: number;
  limit?: number;
  sortBy?: "full_name_en" | "sort_order" | "created_at";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedTeamMembers {
  items: TeamMemberEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTeamMemberInput {
  fullNameEn: string;
  fullNameAr: string;
  fullNameKu?: string | null;
  positionEn?: string | null;
  positionAr?: string | null;
  positionKu?: string | null;
  departmentEn?: string | null;
  departmentAr?: string | null;
  departmentKu?: string | null;
  biographyEn?: string | null;
  biographyAr?: string | null;
  biographyKu?: string | null;
  photo?: string | null;
  linkedin?: string | null;
  email?: string | null;
  phone?: string | null;
  sortOrder?: number;
  status?: TeamMemberStatus;
}

export interface UpdateTeamMemberInput extends Partial<CreateTeamMemberInput> {
  id: string;
}

export interface ITeamRepository {
  getTeamMembers(params?: TeamFilterParams): Promise<PaginatedTeamMembers>;
  getTeamMemberById(id: string): Promise<TeamMemberEntity | null>;
  createTeamMember(input: CreateTeamMemberInput): Promise<TeamMemberEntity>;
  updateTeamMember(input: UpdateTeamMemberInput): Promise<TeamMemberEntity>;
  deleteTeamMember(id: string): Promise<void>;
  bulkDeleteTeamMembers(ids: string[]): Promise<void>;
  bulkUpdateTeamMemberStatus(ids: string[], status: TeamMemberStatus): Promise<void>;
}
