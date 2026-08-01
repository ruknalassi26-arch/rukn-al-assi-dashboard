// ==============================================================================
// features/notifications/presentation/stores/notification.store.ts
// Zustand Store for Notification Center UI state
// ==============================================================================
import { create } from "zustand";

interface NotificationStoreState {
  search: string;
  type: string;
  readStatus: "all" | "unread" | "read";
  page: number;
  pageSize: number;

  setSearch: (search: string) => void;
  setType: (type: string) => void;
  setReadStatus: (readStatus: "all" | "unread" | "read") => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
  search: "",
  type: "all",
  readStatus: "all",
  page: 1,
  pageSize: 10,

  setSearch: (search) => set({ search, page: 1 }),
  setType: (type) => set({ type, page: 1 }),
  setReadStatus: (readStatus) => set({ readStatus, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  resetFilters: () => set({ search: "", type: "all", readStatus: "all", page: 1 }),
}));
