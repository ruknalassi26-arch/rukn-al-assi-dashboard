"use client";
// ==============================================================================
// features/about/presentation/hooks/use-company-info.ts
// TanStack Query hooks for Company Info
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@core/constants/query-keys";
import { createClient } from "@core/lib/supabase/client";
import { SupabaseAboutRepository } from "../../data/repository/supabase-about.repository";
import { GetCompanyInfoUseCase, UpdateCompanyInfoUseCase } from "../../domain/usecases/manage-company-info.usecase";
import type { CompanyInfoEntity } from "../../domain/entities/about.entity";
import { toast } from "@core/utils/toast";

function getRepo() {
  const supabase = createClient();
  return new SupabaseAboutRepository(supabase);
}

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
