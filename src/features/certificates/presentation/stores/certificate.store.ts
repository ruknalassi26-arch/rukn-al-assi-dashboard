// ==============================================================================
// features/certificates/presentation/stores/certificate.store.ts
// Zustand Store for Certificates UI State
// ==============================================================================
import { create } from "zustand";
import type { CertificateStatus } from "../../domain/entities/certificate.entity";

interface CertificateState {
  search: string;
  status: CertificateStatus | "all";
  page: number;
  limit: number;
  sortBy: "title_en" | "sort_order" | "created_at" | "issue_date";
  sortOrder: "asc" | "desc";
  selectedIds: string[];
  selectedCertificateId: string | null;
  drawerOpen: boolean;

  setSearch: (search: string) => void;
  setStatus: (status: CertificateStatus | "all") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: "title_en" | "sort_order" | "created_at" | "issue_date", sortOrder: "asc" | "desc") => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelectId: (id: string) => void;
  clearSelection: () => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  resetFilters: () => void;
}

export const useCertificateStore = create<CertificateState>((set) => ({
  search: "",
  status: "all",
  page: 1,
  limit: 10,
  sortBy: "sort_order",
  sortOrder: "asc",
  selectedIds: [],
  selectedCertificateId: null,
  drawerOpen: false,

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
  openDrawer: (id) => set({ selectedCertificateId: id, drawerOpen: true }),
  closeDrawer: () => set({ selectedCertificateId: null, drawerOpen: false }),
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
