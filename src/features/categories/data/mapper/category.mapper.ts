// ==============================================================================
// features/categories/data/mapper/category.mapper.ts
// Maps between Supabase DTOs (product_categories & product_category_translations) and Category Entity
// ==============================================================================
import { CategoryEntity, type CategoryTranslationProps } from "../../domain/entities/category.entity";
import type { CategoryWithTranslationsDTO } from "../dto/category.dto";

export function toCategoryEntity(dto: CategoryWithTranslationsDTO): CategoryEntity {
  const transList = dto.product_category_translations ?? [];
  const translations: Record<string, CategoryTranslationProps> = {};

  for (const t of transList) {
    if (t.language_code) {
      translations[t.language_code] = {
        slug: t.slug || "",
        name: t.name || "",
        description: t.description || "",
      };
    }
  }

  return new CategoryEntity({
    id: dto.id,
    imageUrl: dto.image_url ?? null,
    sortOrder: dto.sort_order ?? 0,
    status: dto.status ?? "published",
    createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
    updatedAt: dto.updated_at ? new Date(dto.updated_at) : new Date(),
    translations,
  });
}
