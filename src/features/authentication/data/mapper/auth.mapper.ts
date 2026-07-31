// ==============================================================================
// features/authentication/data/mapper/auth.mapper.ts
// Maps between Supabase DTOs and UserProfile Domain Entity Class
// ==============================================================================
import { UserProfileEntity } from "../../domain/entities/user-profile.entity";
import type { AuthUserDTO } from "../dto/auth.dto";

export function toUserProfileEntity(dto: AuthUserDTO): UserProfileEntity {
  const user = dto.user;
  const profile = dto.profile;

  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Admin User";

  return new UserProfileEntity({
    id: user.id,
    email: user.email ?? "",
    fullName,
    avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
    role: dto.role ?? "super_admin",
    permissions: dto.permissions ?? ["*"],
    isActive: profile?.is_active ?? true,
    lastLoginAt: profile?.last_login_at ? new Date(profile.last_login_at) : null,
    createdAt: new Date(user.created_at),
  });
}
