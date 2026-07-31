// ==============================================================================
// features/authentication/domain/repositories/i-auth.repository.ts
// IAuthRepository Contract Interface
// ==============================================================================
import type { UserProfileEntity } from "../entities/user-profile.entity";

export interface SignInInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SendPasswordResetInput {
  email: string;
  redirectUrl?: string;
}

export interface ResetPasswordInput {
  newPassword: string;
}

export interface ChangePasswordInput {
  currentPassword?: string;
  newPassword: string;
}

export interface IAuthRepository {
  signIn(input: SignInInput): Promise<UserProfileEntity>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<UserProfileEntity | null>;
  sendPasswordResetEmail(input: SendPasswordResetInput): Promise<void>;
  resetPassword(input: ResetPasswordInput): Promise<void>;
  changePassword(input: ChangePasswordInput): Promise<void>;
}
