// ==============================================================================
// features/team/presentation/stores/team.store.ts
// Zustand Store for Team Members UI State
// ==============================================================================
import { create } from "zustand";
import type { TeamMemberStatus } from "../../domain/entities/team-member.entity";

interface TeamState {
  search: string;
  status: TeamMemberStatus | "all";
  page: number;
  limit: number;
  sortBy: "full_name_en" | "sort_order" | "created_at";
  sortOrder: "asc" | "desc";
  selectedIds: string[];
  selectedMemberId: string | null;
  drawerOpen: boolean;

  setSearch: (search: string) => void;
  setStatus: (status: TeamMemberStatus | "all") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: "full_name_en" | "sort_order" | "created_at", sortOrder: "asc" | "desc") => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelectId: (id: string) => void;
  clearSelection: () => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  resetFilters: () => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  search: "",
  status: "all",
  page: 1,
  limit: 10,
  sortBy: "sort_order",
  sortOrder: "asc",
  selectedIds: [],
  selectedMemberId: null,
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
  openDrawer: (id) => set({ selectedMemberId: id, drawerOpen: true }),
  closeDrawer: () => set({ selectedMemberId: null, drawerOpen: false }),
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
