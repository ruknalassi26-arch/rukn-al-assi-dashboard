"use client";
// ==============================================================================
// shared/hooks/rfq/use-rfq-hooks.ts
// TanStack Query Hooks for RFQ Feature
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseRfqRepository } from "@features/rfq/data/repositories/supabase-rfq.repository";
import {
  GetRfqsUseCase,
  GetRfqByIdUseCase,
  CreateRfqUseCase,
  UpdateRfqStatusUseCase,
  DeleteRfqUseCase,
  SendEmailReplyUseCase,
  BulkDeleteRfqsUseCase,
  BulkUpdateRfqStatusUseCase,
} from "@features/rfq/domain/usecases";
import type {
  RfqFilterParams,
  SendEmailReplyInput,
} from "@features/rfq/domain/repositories/i-rfq.repository";
import type { RfqStatus, CreateRfqInput } from "@features/rfq/domain/entities/rfq-request.entity";

const repository = new SupabaseRfqRepository();
const getRfqsUseCase = new GetRfqsUseCase(repository);
const getRfqByIdUseCase = new GetRfqByIdUseCase(repository);
const createRfqUseCase = new CreateRfqUseCase(repository);
const updateRfqStatusUseCase = new UpdateRfqStatusUseCase(repository);
const deleteRfqUseCase = new DeleteRfqUseCase(repository);
const sendEmailReplyUseCase = new SendEmailReplyUseCase(repository);
const bulkDeleteRfqsUseCase = new BulkDeleteRfqsUseCase(repository);
const bulkUpdateRfqStatusUseCase = new BulkUpdateRfqStatusUseCase(repository);

export function useRfqs(params?: RfqFilterParams) {
  return useQuery({
    queryKey: [...queryKeys.rfq.lists(), params],
    queryFn: () => getRfqsUseCase.execute(params),
  });
}

export function useRfq(id: string) {
  return useQuery({
    queryKey: queryKeys.rfq.detail(id),
    queryFn: () => getRfqByIdUseCase.execute(id),
    enabled: !!id,
  });
}

export function useCreateRfq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRfqInput) => createRfqUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rfq.all });
      toast.success("RFQ created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create RFQ request");
    },
  });
}

export function useUploadRfqAttachment() {
  return useMutation({
    mutationFn: (file: File) => createRfqUseCase.uploadAttachment(file),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload attachment");
    },
  });
}

export function useUpdateRfqStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: RfqStatus; notes?: string }) =>
      updateRfqStatusUseCase.execute(id, status, notes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rfq.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.rfq.detail(updated.id) });
      toast.success(`RFQ status updated to "${updated.status}"`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update RFQ status");
    },
  });
}

export function useDeleteRfq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRfqUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rfq.all });
      toast.success("RFQ request deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete RFQ request");
    },
  });
}

export function useSendEmailReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SendEmailReplyInput) => sendEmailReplyUseCase.execute(input),
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rfq.detail(input.rfqId) });
      toast.success(`Email reply sent to ${input.toEmail}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send email reply");
    },
  });
}

export function useBulkDeleteRfqs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteRfqsUseCase.execute(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rfq.all });
      toast.success(`Deleted ${ids.length} RFQ requests`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk delete RFQs");
    },
  });
}

export function useBulkUpdateRfqStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: RfqStatus }) =>
      bulkUpdateRfqStatusUseCase.execute(ids, status),
    onSuccess: (_, { ids, status }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rfq.all });
      toast.success(`Updated status to "${status}" for ${ids.length} RFQ requests`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk update status");
    },
  });
}
