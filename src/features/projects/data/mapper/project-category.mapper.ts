// ==============================================================================
// features/projects/data/mapper/project-category.mapper.ts
// Maps Supabase ProjectCategoryJoinDTO to ProjectCategoryEntity
// ==============================================================================
import { ProjectCategoryEntity, type ProjectCategoryStatus } from "../../domain/entities/project-category.entity";
import type { ProjectCategoryJoinDTO, ProjectCategoryTranslationDTO } from "../dto/project-category.dto";

export function toProjectCategoryEntity(dto: ProjectCategoryJoinDTO): ProjectCategoryEntity {
  const transList = dto.project_category_translations || [];
  const emptyTrans: Partial<ProjectCategoryTranslationDTO> = {};
  const en = transList.find((t) => t.language_code === "en") || emptyTrans;
  const ar = transList.find((t) => t.language_code === "ar") || emptyTrans;
  const ku = transList.find((t) => t.language_code === "ku" || t.language_code === "ckb") || emptyTrans;

  return new ProjectCategoryEntity({
    id: dto.id,
    status: (dto.status as ProjectCategoryStatus) || "published",
    nameEn: en.name || "Category",
    nameAr: ar.name || null,
    nameKu: ku.name || null,
    slugEn: en.slug || null,
    slugAr: ar.slug || null,
    slugKu: ku.slug || null,
    createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
    updatedAt: dto.updated_at ? new Date(dto.updated_at) : new Date(),
  });
}
