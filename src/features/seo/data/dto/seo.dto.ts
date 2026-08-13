// ==============================================================================
// features/seo/data/dto/seo.dto.ts
// Data Transfer Objects for SEO Settings from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type SeoSettingDTO = Tables<"seo_meta">;
