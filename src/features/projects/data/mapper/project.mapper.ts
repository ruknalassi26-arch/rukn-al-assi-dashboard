// ==============================================================================
// features/projects/data/mapper/project.mapper.ts
// Maps between Supabase Project DTO and ProjectEntity
// ==============================================================================
import { ProjectEntity, type ProjectStatus } from "../../domain/entities/project.entity";

export function toProjectEntity(dto: any, categoryName?: string | null): ProjectEntity {
  const transList = dto.project_translations || [];
  const en = transList.find((t: any) => t.language_code === "en") || { slug: dto.slug, title: dto.title_en, description: dto.description_en };
  const ar = transList.find((t: any) => t.language_code === "ar") || { slug: null, title: dto.title_ar, description: dto.description_ar };
  const ku = transList.find((t: any) => t.language_code === "ku" || t.language_code === "ckb") || { slug: null, title: dto.title_ku, description: dto.description_ku };

  const rawImages = (dto.project_images || []).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const images = rawImages.length > 0 ? rawImages.map((img: any) => img.image_url) : (dto.images ?? []);

  return new ProjectEntity({
    id: dto.id,
    categoryId: dto.category_id ?? null,
    categoryName: categoryName ?? null,
    clientName: dto.client_name ?? dto.client ?? null,
    location: dto.location ?? null,
    completionDate: dto.completion_date ?? null,
    status: (dto.status as ProjectStatus) || "published",
    isFeatured: dto.is_featured ?? false,
    featuredOrder: dto.featured_order ?? 0,
    sortOrder: dto.sort_order ?? 0,

    titleEn: en.title || dto.title_en || "Untitled Project",
    titleAr: ar.title || dto.title_ar || null,
    titleKu: ku.title || dto.title_ku || null,
    slugEn: en.slug || dto.slug || null,
    slugAr: ar.slug || null,
    slugKu: ku.slug || null,
    descriptionEn: en.description || dto.description_en || null,
    descriptionAr: ar.description || dto.description_ar || null,
    descriptionKu: ku.description || dto.description_ku || null,
    challengeEn: en.challenge || null,
    challengeAr: ar.challenge || null,
    challengeKu: ku.challenge || null,
    solutionEn: en.solution || null,
    solutionAr: ar.solution || null,
    solutionKu: ku.solution || null,

    images,
    createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
    updatedAt: dto.updated_at ? new Date(dto.updated_at) : new Date(),
  });
}
