"use client";
// ==============================================================================
// shared/hooks/projects/use-projects-hooks.ts
// Centralized TanStack Query Hooks for Projects Feature
// Strictly matching project_categories (id, status, deleted_at)
// and project_category_translations (project_category_id, language_code, slug, name, description)
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
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
import { toast } from "sonner";

const repository = new SupabaseProjectRepository();

export interface ProjectCategoryOption {
  id: string;
  nameEn: string;
  nameAr?: string | null;
  nameKu?: string | null;
}

export function useProjectCategoriesQuery() {
  return useQuery({
    queryKey: ["project-categories"],
    queryFn: async (): Promise<ProjectCategoryOption[]> => {
      const supabase = createClient();
      try {
        const { data, error } = await (supabase.from("project_categories" as any) as any)
          .select("id, project_category_translations(language_code, name)")
          .is("deleted_at", null);

        if (!error && data && data.length > 0) {
          return (data as any[]).map((item) => {
            const trans = item.project_category_translations || [];
            const en = trans.find((t: any) => t.language_code === "en") || {};
            const ar = trans.find((t: any) => t.language_code === "ar") || {};
            const ku = trans.find((t: any) => t.language_code === "ku" || t.language_code === "ckb") || {};
            return {
              id: item.id,
              nameEn: en.name || "Category",
              nameAr: ar.name || null,
              nameKu: ku.name || null,
            };
          });
        }

        // Fallback sync from product_categories if project_categories is empty
        const { data: prodData } = await (supabase.from("product_categories" as any) as any)
          .select("id, status, product_category_translations(language_code, name, slug, description)")
          .is("deleted_at", null);

        if (!prodData || prodData.length === 0) return [];

        for (const item of prodData as any[]) {
          await (supabase.from("project_categories" as any) as any).upsert({
            id: item.id,
            status: item.status ?? "published",
          });

          const trans = item.product_category_translations || [];
          for (const t of trans) {
            await (supabase.from("project_category_translations" as any) as any).upsert(
              {
                project_category_id: item.id,
                language_code: t.language_code,
                slug: t.slug,
                name: t.name,
                description: t.description,
              },
              { onConflict: "project_category_id,language_code" }
            );
          }
        }

        return (prodData as any[]).map((item) => {
          const trans = item.product_category_translations || [];
          const en = trans.find((t: any) => t.language_code === "en") || {};
          const ar = trans.find((t: any) => t.language_code === "ar") || {};
          const ku = trans.find((t: any) => t.language_code === "ku" || t.language_code === "ckb") || {};
          return {
            id: item.id,
            nameEn: en.name || "Category",
            nameAr: ar.name || null,
            nameKu: ku.name || null,
          };
        });
      } catch {
        return [];
      }
    },
    staleTime: 30 * 1000,
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
