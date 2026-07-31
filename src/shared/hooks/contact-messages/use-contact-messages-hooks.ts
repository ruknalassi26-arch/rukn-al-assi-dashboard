"use client";
// ==============================================================================
// shared/hooks/contact-messages/use-contact-messages-hooks.ts
// TanStack Query Hooks for Customer Contact Messages Feature
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseContactMessagesRepository } from "@features/contact-messages/data/repositories/supabase-contact-messages.repository";
import {
  GetContactMessagesUseCase,
  GetContactMessageByIdUseCase,
  UpdateMessageStatusUseCase,
  DeleteContactMessageUseCase,
  SendMessageReplyUseCase,
  BulkDeleteMessagesUseCase,
  BulkUpdateMessageStatusUseCase,
} from "@features/contact-messages/domain/usecases";
import type {
  ContactMessageFilterParams,
  SendMessageReplyInput,
} from "@features/contact-messages/domain/repositories/i-contact-messages.repository";
import type { ContactMessageStatus } from "@features/contact-messages/domain/entities/contact-message.entity";

const repository = new SupabaseContactMessagesRepository();
const getContactMessagesUseCase = new GetContactMessagesUseCase(repository);
const getContactMessageByIdUseCase = new GetContactMessageByIdUseCase(repository);
const updateMessageStatusUseCase = new UpdateMessageStatusUseCase(repository);
const deleteContactMessageUseCase = new DeleteContactMessageUseCase(repository);
const sendMessageReplyUseCase = new SendMessageReplyUseCase(repository);
const bulkDeleteMessagesUseCase = new BulkDeleteMessagesUseCase(repository);
const bulkUpdateMessageStatusUseCase = new BulkUpdateMessageStatusUseCase(repository);

export function useContactMessages(params?: ContactMessageFilterParams) {
  return useQuery({
    queryKey: queryKeys.contactMessages.lists(),
    queryFn: () => getContactMessagesUseCase.execute(params),
  });
}

export function useContactMessage(id: string) {
  return useQuery({
    queryKey: queryKeys.contactMessages.detail(id),
    queryFn: () => getContactMessageByIdUseCase.execute(id),
    enabled: !!id,
  });
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: ContactMessageStatus; notes?: string }) =>
      updateMessageStatusUseCase.execute(id, status, notes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactMessages.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.contactMessages.detail(updated.id) });
      toast.success(`Message status updated to "${updated.status}"`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update message status");
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteContactMessageUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactMessages.all });
      toast.success("Contact message deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete contact message");
    },
  });
}

export function useSendMessageReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SendMessageReplyInput) => sendMessageReplyUseCase.execute(input),
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactMessages.detail(input.messageId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contactMessages.all });
      toast.success(`Email reply sent to ${input.toEmail}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send email reply");
    },
  });
}

export function useBulkDeleteContactMessages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteMessagesUseCase.execute(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactMessages.all });
      toast.success(`Deleted ${ids.length} messages`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk delete messages");
    },
  });
}

export function useBulkUpdateMessageStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: ContactMessageStatus }) =>
      bulkUpdateMessageStatusUseCase.execute(ids, status),
    onSuccess: (_, { ids, status }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactMessages.all });
      toast.success(`Updated status to "${status}" for ${ids.length} messages`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk update status");
    },
  });
}
