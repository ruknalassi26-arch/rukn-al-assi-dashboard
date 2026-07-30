// ==============================================================================
// features/team/data/mapper/team-member.mapper.ts
// Maps between Supabase Team Member DTOs and Team Member Domain Entity Classes
// ==============================================================================
import { TeamMemberEntity } from "../../domain/entities/team-member.entity";
import type { TeamMemberDTO } from "../dto/team-member.dto";

export function toTeamMemberEntity(dto: TeamMemberDTO): TeamMemberEntity {
  return new TeamMemberEntity({
    id: dto.id,
    photo: dto.photo,
    fullNameEn: dto.full_name_en,
    fullNameAr: dto.full_name_ar,
    fullNameKu: dto.full_name_ku ?? null,
    positionEn: dto.position_en,
    positionAr: dto.position_ar,
    positionKu: dto.position_ku ?? null,
    departmentEn: dto.department_en ?? null,
    departmentAr: dto.department_ar ?? null,
    departmentKu: dto.department_ku ?? null,
    biographyEn: dto.biography_en,
    biographyAr: dto.biography_ar,
    biographyKu: dto.biography_ku ?? null,
    linkedin: dto.linkedin,
    email: dto.email,
    phone: dto.phone,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}
