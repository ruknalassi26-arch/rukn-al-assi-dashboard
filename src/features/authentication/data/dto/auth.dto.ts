// ==============================================================================
// features/authentication/data/dto/auth.dto.ts
// Data Transfer Objects for Supabase Authentication
// ==============================================================================
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface AdminProfileDTO {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
}

export interface AuthUserDTO {
  user: SupabaseUser;
  profile?: AdminProfileDTO | null;
  role?: string;
  permissions?: string[];
}
