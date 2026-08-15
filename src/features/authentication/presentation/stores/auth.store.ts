// ==============================================================================
// features/authentication/presentation/stores/auth.store.ts
// Zustand Store for Admin Authentication UI State & User Session
// Persists User Profile & Auth status in localStorage for instant page refresh hydration
// ==============================================================================
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfileEntity } from "../../domain/entities/user-profile.entity";

interface AuthState {
  user: UserProfileEntity | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  changePasswordModalOpen: boolean;

  setUser: (user: UserProfileEntity | null) => void;
  setRememberMe: (rememberMe: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  clearUser: () => void;
  openChangePasswordModal: () => void;
  closeChangePasswordModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      rememberMe: true,
      changePasswordModalOpen: false,

      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setRememberMe: (rememberMe) => set({ rememberMe }),
      setLoading: (isLoading) => set({ isLoading }),
      clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),
      openChangePasswordModal: () => set({ changePasswordModalOpen: true }),
      closeChangePasswordModal: () => set({ changePasswordModalOpen: false }),
    }),
    {
      name: "rukn_admin_auth_state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
      }),
    }
  )
);
