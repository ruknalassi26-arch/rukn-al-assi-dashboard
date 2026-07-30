"use client";
// ==============================================================================
// features/about/presentation/hooks/use-team.ts
// TanStack Query hooks for Management Team
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseAboutRepository } from "../../data/repository/supabase-about.repository";
import {
  GetTeamMembersUseCase,
  CreateTeamMemberUseCase,
  UpdateTeamMemberUseCase,
  DeleteTeamMemberUseCase,
  ReorderTeamMembersUseCase,
  BulkDeleteTeamMembersUseCase,
  BulkUpdateTeamMembersStatusUseCase,
} from "../../domain/usecases/manage-team.usecase";
import type { TeamMemberEntity } from "../../domain/entities/about.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseAboutRepository(supabase);
}

export function useTeamMembers() {
  return useQuery({
    queryKey: queryKeys.about.team(),
    queryFn: () => new GetTeamMembersUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (member: Omit<TeamMemberEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateTeamMemberUseCase(getRepo()).execute(member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member added successfully");
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, member }: { id: string; member: Partial<TeamMemberEntity> }) =>
      new UpdateTeamMemberUseCase(getRepo()).execute(id, member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member updated successfully");
    },
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteTeamMemberUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member deleted successfully");
    },
  });
}

export function useReorderTeamMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderTeamMembersUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team members reordered successfully");
    },
  });
}

export function useBulkDeleteTeamMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteTeamMembersUseCase(getRepo()).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Selected team members deleted");
    },
  });
}

export function useBulkUpdateTeamMembersStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "draft" }) =>
      new BulkUpdateTeamMembersStatusUseCase(getRepo()).execute(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Selected team members status updated");
    },
  });
}
