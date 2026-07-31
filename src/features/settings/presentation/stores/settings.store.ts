// ==============================================================================
// features/settings/presentation/stores/settings.store.ts
// Zustand Store for Settings UI State (Tab selection)
// ==============================================================================
import { create } from "zustand";

export type SettingsTab = "general" | "company" | "contact" | "social" | "branding";

interface SettingsState {
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  activeTab: "general",
  setActiveTab: (activeTab) => set({ activeTab }),
}));
