// ==============================================================================
// features/activity-log/presentation/stores/activity-log.store.ts
// Zustand Store for Activity Log Filters, Pagination & Detail Drawer UI State
// ==============================================================================
import { create } from "zustand";

interface ActivityLogState {
  search: string;
  action: string;
  entityType: string;
  startDate: string;
  endDate: string;
  page: number;
  pageSize: number;
  sortBy: "created_at" | "action" | "entity_type" | "user_email";
  sortOrder: "asc" | "desc";
  selectedLogId: string | null;
  isDrawerOpen: boolean;

  setSearch: (search: string) => void;
  setAction: (action: string) => void;
  setEntityType: (entityType: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSorting: (sortBy: "created_at" | "action" | "entity_type" | "user_email", sortOrder: "asc" | "desc") => void;
  openDrawer: (logId: string) => void;
  closeDrawer: () => void;
  resetFilters: () => void;
}

export const useActivityLogStore = create<ActivityLogState>((set) => ({
  search: "",
  action: "all",
  entityType: "all",
  startDate: "",
  endDate: "",
  page: 1,
  pageSize: 10,
  sortBy: "created_at",
  sortOrder: "desc",
  selectedLogId: null,
  isDrawerOpen: false,

  setSearch: (search) => set({ search, page: 1 }),
  setAction: (action) => set({ action, page: 1 }),
  setEntityType: (entityType) => set({ entityType, page: 1 }),
  setStartDate: (startDate) => set({ startDate, page: 1 }),
  setEndDate: (endDate) => set({ endDate, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
  openDrawer: (selectedLogId) => set({ selectedLogId, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, selectedLogId: null }),
  resetFilters: () =>
    set({
      search: "",
      action: "all",
      entityType: "all",
      startDate: "",
      endDate: "",
      page: 1,
    }),
}));
