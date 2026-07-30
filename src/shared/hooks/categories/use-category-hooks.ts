"use client";
// ==============================================================================
// shared/hooks/categories/use-category-hooks.ts
// TanStack Query Hooks for Categories Feature
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseCategoryRepository } from "@features/categories/data/repositories/supabase-category.repository";
import {
  GetCategoriesUseCase,
  GetCategoryByIdUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from "@features/categories/domain/usecases";
import type {
  CategoryFilterParams,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@features/categories/domain/repositories/i-category.repository";

const repository = new SupabaseCategoryRepository();
const getCategoriesUseCase = new GetCategoriesUseCase(repository);
const getCategoryByIdUseCase = new GetCategoryByIdUseCase(repository);
const createCategoryUseCase = new CreateCategoryUseCase(repository);
const updateCategoryUseCase = new UpdateCategoryUseCase(repository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(repository);

export function useCategories(params?: CategoryFilterParams) {
  return useQuery({
    queryKey: queryKeys.categories.list((params ?? {}) as Record<string, unknown>),
    queryFn: () => getCategoriesUseCase.execute(params),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => getCategoryByIdUseCase.execute(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => createCategoryUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Category created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCategoryInput) => updateCategoryUseCase.execute(input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategoryUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
}
