// ==============================================================================
// features/profile/data/mapper/profile.mapper.ts
// Maps between Supabase DTOs and UserProfile Domain Entity Class
// ==============================================================================
import { UserProfileEntity } from "@features/authentication/domain/entities/user-profile.entity";
import type { ProfileUserDTO } from "../dto/profile.dto";

export function toProfileEntity(dto: ProfileUserDTO): UserProfileEntity {
  const user = dto.user;
  const profile = dto.profile;

  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Admin User";

  const phone =
    profile?.phone ||
    user.user_metadata?.phone ||
    user.phone ||
    null;

  return new UserProfileEntity({
    id: user.id,
    email: user.email ?? "",
    fullName,
    phone,
    avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
    role: dto.role ?? "super_admin",
    permissions: dto.permissions ?? ["*"],
    isActive: profile?.is_active ?? true,
    lastLoginAt: profile?.last_login_at ? new Date(profile.last_login_at) : null,
    createdAt: new Date(user.created_at),
  });
}
