// ==============================================================================
// features/contact-messages/presentation/stores/contact-messages.store.ts
// Zustand Store for Customer Contact Messages UI State
// ==============================================================================
import { create } from "zustand";
import type { ContactMessageStatus } from "../../domain/entities/contact-message.entity";

interface ContactMessagesState {
  search: string;
  status: ContactMessageStatus | "all";
  page: number;
  limit: number;
  sortBy: "created_at" | "name" | "status";
  sortOrder: "asc" | "desc";
  selectedIds: string[];
  selectedMessageId: string | null;
  drawerOpen: boolean;
  emailModalOpen: boolean;

  setSearch: (search: string) => void;
  setStatus: (status: ContactMessageStatus | "all") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: "created_at" | "name" | "status", sortOrder: "asc" | "desc") => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelectId: (id: string) => void;
  clearSelection: () => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  openEmailModal: (id: string) => void;
  closeEmailModal: () => void;
  resetFilters: () => void;
}

export const useContactMessagesStore = create<ContactMessagesState>((set) => ({
  search: "",
  status: "all",
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
  selectedIds: [],
  selectedMessageId: null,
  drawerOpen: false,
  emailModalOpen: false,

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
  openDrawer: (id) => set({ selectedMessageId: id, drawerOpen: true }),
  closeDrawer: () => set({ selectedMessageId: null, drawerOpen: false }),
  openEmailModal: (id) => set({ selectedMessageId: id, emailModalOpen: true }),
  closeEmailModal: () => set({ emailModalOpen: false }),
  resetFilters: () =>
    set({
      search: "",
      status: "all",
      page: 1,
      sortBy: "created_at",
      sortOrder: "desc",
      selectedIds: [],
    }),
}));
