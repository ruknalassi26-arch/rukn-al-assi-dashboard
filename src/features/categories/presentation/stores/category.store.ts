// ==============================================================================
// features/categories/presentation/stores/category.store.ts
// Zustand Store for Categories UI State
// ==============================================================================
import { create } from "zustand";
import type { CategoryStatus } from "../../domain/entities/category.entity";

interface CategoryState {
  search: string;
  status: CategoryStatus | "all";
  page: number;
  limit: number;
  sortBy: "name_en" | "sort_order" | "created_at";
  sortOrder: "asc" | "desc";
  selectedCategoryId: string | null;
  drawerOpen: boolean;

  setSearch: (search: string) => void;
  setStatus: (status: CategoryStatus | "all") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: "name_en" | "sort_order" | "created_at", sortOrder: "asc" | "desc") => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  resetFilters: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  search: "",
  status: "all",
  page: 1,
  limit: 10,
  sortBy: "sort_order",
  sortOrder: "asc",
  selectedCategoryId: null,
  drawerOpen: false,

  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
  openDrawer: (id) => set({ selectedCategoryId: id, drawerOpen: true }),
  closeDrawer: () => set({ selectedCategoryId: null, drawerOpen: false }),
  resetFilters: () =>
    set({
      search: "",
      status: "all",
      page: 1,
      sortBy: "sort_order",
      sortOrder: "asc",
    }),
}));
