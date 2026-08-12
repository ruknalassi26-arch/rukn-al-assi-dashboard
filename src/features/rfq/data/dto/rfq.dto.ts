// ==============================================================================
// features/rfq/data/dto/rfq.dto.ts
// Data Transfer Objects for RFQ Requests, Items & Attachments from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type RfqDTO = Tables<"rfq_requests">;
export type RfqItemDTO = Tables<"rfq_items">;
export type RfqAttachmentDTO = Tables<"rfq_attachments">;

export type RfqItemWithRelationDTO = RfqItemDTO & {
  products?: {
    id: string;
    sku: string | null;
    product_translations?: Array<{
      language_code: string;
      name: string;
    }>;
  } | null;
  services?: {
    id: string;
    service_translations?: Array<{
      language_code: string;
      name: string;
    }>;
  } | null;
};

export type RfqJoinDTO = RfqDTO & {
  rfq_items?: RfqItemWithRelationDTO[];
  rfq_attachments?: RfqAttachmentDTO[];
};
