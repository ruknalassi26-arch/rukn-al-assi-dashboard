"use client";
// ==============================================================================
// shared/hooks/profile/use-profile-hooks.ts
// TanStack Query Hooks for User Profile Feature
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseProfileRepository } from "@features/profile/data/repositories/supabase-profile.repository";
import { GetProfileUseCase } from "@features/profile/domain/usecases/get-profile.usecase";
import { UpdateProfileUseCase } from "@features/profile/domain/usecases/update-profile.usecase";
import { UploadAvatarUseCase } from "@features/profile/domain/usecases/upload-avatar.usecase";
import { ChangeProfilePasswordUseCase } from "@features/profile/domain/usecases/change-password.usecase";
import type { UpdateProfileInput, ChangePasswordInput } from "@features/profile/domain/repositories/i-profile.repository";
import { useAuthStore } from "@features/authentication/presentation/stores/auth.store";
import { toast } from "sonner";

const repository = new SupabaseProfileRepository();
const getProfileUseCase = new GetProfileUseCase(repository);
const updateProfileUseCase = new UpdateProfileUseCase(repository);
const uploadAvatarUseCase = new UploadAvatarUseCase(repository);
const changeProfilePasswordUseCase = new ChangeProfilePasswordUseCase(repository);

export function useProfileQuery() {
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.profile.user(),
    queryFn: async () => {
      const profile = await getProfileUseCase.execute();
      setUser(profile);
      return profile;
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfileUseCase.execute(input),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}

export function useUploadAvatarMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadAvatarUseCase.execute(file),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload avatar");
    },
  });
}

export function useChangeProfilePasswordMutation() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changeProfilePasswordUseCase.execute(input),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password");
    },
  });
}
