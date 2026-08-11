"use client";
// ==============================================================================
// shared/hooks/services/use-service-hooks.ts
// TanStack Query Hooks for Services Feature
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseServiceRepository } from "@features/services/data/repositories/supabase-service.repository";
import {
  GetServicesUseCase,
  GetServiceByIdUseCase,
  CreateServiceUseCase,
  UpdateServiceUseCase,
  DeleteServiceUseCase,
  DuplicateServiceUseCase,
  ToggleFeatureServiceUseCase,
  BulkDeleteServicesUseCase,
  BulkUpdateServiceStatusUseCase,
} from "@features/services/domain/usecases";
import type {
  ServiceFilterParams,
  CreateServiceInput,
  UpdateServiceInput,
} from "@features/services/domain/repositories/i-service.repository";
import type { ServiceStatus } from "@features/services/domain/entities/service.entity";

const repository = new SupabaseServiceRepository();
const getServicesUseCase = new GetServicesUseCase(repository);
const getServiceByIdUseCase = new GetServiceByIdUseCase(repository);
const createServiceUseCase = new CreateServiceUseCase(repository);
const updateServiceUseCase = new UpdateServiceUseCase(repository);
const deleteServiceUseCase = new DeleteServiceUseCase(repository);
const duplicateServiceUseCase = new DuplicateServiceUseCase(repository);
const toggleFeatureServiceUseCase = new ToggleFeatureServiceUseCase(repository);
const bulkDeleteServicesUseCase = new BulkDeleteServicesUseCase(repository);
const bulkUpdateServiceStatusUseCase = new BulkUpdateServiceStatusUseCase(repository);

export function useServices(params?: ServiceFilterParams) {
  return useQuery({
    queryKey: queryKeys.services.list((params ?? {}) as Record<string, unknown>),
    queryFn: () => getServicesUseCase.execute(params),
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => getServiceByIdUseCase.execute(id),
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateServiceInput) => createServiceUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success("Service created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create service");
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateServiceInput) => updateServiceUseCase.execute(input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(updated.id) });
      toast.success("Service updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update service");
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteServiceUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success("Service deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete service");
    },
  });
}

export function useDuplicateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => duplicateServiceUseCase.execute(id),
    onMutate: () => {
      const toastId = toast.loading("Duplicating service...");
      return { toastId };
    },
    onSuccess: (duplicated, _variables, context) => {
      if (context?.toastId) toast.dismiss(context.toastId);
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success(`Duplicated service "${duplicated.nameEn}" successfully`);
    },
    onError: (error: Error, _variables, context) => {
      if (context?.toastId) toast.dismiss(context.toastId);
      toast.error(error.message || "Failed to duplicate service");
    },
  });
}

export function useToggleFeatureService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      toggleFeatureServiceUseCase.execute(id, isFeatured),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success(
        updated.isFeatured
          ? `Service "${updated.nameEn}" marked as Featured`
          : `Service "${updated.nameEn}" unfeatured`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to toggle feature status");
    },
  });
}

export function useBulkDeleteServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteServicesUseCase.execute(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success(`Deleted ${ids.length} services`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk delete services");
    },
  });
}

export function useBulkUpdateServiceStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: ServiceStatus }) =>
      bulkUpdateServiceStatusUseCase.execute(ids, status),
    onSuccess: (_, { ids, status }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success(`Updated status to "${status}" for ${ids.length} services`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk update status");
    },
  });
}
