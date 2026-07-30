// ==============================================================================
// features/about/data/dto/about.dto.ts
// Data Transfer Objects for About Us Management
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type CompanyInfoDTO = Tables<"company_info">;
export type CompanyMissionDTO = Tables<"company_mission">;
export type CompanyVisionDTO = Tables<"company_vision">;
export type CoreValueDTO = Tables<"core_values">;
export type CompanyTimelineDTO = Tables<"company_timeline">;
export type ManagementTeamDTO = Tables<"management_team">;
export type AboutCertificateDTO = Tables<"certificates">;
