"use client";
// ==============================================================================
// shared/hooks/auth/use-auth-hooks.ts
// TanStack Query Hooks for Admin Authentication Feature
// ==============================================================================
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "@core/utils/toast";
import { queryKeys } from "@core/constants/query-keys";
import { translateErrorMessage } from "@core/utils/error";
import { SupabaseAuthRepository } from "@features/authentication/data/repositories/supabase-auth.repository";
import {
  SignInUseCase,
  SignOutUseCase,
  GetCurrentUserUseCase,
  SendPasswordResetUseCase,
  ResetPasswordUseCase,
  ChangePasswordUseCase,
} from "@features/authentication/domain/usecases";
import type {
  SignInInput,
  SendPasswordResetInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from "@features/authentication/domain/repositories/i-auth.repository";
import { useAuthStore } from "@features/authentication/presentation/stores/auth.store";

const repository = new SupabaseAuthRepository();
const signInUseCase = new SignInUseCase(repository);
const signOutUseCase = new SignOutUseCase(repository);
const getCurrentUserUseCase = new GetCurrentUserUseCase(repository);
const sendPasswordResetUseCase = new SendPasswordResetUseCase(repository);
const resetPasswordUseCase = new ResetPasswordUseCase(repository);
const changePasswordUseCase = new ChangePasswordUseCase(repository);

export function useCurrentUser() {
  const { setUser, clearUser, setLoading } = useAuthStore();

  const query = useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: async () => {
      const storedUser = useAuthStore.getState().user;
      if (storedUser) {
        // Ensure store state is consistent
        setUser(storedUser);
        return storedUser;
      }
      const user = await getCurrentUserUseCase.execute();
      if (user) {
        setUser(user);
      } else {
        clearUser();
      }
      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  return query;
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();
  const { setUser, setRememberMe } = useAuthStore();

  return useMutation({
    mutationFn: (input: SignInInput) => signInUseCase.execute(input),
    onSuccess: (user, input) => {
      setUser(user);
      setRememberMe(input.rememberMe ?? true);
      queryClient.setQueryData(["auth", "current-user"], user);
      toast.success(`Welcome back, ${user.fullName}!`);
      router.push(`/${locale}/admin`);
    },
    onError: (error: Error) => {
      toast.error(translateErrorMessage(error.message, locale));
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();
  const { clearUser } = useAuthStore();

  return useMutation({
    mutationFn: () => signOutUseCase.execute(),
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      toast.success("Signed out successfully");
      router.push(`/${locale}/admin/login`);
    },
    onError: () => {
      clearUser();
      queryClient.clear();
      router.push(`/${locale}/admin/login`);
    },
  });
}

export function useSendPasswordReset() {
  const locale = useLocale();

  return useMutation({
    mutationFn: (input: SendPasswordResetInput) => sendPasswordResetUseCase.execute(input),
    onSuccess: (_, input) => {
      toast.success(`Password reset instructions have been sent to ${input.email}`);
    },
    onError: (error: Error) => {
      toast.error(translateErrorMessage(error.message, locale));
    },
  });
}

export function useResetPassword() {
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: (input: ResetPasswordInput) => resetPasswordUseCase.execute(input),
    onSuccess: () => {
      toast.success("Your password has been reset successfully! Please sign in.");
      router.push(`/${locale}/admin/login`);
    },
    onError: (error: Error) => {
      toast.error(translateErrorMessage(error.message, locale));
    },
  });
}

export function useChangePassword() {
  const locale = useLocale();
  const { closeChangePasswordModal } = useAuthStore();

  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changePasswordUseCase.execute(input),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      closeChangePasswordModal();
    },
    onError: (error: Error) => {
      toast.error(translateErrorMessage(error.message, locale));
    },
  });
}
