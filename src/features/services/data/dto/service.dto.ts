// ==============================================================================
// features/services/data/dto/service.dto.ts
// Data Transfer Objects for Services matching exact Supabase Schema
// ==============================================================================

export interface ServiceRow {
  id: string;
  icon: string | null;
  hero_image_url: string | null;
  status: "published" | "draft" | "archived";
  is_featured: boolean;
  featured_order: number | null;
  sort_order: number;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceTranslationRow {
  service_id: string;
  language_code: string;
  slug: string;
  name: string;
  description: string | null;
  applications: string | null;
  search_vector?: string | null;
}

export interface ServiceWithTranslationsDTO extends ServiceRow {
  service_translations?: ServiceTranslationRow[];
}

export type ServiceDTO = ServiceWithTranslationsDTO;
