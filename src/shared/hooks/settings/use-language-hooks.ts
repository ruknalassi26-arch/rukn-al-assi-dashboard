"use client";
// ==============================================================================
// shared/hooks/settings/use-language-hooks.ts
// React Query Custom Hooks for Languages Management
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseLanguageRepository } from "@features/languages/data/repositories/supabase-language.repository";
import type { CreateLanguageInput, UpdateLanguageInput } from "@features/languages/domain/repositories/i-language.repository";
import { toast } from "sonner";

const repository = new SupabaseLanguageRepository();
export const LANGUAGE_QUERY_KEY = ["languages"];

export function useLanguages() {
  return useQuery({
    queryKey: LANGUAGE_QUERY_KEY,
    queryFn: () => repository.getLanguages(),
  });
}

export function useCreateLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLanguageInput) => repository.createLanguage(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LANGUAGE_QUERY_KEY });
      toast.success(`Language '${data.name}' (${data.code.toUpperCase()}) created successfully.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create language.");
    },
  });
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ code, input }: { code: string; input: UpdateLanguageInput }) =>
      repository.updateLanguage(code, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LANGUAGE_QUERY_KEY });
      toast.success(`Language '${data.name}' updated.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update language.");
    },
  });
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => repository.deleteLanguage(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LANGUAGE_QUERY_KEY });
      toast.success("Language deleted successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete language.");
    },
  });
}
