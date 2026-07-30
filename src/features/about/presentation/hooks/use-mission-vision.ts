"use client";
// ==============================================================================
// features/about/presentation/hooks/use-mission-vision.ts
// TanStack Query hooks for Company Mission and Vision
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseAboutRepository } from "../../data/repository/supabase-about.repository";
import { GetMissionUseCase, UpdateMissionUseCase } from "../../domain/usecases/manage-mission.usecase";
import { GetVisionUseCase, UpdateVisionUseCase } from "../../domain/usecases/manage-vision.usecase";
import type { MissionEntity, VisionEntity } from "../../domain/entities/about.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseAboutRepository(supabase);
}

// ---------- Mission ----------
export function useMission() {
  return useQuery({
    queryKey: queryKeys.about.mission(),
    queryFn: () => new GetMissionUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useUpdateMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<MissionEntity>) => new UpdateMissionUseCase(getRepo()).execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.mission() });
      toast.success("Company mission updated successfully");
    },
  });
}

// ---------- Vision ----------
export function useVision() {
  return useQuery({
    queryKey: queryKeys.about.vision(),
    queryFn: () => new GetVisionUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useUpdateVision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<VisionEntity>) => new UpdateVisionUseCase(getRepo()).execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.vision() });
      toast.success("Company vision updated successfully");
    },
  });
}
