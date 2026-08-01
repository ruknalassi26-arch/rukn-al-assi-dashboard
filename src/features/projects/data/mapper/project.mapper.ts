// ==============================================================================
// features/projects/data/mapper/project.mapper.ts
// Maps between Supabase ProjectDTO and ProjectEntity
// ==============================================================================
import { ProjectEntity } from "../../domain/entities/project.entity";
import type { ProjectDTO } from "../dto/project.dto";

export function toProjectEntity(dto: ProjectDTO, categoryName?: string | null): ProjectEntity {
  return new ProjectEntity({
    id: dto.id,
    slug: dto.slug,
    titleEn: dto.title_en,
    titleAr: dto.title_ar,
    titleKu: dto.title_ku ?? null,
    shortDescriptionEn: dto.short_description_en ?? null,
    shortDescriptionAr: dto.short_description_ar ?? null,
    shortDescriptionKu: dto.short_description_ku ?? null,
    descriptionEn: dto.description_en ?? null,
    descriptionAr: dto.description_ar ?? null,
    descriptionKu: dto.description_ku ?? null,
    categoryId: dto.category_id ?? null,
    categoryName: categoryName ?? null,
    client: dto.client ?? null,
    location: dto.location ?? null,
    year: dto.year ?? null,
    completionDate: dto.completion_date ?? null,
    coverImage: dto.cover_image ?? (dto.images && dto.images.length > 0 ? dto.images[0] : null),
    images: dto.images ?? [],
    status: dto.status,
    isFeatured: dto.is_featured,
    sortOrder: dto.sort_order,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}
