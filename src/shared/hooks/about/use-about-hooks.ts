"use client";
// ==============================================================================
// shared/hooks/about/use-about-hooks.ts
// Centralized React Query hooks for About Us Management
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseAboutRepository } from "@features/about/data/repository/supabase-about.repository";
import {
  GetCompanyInfoUseCase,
  UpdateCompanyInfoUseCase,
  GetMissionUseCase,
  UpdateMissionUseCase,
  GetVisionUseCase,
  UpdateVisionUseCase,
  GetCoreValuesUseCase,
  CreateCoreValueUseCase,
  UpdateCoreValueUseCase,
  DeleteCoreValueUseCase,
  ReorderCoreValuesUseCase,
  BulkDeleteCoreValuesUseCase,
  BulkUpdateCoreValuesStatusUseCase,
  GetTimelineUseCase,
  CreateTimelineUseCase,
  UpdateTimelineUseCase,
  DeleteTimelineUseCase,
  ReorderTimelineUseCase,
  BulkDeleteTimelineUseCase,
  BulkUpdateTimelineStatusUseCase,
  GetTeamMembersUseCase,
  CreateTeamMemberUseCase,
  UpdateTeamMemberUseCase,
  DeleteTeamMemberUseCase,
  ReorderTeamMembersUseCase,
  BulkDeleteTeamMembersUseCase,
  BulkUpdateTeamMembersStatusUseCase,
  GetAboutCertificatesUseCase,
  CreateAboutCertificateUseCase,
  UpdateAboutCertificateUseCase,
  DeleteAboutCertificateUseCase,
  ReorderAboutCertificatesUseCase,
  BulkDeleteAboutCertificatesUseCase,
  BulkUpdateAboutCertificatesStatusUseCase,
} from "@features/about/domain/usecases";
import type {
  CompanyInfoEntity,
  MissionEntity,
  VisionEntity,
  CoreValueEntity,
  TimelineEntity,
  TeamMemberEntity,
  AboutCertificateEntity,
} from "@features/about/domain/entities/about.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseAboutRepository(supabase);
}

// ---------- Company Info ----------
export function useCompanyInfo() {
  return useQuery({
    queryKey: queryKeys.about.companyInfo(),
    queryFn: () => new GetCompanyInfoUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useUpdateCompanyInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CompanyInfoEntity>) => new UpdateCompanyInfoUseCase(getRepo()).execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.companyInfo() });
      toast.success("Company information updated successfully");
    },
  });
}

// ---------- Mission & Vision ----------
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

// ---------- Core Values ----------
export function useCoreValues() {
  return useQuery({
    queryKey: queryKeys.about.coreValues(),
    queryFn: () => new GetCoreValuesUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useCreateCoreValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: Omit<CoreValueEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateCoreValueUseCase(getRepo()).execute(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Core value created successfully");
    },
  });
}

export function useUpdateCoreValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: Partial<CoreValueEntity> }) =>
      new UpdateCoreValueUseCase(getRepo()).execute(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Core value updated successfully");
    },
  });
}

export function useDeleteCoreValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteCoreValueUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Core value deleted successfully");
    },
  });
}

export function useReorderCoreValues() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderCoreValuesUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Core values reordered successfully");
    },
  });
}

export function useBulkDeleteCoreValues() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteCoreValuesUseCase(getRepo()).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Selected core values deleted");
    },
  });
}

export function useBulkUpdateCoreValuesStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "draft" }) =>
      new BulkUpdateCoreValuesStatusUseCase(getRepo()).execute(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Selected core values status updated");
    },
  });
}

// ---------- Timeline ----------
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

// ---------- Management Team ----------
export function useTeamMembers() {
  return useQuery({
    queryKey: queryKeys.about.team(),
    queryFn: () => new GetTeamMembersUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (member: Omit<TeamMemberEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateTeamMemberUseCase(getRepo()).execute(member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member added successfully");
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, member }: { id: string; member: Partial<TeamMemberEntity> }) =>
      new UpdateTeamMemberUseCase(getRepo()).execute(id, member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member updated successfully");
    },
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteTeamMemberUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member deleted successfully");
    },
  });
}

export function useReorderTeamMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderTeamMembersUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team members reordered successfully");
    },
  });
}

export function useBulkDeleteTeamMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteTeamMembersUseCase(getRepo()).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Selected team members deleted");
    },
  });
}

export function useBulkUpdateTeamMembersStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "draft" }) =>
      new BulkUpdateTeamMembersStatusUseCase(getRepo()).execute(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Selected team members status updated");
    },
  });
}

// ---------- About Certificates ----------
export function useAboutCertificates() {
  return useQuery({
    queryKey: queryKeys.about.certificates(),
    queryFn: () => new GetAboutCertificatesUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useCreateAboutCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cert: Omit<AboutCertificateEntity, "id" | "createdAt" | "updatedAt">) =>
      new CreateAboutCertificateUseCase(getRepo()).execute(cert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate created successfully");
    },
  });
}

export function useUpdateAboutCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, cert }: { id: string; cert: Partial<AboutCertificateEntity> }) =>
      new UpdateAboutCertificateUseCase(getRepo()).execute(id, cert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate updated successfully");
    },
  });
}

export function useDeleteAboutCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => new DeleteAboutCertificateUseCase(getRepo()).execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate deleted successfully");
    },
  });
}

export function useReorderAboutCertificates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => new ReorderAboutCertificatesUseCase(getRepo()).execute(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificates reordered successfully");
    },
  });
}

export function useBulkDeleteAboutCertificates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => new BulkDeleteAboutCertificatesUseCase(getRepo()).execute(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Selected certificates deleted");
    },
  });
}

export function useBulkUpdateAboutCertificatesStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: "active" | "draft" }) =>
      new BulkUpdateAboutCertificatesStatusUseCase(getRepo()).execute(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Selected certificates status updated");
    },
  });
}
