// ==============================================================================
// features/team/data/dto/team-member.dto.ts
// Data Transfer Objects for Team Members from Supabase
// ==============================================================================
import type { Tables } from "@core/types/database.types";

export type TeamMemberDTO = Tables<"management_team">;
