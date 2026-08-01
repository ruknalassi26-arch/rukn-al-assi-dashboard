// ==============================================================================
// features/global-search/presentation/stores/global-search.store.ts
// Zustand Store with LocalStorage Persistence for Recent Searches
// ==============================================================================
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GlobalSearchState {
  isOpen: boolean;
  query: string;
  moduleFilter: string;
  page: number;
  recentSearches: string[];

  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
  setQuery: (query: string) => void;
  setModuleFilter: (moduleFilter: string) => void;
  setPage: (page: number) => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  resetSearch: () => void;
}

export const useGlobalSearchStore = create<GlobalSearchState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      query: "",
      moduleFilter: "all",
      page: 1,
      recentSearches: ["Solar Inverters", "Pumps", "Quotation", "ISO Certificate"],

      openModal: () => set({ isOpen: true }),
      closeModal: () => set({ isOpen: false }),
      toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),

      setQuery: (query) => set({ query, page: 1 }),
      setModuleFilter: (moduleFilter) => set({ moduleFilter, page: 1 }),
      setPage: (page) => set({ page }),

      addRecentSearch: (rawQuery) => {
        const trimmed = rawQuery.trim();
        if (!trimmed || trimmed.length < 2) return;

        const current = get().recentSearches;
        const updated = [trimmed, ...current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
        set({ recentSearches: updated });
      },

      removeRecentSearch: (itemToRemove) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== itemToRemove),
        }));
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      resetSearch: () => set({ query: "", moduleFilter: "all", page: 1 }),
    }),
    {
      name: "rukn_global_search_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
