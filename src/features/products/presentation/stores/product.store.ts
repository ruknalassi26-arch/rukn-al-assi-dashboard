// ==============================================================================
// features/products/presentation/stores/product.store.ts
// Zustand Store managing UI State for Products feature
// ==============================================================================
import { create } from "zustand";
import type { ProductStatus } from "../../domain/entities/product.entity";

interface ProductUIState {
  search: string;
  categoryId: string;
  status: ProductStatus | "all";
  featured: "all" | "featured" | "standard";
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  selectedIds: string[];
  drawerOpen: boolean;
  selectedProductId: string | null;

  // Actions
  setSearch: (search: string) => void;
  setCategoryId: (categoryId: string) => void;
  setStatus: (status: ProductStatus | "all") => void;
  setFeatured: (featured: "all" | "featured" | "standard") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: string, sortOrder: "asc" | "desc") => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelectId: (id: string) => void;
  toggleSelectAll: (allIds: string[]) => void;
  clearSelection: () => void;
  openDrawer: (productId: string) => void;
  closeDrawer: () => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductUIState>((set) => ({
  search: "",
  categoryId: "all",
  status: "all",
  featured: "all",
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
  selectedIds: [],
  drawerOpen: false,
  selectedProductId: null,

  setSearch: (search) => set({ search, page: 1 }),
  setCategoryId: (categoryId) => set({ categoryId, page: 1 }),
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
  toggleSelectAll: (allIds) =>
    set((state) => ({
      selectedIds: state.selectedIds.length === allIds.length ? [] : allIds,
    })),
  clearSelection: () => set({ selectedIds: [] }),
  openDrawer: (productId) => set({ drawerOpen: true, selectedProductId: productId }),
  closeDrawer: () => set({ drawerOpen: false, selectedProductId: null }),
  resetFilters: () =>
    set({
      search: "",
      categoryId: "all",
      status: "all",
      featured: "all",
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "desc",
      selectedIds: [],
    }),
}));
