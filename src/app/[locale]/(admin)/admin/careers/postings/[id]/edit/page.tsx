"use client";
// ==============================================================================
// app/[locale]/(admin)/admin/careers/postings/[id]/edit/page.tsx
// Admin Edit Job Posting Client Page Component
// ==============================================================================
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { JobPostingForm } from "@features/careers/presentation/components/job-posting-form";
import { useJobPostingById } from "@shared/hooks/careers/use-career-hooks";
import { ErrorState } from "@shared/components/error-state";

export default function EditJobPostingPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: posting, isLoading, error, refetch } = useJobPostingById(id);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !posting) {
    return (
      <ErrorState
        title="Job Posting Not Found"
        error={error ?? new Error("Posting does not exist")}
        onRetry={() => refetch()}
      />
    );
  }

  return <JobPostingForm initialData={posting} />;
}
