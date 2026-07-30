// ==============================================================================
// features/about/presentation/stores/about.store.ts
// Zustand store for UI state management in About Us Management
// ==============================================================================
import { create } from "zustand";

export type AboutTab =
  | "company_info"
  | "mission_vision"
  | "core_values"
  | "timeline"
  | "team"
  | "certificates";

interface AboutStore {
  activeTab: AboutTab;
  setActiveTab: (tab: AboutTab) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;

  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  toggleSelectId: (id: string) => void;
  selectAllIds: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useAboutStore = create<AboutStore>((set) => ({
  activeTab: "company_info",
  setActiveTab: (activeTab) => set({ activeTab, selectedIds: [], searchQuery: "", statusFilter: "all" }),

  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  statusFilter: "all",
  setStatusFilter: (statusFilter) => set({ statusFilter }),

  selectedIds: [],
  setSelectedIds: (selectedIds) => set({ selectedIds }),
  toggleSelectId: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((item) => item !== id)
        : [...state.selectedIds, id],
    })),
  selectAllIds: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
}));
