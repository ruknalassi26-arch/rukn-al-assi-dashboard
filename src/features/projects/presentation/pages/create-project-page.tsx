"use client";
// ==============================================================================
// features/projects/presentation/pages/create-project-page.tsx
// ==============================================================================
import { PermissionGuard } from "@features/roles-permissions/presentation/components";
import { ProjectForm } from "../components/project-form";

export function CreateProjectPage() {
  return (
    <PermissionGuard permission="projects:create">
      <ProjectForm />
    </PermissionGuard>
  );
}
