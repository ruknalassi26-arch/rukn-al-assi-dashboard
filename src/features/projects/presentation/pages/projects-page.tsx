"use client";
// ==============================================================================
// features/projects/presentation/pages/projects-page.tsx
// Main Projects List Management Page
// ==============================================================================
import Link from "next/link";
import { useLocale } from "next-intl";
import { Button } from "@shared/ui";
import { Plus, FolderKanban } from "lucide-react";
import { PermissionGuard, Can } from "@features/roles-permissions/presentation/components";
import { ProjectFilters } from "../components/project-filters";
import { ProjectTable } from "../components/project-table";
import { DeleteProjectDialog } from "../components/delete-project-dialog";

import { useTranslations } from "next-intl";

export function ProjectsPage() {
  const locale = useLocale();
  const t = useTranslations("projectsAdmin");

  return (
    <PermissionGuard permission="projects:view">
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <FolderKanban className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("title")}</h1>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          <Can access="projects:create">
            <Button asChild size="sm" className="text-xs gap-1.5 shrink-0">
              <Link href={`/${locale}/admin/projects/create`}>
                <Plus className="h-4 w-4" /> {t("addProject")}
              </Link>
            </Button>
          </Can>
        </div>

        {/* Search & Filter Toolbar */}
        <ProjectFilters />

        {/* Data Table */}
        <ProjectTable />

        {/* Delete Confirmation Dialog */}
        <DeleteProjectDialog />
      </div>
    </PermissionGuard>
  );
}
