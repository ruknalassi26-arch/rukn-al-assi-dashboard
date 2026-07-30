// ==============================================================================
// features/certificates/data/dto/certificate.dto.ts
// Data Transfer Objects for Certificates from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type CertificateDTO = Tables<"certificates">;
