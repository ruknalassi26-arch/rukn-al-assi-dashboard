// ==============================================================================
// features/projects/data/dto/project-category.dto.ts
// DTOs for project_categories and project_category_translations
// Strictly matching project_categories (id, status, deleted_at)
// and project_category_translations (project_category_id, language_code, slug, name)
// ==============================================================================

export interface ProjectCategoryTranslationDTO {
  project_category_id: string;
  language_code: string;
  slug: string | null;
  name: string | null;
}

export interface ProjectCategoryJoinDTO {
  id: string;
  status: string;
  deleted_at: string | null;
  created_at?: string;
  updated_at?: string;
  project_category_translations: ProjectCategoryTranslationDTO[] | null;
}
