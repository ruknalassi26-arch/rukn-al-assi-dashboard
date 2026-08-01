// ==============================================================================
// features/profile/presentation/stores/profile.store.ts
// Zustand Store for User Profile UI State
// ==============================================================================
import { create } from "zustand";

export type ProfileTab = "details" | "edit" | "password";

interface ProfileState {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
  isAvatarUploading: boolean;
  setIsAvatarUploading: (uploading: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  activeTab: "details",
  setActiveTab: (activeTab) => set({ activeTab }),
  isAvatarUploading: false,
  setIsAvatarUploading: (isAvatarUploading) => set({ isAvatarUploading }),
}));
