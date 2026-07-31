// ==============================================================================
// features/contact-messages/data/dto/contact-message.dto.ts
// Data Transfer Objects for Contact Messages from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type ContactMessageDTO = Tables<"contact_submissions">;
