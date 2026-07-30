"use client";
// ==============================================================================
// shared/hooks/contact/use-contact-hooks.ts
// TanStack Query Hooks for Contact Info & Branches Feature
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseContactRepository } from "@features/contact/data/repositories/supabase-contact.repository";
import {
  GetContactInfoUseCase,
  UpdateContactInfoUseCase,
  GetBranchesUseCase,
  GetBranchByIdUseCase,
  CreateBranchUseCase,
  UpdateBranchUseCase,
  DeleteBranchUseCase,
  BulkDeleteBranchesUseCase,
  BulkUpdateBranchStatusUseCase,
} from "@features/contact/domain/usecases";
import type {
  BranchFilterParams,
  UpdateContactInfoInput,
  CreateBranchInput,
  UpdateBranchInput,
} from "@features/contact/domain/repositories/i-contact.repository";
import type { BranchStatus } from "@features/contact/domain/entities/branch.entity";

const repository = new SupabaseContactRepository();
const getContactInfoUseCase = new GetContactInfoUseCase(repository);
const updateContactInfoUseCase = new UpdateContactInfoUseCase(repository);
const getBranchesUseCase = new GetBranchesUseCase(repository);
const getBranchByIdUseCase = new GetBranchByIdUseCase(repository);
const createBranchUseCase = new CreateBranchUseCase(repository);
const updateBranchUseCase = new UpdateBranchUseCase(repository);
const deleteBranchUseCase = new DeleteBranchUseCase(repository);
const bulkDeleteBranchesUseCase = new BulkDeleteBranchesUseCase(repository);
const bulkUpdateBranchStatusUseCase = new BulkUpdateBranchStatusUseCase(repository);

export function useContactInfo() {
  return useQuery({
    queryKey: queryKeys.contact.info(),
    queryFn: () => getContactInfoUseCase.execute(),
  });
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateContactInfoInput) => updateContactInfoUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
      toast.success("Contact information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update contact information");
    },
  });
}

export function useBranches(params?: BranchFilterParams) {
  return useQuery({
    queryKey: queryKeys.contact.branchList((params ?? {}) as Record<string, unknown>),
    queryFn: () => getBranchesUseCase.execute(params),
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: queryKeys.contact.branchDetail(id),
    queryFn: () => getBranchByIdUseCase.execute(id),
    enabled: !!id,
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBranchInput) => createBranchUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
      toast.success("Branch created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create branch");
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBranchInput) => updateBranchUseCase.execute(input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.branchDetail(updated.id) });
      toast.success("Branch updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update branch");
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBranchUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
      toast.success("Branch deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete branch");
    },
  });
}

export function useBulkDeleteBranches() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteBranchesUseCase.execute(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
      toast.success(`Deleted ${ids.length} branches`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk delete branches");
    },
  });
}

export function useBulkUpdateBranchStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: BranchStatus }) =>
      bulkUpdateBranchStatusUseCase.execute(ids, status),
    onSuccess: (_, { ids, status }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
      toast.success(`Updated status to "${status}" for ${ids.length} branches`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk update status");
    },
  });
}
