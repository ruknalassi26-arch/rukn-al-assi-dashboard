// ==============================================================================
// features/profile/domain/repositories/i-profile.repository.ts
// IProfileRepository Contract Interface
// ==============================================================================
import type { UserProfileEntity } from "@features/authentication/domain/entities/user-profile.entity";

export interface UpdateProfileInput {
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface ChangePasswordInput {
  currentPassword?: string;
  newPassword: string;
}

export interface IProfileRepository {
  getProfile(): Promise<UserProfileEntity>;
  updateProfile(input: UpdateProfileInput): Promise<UserProfileEntity>;
  uploadAvatar(file: File): Promise<string>;
  changePassword(input: ChangePasswordInput): Promise<void>;
}
