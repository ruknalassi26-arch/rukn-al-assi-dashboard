// ==============================================================================
// features/homepage/presentation/stores/homepage.store.ts
// Zustand store for UI state management in Homepage Management
// ==============================================================================
import { create } from "zustand";

export type HomepageTab =
  | "hero"
  | "about"
  | "stats"
  | "services"
  | "products"
  | "projects"
  | "clients"
  | "contact_cta";

interface HomepageStore {
  activeTab: HomepageTab;
  setActiveTab: (tab: HomepageTab) => void;

  // Search & Filter state per section
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;

  // Selected item IDs for bulk operations
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  toggleSelectId: (id: string) => void;
  selectAllIds: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useHomepageStore = create<HomepageStore>((set) => ({
  activeTab: "hero",
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
