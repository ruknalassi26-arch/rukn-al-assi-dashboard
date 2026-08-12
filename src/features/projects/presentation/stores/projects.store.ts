// ==============================================================================
// features/projects/presentation/stores/projects.store.ts
// Zustand Store for Projects List Filters, Pagination, Sorting & Bulk Selection
// ==============================================================================
import { create } from "zustand";
import type { ProjectStatus } from "../../domain/entities/project.entity";

interface ProjectsState {
  search: string;
  categoryId: string;
  status: ProjectStatus | "all";
  isFeatured: boolean | undefined;
  page: number;
  pageSize: number;
  sortBy: "created_at" | "title_en" | "sort_order";
  sortOrder: "asc" | "desc";
  selectedIds: string[];
  deleteModalId: string | null;

  setSearch: (search: string) => void;
  setCategoryId: (categoryId: string) => void;
  setStatus: (status: ProjectStatus | "all") => void;
  setIsFeatured: (isFeatured: boolean | undefined) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSorting: (sortBy: "created_at" | "title_en" | "sort_order", sortOrder: "asc" | "desc") => void;
  toggleSelectId: (id: string) => void;
  toggleSelectAll: (ids: string[]) => void;
  clearSelection: () => void;
  openDeleteModal: (id: string) => void;
  closeDeleteModal: () => void;
  resetFilters: () => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  search: "",
  categoryId: "all",
  status: "all",
  isFeatured: undefined,
  page: 1,
  pageSize: 10,
  sortBy: "created_at",
  sortOrder: "desc",
  selectedIds: [],
  deleteModalId: null,

  setSearch: (search) => set({ search, page: 1 }),
  setCategoryId: (categoryId) => set({ categoryId, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setIsFeatured: (isFeatured) => set({ isFeatured, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

  toggleSelectId: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((item) => item !== id)
        : [...state.selectedIds, id],
    })),

  toggleSelectAll: (ids) =>
    set((state) => ({
      selectedIds: state.selectedIds.length === ids.length ? [] : ids,
    })),

  clearSelection: () => set({ selectedIds: [] }),
  openDeleteModal: (deleteModalId) => set({ deleteModalId }),
  closeDeleteModal: () => set({ deleteModalId: null }),

  resetFilters: () =>
    set({
      search: "",
      categoryId: "all",
      status: "all",
      isFeatured: undefined,
      page: 1,
    }),
}));
