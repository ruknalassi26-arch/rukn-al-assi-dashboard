// ==============================================================================
// features/authentication/data/dto/auth.dto.ts
// Data Transfer Objects for Supabase Authentication & RPC Responses
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

export interface RoleItemDto {
  id?: string;
  name?: string;
  slug?: string;
  is_system?: boolean;
}

export interface GetCurrentAdminUserProfileDto {
  profile: AdminProfileDTO | null;
  role: string | null;
  roles?: (string | RoleItemDto)[] | null;
  permissions: string[] | null;
  is_super_admin?: boolean;
}

export interface AuthUserDTO {
  user: SupabaseUser;
  profile?: AdminProfileDTO | null;
  role?: string;
  roles?: (string | RoleItemDto)[];
  permissions?: string[];
  is_super_admin?: boolean;
}
