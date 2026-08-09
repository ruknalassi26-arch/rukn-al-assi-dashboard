"use client";
// ==============================================================================
// shared/hooks/team/use-team-hooks.ts
// TanStack Query Hooks for Team Members Feature
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@core/utils/toast";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseTeamRepository } from "@features/team/data/repositories/supabase-team.repository";
import {
  GetTeamMembersUseCase,
  GetTeamMemberByIdUseCase,
  CreateTeamMemberUseCase,
  UpdateTeamMemberUseCase,
  DeleteTeamMemberUseCase,
  BulkDeleteTeamMembersUseCase,
  BulkUpdateTeamMemberStatusUseCase,
} from "@features/team/domain/usecases";
import type {
  TeamFilterParams,
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
} from "@features/team/domain/repositories/i-team.repository";
import type { TeamMemberStatus } from "@features/team/domain/entities/team-member.entity";

const repository = new SupabaseTeamRepository();
const getTeamMembersUseCase = new GetTeamMembersUseCase(repository);
const getTeamMemberByIdUseCase = new GetTeamMemberByIdUseCase(repository);
const createTeamMemberUseCase = new CreateTeamMemberUseCase(repository);
const updateTeamMemberUseCase = new UpdateTeamMemberUseCase(repository);
const deleteTeamMemberUseCase = new DeleteTeamMemberUseCase(repository);
const bulkDeleteTeamMembersUseCase = new BulkDeleteTeamMembersUseCase(repository);
const bulkUpdateTeamMemberStatusUseCase = new BulkUpdateTeamMemberStatusUseCase(repository);

export function useTeamMembers(params?: TeamFilterParams) {
  return useQuery({
    queryKey: queryKeys.team.list((params ?? {}) as Record<string, unknown>),
    queryFn: () => getTeamMembersUseCase.execute(params),
  });
}

export function useTeamMember(id: string) {
  return useQuery({
    queryKey: queryKeys.team.detail(id),
    queryFn: () => getTeamMemberByIdUseCase.execute(id),
    enabled: !!id,
  });
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTeamMemberInput) => createTeamMemberUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create team member");
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTeamMemberInput) => updateTeamMemberUseCase.execute(input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.team.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update team member");
    },
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTeamMemberUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete team member");
    },
  });
}

export function useBulkDeleteTeamMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteTeamMembersUseCase.execute(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success(`Deleted ${ids.length} team members`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk delete team members");
    },
  });
}

export function useBulkUpdateTeamMemberStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: TeamMemberStatus }) =>
      bulkUpdateTeamMemberStatusUseCase.execute(ids, status),
    onSuccess: (_, { ids, status }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success(`Updated status to "${status}" for ${ids.length} team members`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk update status");
    },
  });
}
