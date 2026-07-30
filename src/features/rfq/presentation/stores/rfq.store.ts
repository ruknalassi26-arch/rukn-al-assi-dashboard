// ==============================================================================
// features/rfq/presentation/stores/rfq.store.ts
// Zustand Store for RFQ UI State
// ==============================================================================
import { create } from "zustand";
import type { RfqStatus } from "../../domain/entities/rfq-request.entity";

interface RfqState {
  search: string;
  status: RfqStatus | "all";
  companyFilter: string;
  dateFrom: string;
  dateTo: string;
  page: number;
  limit: number;
  sortBy: "created_at" | "reference_number" | "company_name" | "status";
  sortOrder: "asc" | "desc";
  selectedIds: string[];
  selectedRfqId: string | null;
  drawerOpen: boolean;
  emailModalOpen: boolean;
  attachmentViewerOpen: boolean;
  currentAttachmentUrl: string | null;

  setSearch: (search: string) => void;
  setStatus: (status: RfqStatus | "all") => void;
  setCompanyFilter: (company: string) => void;
  setDateRange: (dateFrom: string, dateTo: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: "created_at" | "reference_number" | "company_name" | "status", sortOrder: "asc" | "desc") => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelectId: (id: string) => void;
  clearSelection: () => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  openEmailModal: (id: string) => void;
  closeEmailModal: () => void;
  openAttachmentViewer: (url: string) => void;
  closeAttachmentViewer: () => void;
  resetFilters: () => void;
}

export const useRfqStore = create<RfqState>((set) => ({
  search: "",
  status: "all",
  companyFilter: "",
  dateFrom: "",
  dateTo: "",
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
  selectedIds: [],
  selectedRfqId: null,
  drawerOpen: false,
  emailModalOpen: false,
  attachmentViewerOpen: false,
  currentAttachmentUrl: null,

  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setCompanyFilter: (companyFilter) => set({ companyFilter, page: 1 }),
  setDateRange: (dateFrom, dateTo) => set({ dateFrom, dateTo, page: 1 }),
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
  openDrawer: (id) => set({ selectedRfqId: id, drawerOpen: true }),
  closeDrawer: () => set({ selectedRfqId: null, drawerOpen: false }),
  openEmailModal: (id) => set({ selectedRfqId: id, emailModalOpen: true }),
  closeEmailModal: () => set({ emailModalOpen: false }),
  openAttachmentViewer: (url) => set({ currentAttachmentUrl: url, attachmentViewerOpen: true }),
  closeAttachmentViewer: () => set({ currentAttachmentUrl: null, attachmentViewerOpen: false }),
  resetFilters: () =>
    set({
      search: "",
      status: "all",
      companyFilter: "",
      dateFrom: "",
      dateTo: "",
      page: 1,
      sortBy: "created_at",
      sortOrder: "desc",
      selectedIds: [],
    }),
}));
