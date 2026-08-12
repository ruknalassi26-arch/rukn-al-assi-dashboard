// ==============================================================================
// features/projects/data/dto/project-category.dto.ts
// DTOs for project_categories and project_category_translations
// ==============================================================================

export interface ProjectCategoryTranslationDTO {
  project_category_id: string;
  language_code: string;
  slug: string | null;
  name: string | null;
  description: string | null;
}

export interface ProjectCategoryJoinDTO {
  id: string;
  status: string;
  deleted_at: string | null;
  created_at?: string;
  updated_at?: string;
  project_category_translations: ProjectCategoryTranslationDTO[] | null;
}
