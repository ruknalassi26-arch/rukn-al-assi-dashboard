// ==============================================================================
// features/services/data/mapper/service.mapper.ts
// Maps between Supabase DTOs and Service Domain Entity
// ==============================================================================
import {
  ServiceEntity,
  type ServiceTranslationProps,
} from "../../domain/entities/service.entity";
import type { ServiceWithTranslationsDTO } from "../dto/service.dto";

export function toServiceEntity(dto: ServiceWithTranslationsDTO): ServiceEntity {
  const transList = dto.service_translations ?? [];
  const translations: Record<string, ServiceTranslationProps> = {};

  for (const t of transList) {
    if (t.language_code) {
      translations[t.language_code] = {
        slug: t.slug || "",
        name: t.name || "",
        description: t.description || null,
        applications: t.applications || null,
      };
    }
  }

  return new ServiceEntity({
    id: dto.id,
    icon: dto.icon ?? null,
    heroImageUrl: dto.hero_image_url ?? null,
    status: dto.status ?? "published",
    isFeatured: dto.is_featured ?? false,
    featuredOrder: dto.featured_order ?? 0,
    sortOrder: dto.sort_order ?? 0,
    createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
    updatedAt: dto.updated_at ? new Date(dto.updated_at) : new Date(),
    translations,
  });
}
