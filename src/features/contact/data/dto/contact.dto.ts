// ==============================================================================
// features/contact/data/dto/contact.dto.ts
// Data Transfer Objects for Contact Info & Branches from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type ContactInfoDTO = Tables<"website_settings">;
export type BranchRowDTO = Tables<"branches">;
export type BranchTranslationDTO = Tables<"branch_translations">;

export type BranchWithTranslationsDTO = BranchRowDTO & {
  branch_translations?: BranchTranslationDTO[];
};

export type BranchDTO = BranchWithTranslationsDTO;
