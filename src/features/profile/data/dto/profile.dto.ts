// ==============================================================================
// features/profile/data/dto/profile.dto.ts
// Profile DTO Interface
// ==============================================================================
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface ProfileRecordDTO {
  id: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
}

export interface ProfileUserDTO {
  user: SupabaseUser;
  profile?: ProfileRecordDTO | null;
  role?: string;
  permissions?: string[];
}
