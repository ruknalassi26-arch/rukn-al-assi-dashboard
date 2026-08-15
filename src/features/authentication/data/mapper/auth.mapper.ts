// ==============================================================================
// features/authentication/data/mapper/auth.mapper.ts
// Maps between Supabase DTOs and UserProfile Domain Entity Class
// Parses role and roles cleanly whether they are strings or JSON objects
// ==============================================================================
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { UserProfileEntity } from "../../domain/entities/user-profile.entity";
import type { AuthUserDTO, GetCurrentAdminUserProfileDto, RoleItemDto } from "../dto/auth.dto";

function parseSingleRole(rawRole: unknown): string {
  if (typeof rawRole === "string" && rawRole.trim()) {
    return rawRole.trim();
  }
  if (rawRole && typeof rawRole === "object") {
    const obj = rawRole as Record<string, unknown>;
    const val = obj.slug || obj.name;
    if (val) return String(val).trim();
  }
  return "viewer";
}

function parseRolesArray(rawRoles: (string | RoleItemDto)[] | null | undefined, fallbackRole: string): string[] {
  if (!rawRoles || rawRoles.length === 0) return [fallbackRole];
  const parsed: string[] = [];
  for (const item of rawRoles) {
    if (typeof item === "string" && item.trim()) {
      parsed.push(item);
    } else if (item && typeof item === "object") {
      const val = item.slug || item.name;
      if (val) parsed.push(String(val));
    }
  }
  return parsed.length > 0 ? parsed : [fallbackRole];
}

export function mapAdminUserProfileDtoToEntity(
  user: SupabaseUser,
  dto: GetCurrentAdminUserProfileDto
): UserProfileEntity {
  const profile = dto.profile;
  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Admin User";

  const role = parseSingleRole(dto.role);
  const roles = parseRolesArray(dto.roles, role);
  const isSuperAdmin = dto.is_super_admin ?? (role === "super_admin" || role === "Super Admin");
  const permissions = dto.permissions ?? (isSuperAdmin ? ["*"] : []);

  return new UserProfileEntity({
    id: user.id,
    email: user.email ?? "",
    fullName,
    avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
    role,
    roles,
    permissions,
    isSuperAdmin,
    isActive: profile?.is_active ?? true,
    lastLoginAt: profile?.last_login_at ? new Date(profile.last_login_at) : null,
    createdAt: new Date(user.created_at),
  });
}

export function toUserProfileEntity(dto: AuthUserDTO): UserProfileEntity {
  const user = dto.user;
  const profile = dto.profile;

  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Admin User";

  const role = parseSingleRole(dto.role);
  const roles = parseRolesArray(dto.roles, role);
  const isSuper = dto.is_super_admin ?? (role === "super_admin" || role === "Super Admin");

  return new UserProfileEntity({
    id: user.id,
    email: user.email ?? "",
    fullName,
    avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
    role,
    roles,
    permissions: dto.permissions ?? (isSuper ? ["*"] : []),
    isSuperAdmin: isSuper,
    isActive: profile?.is_active ?? true,
    lastLoginAt: profile?.last_login_at ? new Date(profile.last_login_at) : null,
    createdAt: new Date(user.created_at),
  });
}
