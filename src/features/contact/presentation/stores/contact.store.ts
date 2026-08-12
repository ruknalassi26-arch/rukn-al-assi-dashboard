// ==============================================================================
// features/contact/presentation/stores/contact.store.ts
// Zustand Store for Contact Management UI State
// ==============================================================================
import { create } from "zustand";
import type { BranchStatus } from "../../domain/entities/branch.entity";

interface ContactState {
  activeTab: "info" | "branches";
  search: string;
  status: BranchStatus | "all";
  page: number;
  limit: number;
  sortBy: "sort_order";
  sortOrder: "asc" | "desc";
  selectedIds: string[];
  selectedBranchId: string | null;
  drawerOpen: boolean;

  setActiveTab: (tab: "info" | "branches") => void;
  setSearch: (search: string) => void;
  setStatus: (status: BranchStatus | "all") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: "sort_order", sortOrder: "asc" | "desc") => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelectId: (id: string) => void;
  clearSelection: () => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  resetFilters: () => void;
}

export const useContactStore = create<ContactState>((set) => ({
  activeTab: "info",
  search: "",
  status: "all",
  page: 1,
  limit: 10,
  sortBy: "sort_order",
  sortOrder: "asc",
  selectedIds: [],
  selectedBranchId: null,
  drawerOpen: false,

  setActiveTab: (activeTab) => set({ activeTab }),
  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
  setSelectedIds: (selectedIds) => set({ selectedIds }),
  toggleSelectId: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((item) => item !== id)
        : [...state.selectedIds, id],
    })),
  clearSelection: () => set({ selectedIds: [] }),
  openDrawer: (id) => set({ selectedBranchId: id, drawerOpen: true }),
  closeDrawer: () => set({ selectedBranchId: null, drawerOpen: false }),
  resetFilters: () =>
    set({
      search: "",
      status: "all",
      page: 1,
      sortBy: "sort_order",
      sortOrder: "asc",
      selectedIds: [],
    }),
}));
