// ==============================================================================
// features/dashboard/data/dto/dashboard.dto.ts
// Data Transfer Objects — the exact shapes returned by Supabase queries
// ==============================================================================
import type { Tables } from "@core/types/database.types";

/**
 * Activity log DTO — direct Supabase row shape.
 */
export type ActivityLogDTO = Tables<"activity_logs">;

/**
 * RFQ summary DTO — selected columns for the dashboard table.
 */
export interface LatestRfqDTO {
  id: string;
  reference_number: string;
  contact_name: string;
  company_name: string;
  email: string;
  phone: string | null;
  status: "pending" | "reviewed" | "quoted" | "closed";
  created_at: string;
}

/**
 * Contact summary DTO — selected columns for the dashboard table.
 */
export interface LatestContactDTO {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  status: "new" | "read" | "replied";
  created_at: string;
}

/**
 * Raw monthly count from Supabase (computed client-side from date grouping).
 */
export interface MonthlyCountDTO {
  month: string;
  count: number;
}
