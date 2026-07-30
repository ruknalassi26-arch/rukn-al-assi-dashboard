"use client";
// ==============================================================================
// features/contact/presentation/pages/edit-branch-page.tsx
// ==============================================================================
import { BranchForm } from "../components/branch-form";
import { useBranch } from "@shared/hooks/contact/use-contact-hooks";
import { Skeleton, Card, CardHeader, CardContent } from "@shared/ui";
import { ErrorState } from "@shared/components/error-state";

interface EditBranchPageProps {
  branchId: string;
}

export function EditBranchPage({ branchId }: EditBranchPageProps) {
  const { data: branch, isLoading, error, refetch } = useBranch(branchId);

  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !branch) {
    return (
      <ErrorState
        title="Branch not found"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return <BranchForm initialData={branch} />;
}
