// ==============================================================================
// features/projects/data/dto/project.dto.ts
// Data Transfer Object for projects table
// ==============================================================================
import type { ProjectStatus } from "../../domain/entities/project.entity";

export interface ProjectDTO {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  title_ku?: string | null;
  short_description_en?: string | null;
  short_description_ar?: string | null;
  short_description_ku?: string | null;
  description_en?: string | null;
  description_ar?: string | null;
  description_ku?: string | null;
  category_id?: string | null;
  client?: string | null;
  location?: string | null;
  year?: number | null;
  completion_date?: string | null;
  cover_image?: string | null;
  images: string[];
  status: ProjectStatus;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
