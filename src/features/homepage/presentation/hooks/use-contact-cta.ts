"use client";
// ==============================================================================
// features/homepage/presentation/hooks/use-contact-cta.ts
// TanStack Query hooks and mutations for Contact CTA section management
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseHomepageRepository } from "../../data/repository/supabase-homepage.repository";
import { GetContactCtaUseCase, UpdateContactCtaUseCase } from "../../domain/usecases/manage-contact-cta.usecase";
import type { ContactCtaEntity } from "../../domain/entities/homepage.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseHomepageRepository(supabase);
}

export function useContactCta() {
  return useQuery({
    queryKey: queryKeys.homepage.contactCta(),
    queryFn: () => new GetContactCtaUseCase(getRepo()).execute(),
    staleTime: 30 * 1000,
  });
}

export function useUpdateContactCta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ContactCtaEntity>) => new UpdateContactCtaUseCase(getRepo()).execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homepage.contactCta() });
      toast.success("Contact CTA section updated successfully");
    },
  });
}
