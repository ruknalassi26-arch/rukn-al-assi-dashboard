"use client";
// ==============================================================================
// features/about/presentation/hooks/use-timeline.ts
// TanStack Query hooks for Company Timeline
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseAboutRepository } from "../../data/repository/supabase-about.repository";
import {
  GetTimelineUseCase,
  CreateTimelineUseCase,
  UpdateTimelineUseCase,
  DeleteTimelineUseCase,
  ReorderTimelineUseCase,
  BulkDeleteTimelineUseCase,
  BulkUpdateTimelineStatusUseCase,
} from "../../domain/usecases/manage-timeline.usecase";
import type { TimelineEntity } from "../../domain/entities/about.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseAboutRepository(supabase);
}

export function useTimeline() {
  return useQuery({
    queryKey: queryKeys.about.timeline(),
    queryFn: () => new GetTimelineUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useCreateTimeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: Omit<TimelineEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateTimelineUseCase(getRepo()).execute(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
      toast.success("Timeline milestone created successfully");
    },
  });
}

export function useUpdateTimeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, item }: { id: string; item: Partial<TimelineEntity> }) =>
      new UpdateTimelineUseCase(getRepo()).execute(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
      toast.success("Timeline milestone updated successfully");
    },
  });
}

export function useDeleteTimeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteTimelineUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
      toast.success("Timeline milestone deleted successfully");
    },
  });
}

export function useReorderTimeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderTimelineUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
      toast.success("Timeline milestones reordered successfully");
    },
  });
}

export function useBulkDeleteTimeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteTimelineUseCase(getRepo()).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
      toast.success("Selected timeline milestones deleted");
    },
  });
}

export function useBulkUpdateTimelineStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "draft" }) =>
      new BulkUpdateTimelineStatusUseCase(getRepo()).execute(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
      toast.success("Selected timeline status updated");
    },
  });
}
