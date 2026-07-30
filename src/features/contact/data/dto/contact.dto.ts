// ==============================================================================
// features/contact/data/dto/contact.dto.ts
// Data Transfer Objects for Contact Info & Branches from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type ContactInfoDTO = Tables<"website_settings">;
export type BranchDTO = Tables<"company_branches">;
