"use client";
// ==============================================================================
// shared/hooks/about/use-about-hooks.ts
// Centralized React Query hooks for About Us Management
// Strictly matching Supabase DB Schema & Permissions
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseAboutRepository } from "@features/about/data/repository/supabase-about.repository";
import type {
  UpdateCompanyInfoTranslationInput,
  SaveCoreValueInput,
  SaveTimelineInput,
  SaveTeamMemberInput,
  SaveCertificateInput,
} from "@features/about/domain/repositories/i-about.repository";
import type { SectionStatus } from "@features/about/domain/entities/about.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseAboutRepository(supabase);
}

// ---------- 1. Company Info ----------
export function useCompanyInfo() {
  return useQuery({
    queryKey: queryKeys.about.companyInfo(),
    queryFn: () => getRepo().getCompanyInfo(),
    staleTime: 30 * 1000,
  });
}

export function useUpdateCompanyInfoTranslation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCompanyInfoTranslationInput) =>
      getRepo().updateCompanyInfoTranslation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.companyInfo() });
      toast.success("Company profile information updated successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update company profile information.");
    },
  });
}

// ---------- 2. Core Values ----------
export function useCoreValues() {
  return useQuery({
    queryKey: queryKeys.about.coreValues(),
    queryFn: () => getRepo().getCoreValues(),
    staleTime: 30 * 1000,
  });
}

export function useCreateCoreValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveCoreValueInput) => getRepo().createCoreValue(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Core value created successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create core value.");
    },
  });
}

export function useUpdateCoreValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SaveCoreValueInput }) =>
      getRepo().updateCoreValue(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Core value updated successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update core value.");
    },
  });
}

export function useDeleteCoreValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getRepo().deleteCoreValue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Core value deleted.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete core value.");
    },
  });
}

export function useReorderCoreValues() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => getRepo().reorderCoreValues(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
    },
  });
}

export function useBulkDeleteCoreValues() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => getRepo().bulkDeleteCoreValues(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Selected core values deleted.");
    },
  });
}

export function useBulkUpdateCoreValuesStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: SectionStatus }) =>
      getRepo().bulkUpdateCoreValuesStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.coreValues() });
      toast.success("Status updated for selected core values.");
    },
  });
}

// ---------- 3. Timeline ----------
export function useTimeline() {
  return useQuery({
    queryKey: queryKeys.about.timeline(),
    queryFn: () => getRepo().getTimeline(),
    staleTime: 30 * 1000,
  });
}

export function useCreateTimeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveTimelineInput) => getRepo().createTimeline(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
      toast.success("Timeline event created successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create timeline event.");
    },
  });
}

export function useUpdateTimeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SaveTimelineInput }) =>
      getRepo().updateTimeline(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
      toast.success("Timeline event updated successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update timeline event.");
    },
  });
}

export function useDeleteTimeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getRepo().deleteTimeline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
      toast.success("Timeline event deleted.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete timeline event.");
    },
  });
}

export function useReorderTimeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => getRepo().reorderTimeline(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
    },
  });
}

export function useBulkDeleteTimeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => getRepo().bulkDeleteTimeline(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
      toast.success("Selected timeline events deleted.");
    },
  });
}

export function useBulkUpdateTimelineStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: SectionStatus }) =>
      getRepo().bulkUpdateTimelineStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.timeline() });
      toast.success("Status updated for selected timeline events.");
    },
  });
}

// ---------- 4. Management Team ----------
export function useTeamMembers() {
  return useQuery({
    queryKey: queryKeys.about.team(),
    queryFn: () => getRepo().getTeamMembers(),
    staleTime: 30 * 1000,
  });
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveTeamMemberInput) => getRepo().createTeamMember(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member created successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create team member.");
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SaveTeamMemberInput }) =>
      getRepo().updateTeamMember(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member updated successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update team member.");
    },
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getRepo().deleteTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Team member deleted.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete team member.");
    },
  });
}

export function useReorderTeamMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => getRepo().reorderTeamMembers(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
    },
  });
}

export function useBulkDeleteTeamMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => getRepo().bulkDeleteTeamMembers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Selected team members deleted.");
    },
  });
}

export function useBulkUpdateTeamMembersStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: SectionStatus }) =>
      getRepo().bulkUpdateTeamMembersStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.team() });
      toast.success("Status updated for selected team members.");
    },
  });
}

// ---------- 5. Certificates ----------
export function useCertificates() {
  return useQuery({
    queryKey: queryKeys.about.certificates(),
    queryFn: () => getRepo().getCertificates(),
    staleTime: 30 * 1000,
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveCertificateInput) => getRepo().createCertificate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate created successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create certificate.");
    },
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SaveCertificateInput }) =>
      getRepo().updateCertificate(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate updated successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update certificate.");
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getRepo().deleteCertificate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Certificate deleted.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete certificate.");
    },
  });
}

export function useReorderCertificates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => getRepo().reorderCertificates(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
    },
  });
}

export function useBulkDeleteCertificates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => getRepo().bulkDeleteCertificates(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Selected certificates deleted.");
    },
  });
}

export function useBulkUpdateCertificatesStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: SectionStatus }) =>
      getRepo().bulkUpdateCertificatesStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about.certificates() });
      toast.success("Status updated for selected certificates.");
    },
  });
}
