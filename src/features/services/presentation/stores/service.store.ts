// ==============================================================================
// features/services/presentation/stores/service.store.ts
// Zustand Store for Services UI State
// ==============================================================================
import { create } from "zustand";
import type { ServiceStatus } from "../../domain/entities/service.entity";

interface ServiceState {
  search: string;
  status: ServiceStatus | "all";
  featured: boolean | "all";
  page: number;
  limit: number;
  sortBy: "title_en" | "sort_order" | "created_at";
  sortOrder: "asc" | "desc";
  selectedIds: string[];
  selectedServiceId: string | null;
  drawerOpen: boolean;

  setSearch: (search: string) => void;
  setStatus: (status: ServiceStatus | "all") => void;
  setFeatured: (featured: boolean | "all") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: "title_en" | "sort_order" | "created_at", sortOrder: "asc" | "desc") => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelectId: (id: string) => void;
  clearSelection: () => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  resetFilters: () => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  search: "",
  status: "all",
  featured: "all",
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
  selectedIds: [],
  selectedServiceId: null,
  drawerOpen: false,

  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setFeatured: (featured) => set({ featured, page: 1 }),
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
  openDrawer: (id) => set({ selectedServiceId: id, drawerOpen: true }),
  closeDrawer: () => set({ selectedServiceId: null, drawerOpen: false }),
  resetFilters: () =>
    set({
      search: "",
      status: "all",
      featured: "all",
      page: 1,
      sortBy: "created_at",
      sortOrder: "desc",
      selectedIds: [],
    }),
}));
