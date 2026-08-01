"use client";
// ==============================================================================
// features/projects/presentation/pages/edit-project-page.tsx
// ==============================================================================
import { useParams } from "next/navigation";
import { PermissionGuard } from "@features/roles-permissions/presentation/components";
import { ProjectForm } from "../components/project-form";
import { useProjectDetailQuery } from "@shared/hooks/projects/use-projects-hooks";
import { Skeleton, Card } from "@shared/ui";
import { AlertCircle } from "lucide-react";

export function EditProjectPage() {
  const params = useParams();
  const id = (params?.id as string) ?? null;

  const { data: project, isLoading, isError } = useProjectDetailQuery(id);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="col-span-2 h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <Card className="border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3 max-w-md mx-auto my-12">
        <AlertCircle className="h-10 w-10 mx-auto text-destructive" />
        <h3 className="text-base font-bold text-foreground">Project Not Found</h3>
        <p className="text-xs text-muted-foreground">
          The requested project record could not be loaded or may have been removed.
        </p>
      </Card>
    );
  }

  return (
    <PermissionGuard permission="projects:edit">
      <ProjectForm initialData={project} isEdit />
    </PermissionGuard>
  );
}
