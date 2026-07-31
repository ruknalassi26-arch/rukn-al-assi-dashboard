// ==============================================================================
// features/settings/data/dto/settings.dto.ts
// Data Transfer Objects for Website Settings from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type WebsiteSettingsDTO = Tables<"website_settings">;
