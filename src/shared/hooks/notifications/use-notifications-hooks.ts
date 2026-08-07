"use client";
// ==============================================================================
// shared/hooks/notifications/use-notifications-hooks.ts
// TanStack Query & Supabase Realtime Hooks for Notification Center
// ==============================================================================
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseNotificationRepository } from "@features/notifications/data/repositories/supabase-notification.repository";
import {
  GetNotificationsUseCase,
  GetUnreadCountUseCase,
  MarkNotificationAsReadUseCase,
  MarkAllNotificationsAsReadUseCase,
  DeleteNotificationUseCase,
} from "@features/notifications/domain/usecases";
import type { NotificationFilters } from "@features/notifications/domain/repositories/i-notification.repository";
import { toast } from "sonner";

const repository = new SupabaseNotificationRepository();

export function useNotificationsQuery(filters: NotificationFilters = {}) {
  return useQuery({
    queryKey: queryKeys.notifications.list(filters as Record<string, unknown>),
    queryFn: () => new GetNotificationsUseCase(repository).execute(filters),
    staleTime: 10 * 1000,
  });
}

export function useUnreadNotificationsCountQuery() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => new GetUnreadCountUseCase(repository).execute(),
    staleTime: 10 * 1000,
  });
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new MarkNotificationAsReadUseCase(repository).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => new MarkAllNotificationsAsReadUseCase(repository).execute(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("All notifications marked as read");
    },
  });
}

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteNotificationUseCase(repository).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("Notification deleted");
    },
  });
}

/**
 * Supabase Realtime Listener Hook for live notification events
 */
export function useNotificationsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin_notifications_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          toast.info(payload.new.title || "New Notification", {
            description: payload.new.message,
          });
          queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "rfq_requests" },
        (payload) => {
          toast.info("New RFQ Request Received!", {
            description: `From: ${payload.new.full_name || payload.new.phone}`,
          });
          queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_messages" },
        (payload) => {
          toast.info("New Contact Message Received!", {
            description: `From: ${payload.new.full_name || payload.new.email}`,
          });
          queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
