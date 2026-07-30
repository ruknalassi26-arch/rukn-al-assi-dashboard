// ==============================================================================
// features/services/data/dto/service.dto.ts
// Data Transfer Objects for Services from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type ServiceDTO = Tables<"services">;
