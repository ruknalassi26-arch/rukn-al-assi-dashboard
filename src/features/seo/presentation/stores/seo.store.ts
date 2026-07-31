// ==============================================================================
// features/seo/presentation/stores/seo.store.ts
// Zustand Store for SEO Management UI State (Selected Page Key)
// ==============================================================================
import { create } from "zustand";
import type { SeoPageKey } from "../../domain/entities/seo-setting.entity";

interface SeoState {
  selectedPageKey: SeoPageKey;
  setSelectedPageKey: (pageKey: SeoPageKey) => void;
}

export const useSeoStore = create<SeoState>((set) => ({
  selectedPageKey: "home",
  setSelectedPageKey: (selectedPageKey) => set({ selectedPageKey }),
}));
