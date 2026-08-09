// ==============================================================================
// features/profile/data/repositories/supabase-profile.repository.ts
// Supabase Data Repository Implementation for User Profile
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IProfileRepository,
  UpdateProfileInput,
  ChangePasswordInput,
} from "../../domain/repositories/i-profile.repository";
import { UserProfileEntity } from "@features/authentication/domain/entities/user-profile.entity";
import { toProfileEntity } from "../mapper/profile.mapper";
import type { ProfileRecordDTO } from "../dto/profile.dto";
import { getStoragePublicUrl } from "@core/utils/storage";

export class SupabaseProfileRepository implements IProfileRepository {
  private get supabase() {
    return createClient();
  }

  async getProfile(): Promise<UserProfileEntity> {
    const { data: userData, error: userError } = await this.supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error(userError?.message || "User not authenticated");
    }

    let profile: ProfileRecordDTO | null = null;
    try {
      const { data: profileData } = await (this.supabase as any)
        .from("admin_profiles")
        .select("*")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (profileData) {
        profile = profileData as ProfileRecordDTO;
      }
    } catch {
      // Non-blocking fallback
    }

    return toProfileEntity({
      user: userData.user,
      profile,
    });
  }

  async updateProfile(input: UpdateProfileInput): Promise<UserProfileEntity> {
    const { data: userData, error: userError } = await this.supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    // 1. Update Auth user metadata
    const { data: updatedUserData, error: updateMetaError } = await this.supabase.auth.updateUser({
      data: {
        full_name: input.fullName,
        phone: input.phone ?? null,
        avatar_url: input.avatarUrl ?? null,
      },
    });

    if (updateMetaError) {
      throw new Error(updateMetaError.message || "Failed to update profile user metadata");
    }

    // 2. Update or upsert admin_profiles table if it exists
    let profileRecord: ProfileRecordDTO | null = null;
    try {
      const { data: upsertedData, error: dbError } = await this.supabase
        .from("admin_profiles")
        .upsert({
          id: userData.user.id,
          full_name: input.fullName,
          avatar_url: input.avatarUrl ?? null,
        })
        .select()
        .single();

      if (!dbError && upsertedData) {
        profileRecord = upsertedData as ProfileRecordDTO;
      }
    } catch {
      // Non-blocking fallback
    }

    return toProfileEntity({
      user: updatedUserData.user ?? userData.user,
      profile: profileRecord,
    });
  }

  async uploadAvatar(file: File): Promise<string> {
    const { data: userData, error: userError } = await this.supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `avatar-${userData.user.id}-${Date.now()}.${fileExt}`;

    // Candidate buckets in priority order (using existing public buckets in Supabase Storage)
    const candidateBuckets = ["team-photos", "branding", "product-images", "avatars"];

    let successfulBucket: string | null = null;
    let lastErrorMessage = "";

    for (const bucket of candidateBuckets) {
      const { error: uploadError } = await this.supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      if (!uploadError) {
        successfulBucket = bucket;
        break;
      }

      lastErrorMessage = uploadError.message;
    }

    if (!successfulBucket) {
      throw new Error(`Failed to upload avatar image: ${lastErrorMessage}`);
    }

    return getStoragePublicUrl(successfulBucket, fileName);
  }

  async changePassword(input: ChangePasswordInput): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: input.newPassword,
    });

    if (error) {
      throw new Error(error.message || "Failed to update password");
    }
  }
}
