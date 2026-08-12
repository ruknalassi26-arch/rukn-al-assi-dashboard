// ==============================================================================
// features/team/data/mapper/team-member.mapper.ts
// Maps between Supabase Team Member DTOs and Team Member Domain Entity Classes
// ==============================================================================
import { TeamMemberEntity } from "../../domain/entities/team-member.entity";

export function toTeamMemberEntity(dto: any): TeamMemberEntity {
  return new TeamMemberEntity({
    id: dto.id,
    photo: dto.photo_url ?? dto.photo ?? null,
    fullNameEn: dto.full_name_en ?? dto.name_en ?? "",
    fullNameAr: dto.full_name_ar ?? dto.name_ar ?? "",
    fullNameKu: dto.full_name_ku ?? dto.name_ku ?? null,
    positionEn: dto.position_en ?? dto.position ?? null,
    positionAr: dto.position_ar ?? null,
    positionKu: dto.position_ku ?? null,
    biographyEn: dto.biography_en ?? dto.bio ?? null,
    biographyAr: dto.biography_ar ?? null,
    biographyKu: dto.biography_ku ?? null,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status === "published" ? "active" : "draft",
    createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
    updatedAt: dto.updated_at ? new Date(dto.updated_at) : new Date(),
  });
}
