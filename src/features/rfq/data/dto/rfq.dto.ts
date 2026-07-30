// ==============================================================================
// features/rfq/data/dto/rfq.dto.ts
// Data Transfer Objects for RFQ Requests from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type RfqDTO = Tables<"rfq_requests">;
