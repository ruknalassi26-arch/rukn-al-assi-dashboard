"use client";
// ==============================================================================
// shared/hooks/projects/use-projects-hooks.ts
// Centralized TanStack Query Hooks for Projects & Project Categories
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseProjectRepository } from "@features/projects/data/repositories/supabase-project.repository";
import {
  GetProjectsUseCase,
  GetProjectByIdUseCase,
  CreateProjectUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
  BulkDeleteProjectsUseCase,
  ToggleProjectStatusUseCase,
  ToggleProjectFeaturedUseCase,
} from "@features/projects/domain/usecases";
import type {
  ProjectFilters,
  CreateProjectInput,
  UpdateProjectInput,
} from "@features/projects/domain/repositories/i-project.repository";
import type { ProjectStatus } from "@features/projects/domain/entities/project.entity";
import type { ProjectCategoryEntity } from "@features/projects/domain/entities/project-category.entity";
import { toast } from "sonner";

const repository = new SupabaseProjectRepository();

export function useProjectCategoriesQuery() {
  return useQuery({
    queryKey: ["project-categories"],
    queryFn: async (): Promise<ProjectCategoryEntity[]> => {
      return repository.getProjectCategories();
    },
    staleTime: 60 * 1000,
  });
}

export function useProjectsQuery(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: queryKeys.projects.list(filters as Record<string, unknown>),
    queryFn: () => new GetProjectsUseCase(repository).execute(filters),
    staleTime: 30 * 1000,
  });
}

export function useProjectDetailQuery(id: string | null) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id ?? ""),
    queryFn: () => (id ? new GetProjectByIdUseCase(repository).execute(id) : null),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) => new CreateProjectUseCase(repository).execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success("Project created successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create project");
    },
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProjectInput) => new UpdateProjectUseCase(repository).execute(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success("Project updated successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update project");
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteProjectUseCase(repository).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success("Project deleted successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete project");
    },
  });
}

export function useBulkDeleteProjectsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteProjectsUseCase(repository).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success("Selected projects deleted successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete selected projects");
    },
  });
}

export function useToggleProjectStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      new ToggleProjectStatusUseCase(repository).execute(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success(`Project status updated to ${data.statusLabel}`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update project status");
    },
  });
}

export function useToggleProjectFeaturedMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      new ToggleProjectFeaturedUseCase(repository).execute(id, isFeatured),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success(
        data.isFeatured ? "Project marked as Featured" : "Project removed from Featured"
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to toggle featured status");
    },
  });
}
