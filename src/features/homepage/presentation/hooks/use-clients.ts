"use client";
// ==============================================================================
// features/homepage/presentation/hooks/use-clients.ts
// TanStack Query hooks and mutations for Clients / Partners section management
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseHomepageRepository } from "../../data/repository/supabase-homepage.repository";
import {
  GetClientsUseCase,
  CreateClientUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
  ReorderClientsUseCase,
  BulkDeleteClientsUseCase,
  BulkUpdateClientsStatusUseCase,
} from "../../domain/usecases/manage-clients.usecase";
import type { ClientEntity } from "../../domain/entities/homepage.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseHomepageRepository(supabase);
}

export function useClients() {
  return useQuery({
    queryKey: queryKeys.homepage.clients(),
    queryFn: () => new GetClientsUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (client: Omit<ClientEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateClientUseCase(getRepo()).execute(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Client partner added successfully");
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, client }: { id: string; client: Partial<ClientEntity> }) =>
      new UpdateClientUseCase(getRepo()).execute(id, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Client partner updated successfully");
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteClientUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Client partner deleted successfully");
    },
  });
}

export function useReorderClients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderClientsUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Clients reordered successfully");
    },
  });
}

export function useBulkDeleteClients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteClientsUseCase(getRepo()).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Selected clients deleted");
    },
  });
}

export function useBulkUpdateClientsStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "draft" }) =>
      new BulkUpdateClientsStatusUseCase(getRepo()).execute(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.clients() });
      toast.success("Selected clients status updated");
    },
  });
}
