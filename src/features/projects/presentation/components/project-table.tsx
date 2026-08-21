"use client";
// ==============================================================================
// features/projects/presentation/components/project-table.tsx
// Responsive Data Table for Projects with Bulk Operations & Pagination
// ==============================================================================
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Checkbox,
  Skeleton,
  Card,
} from "@shared/ui";
import {
  Pencil,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Can } from "@features/roles-permissions/presentation/components";
import { useProjectsStore } from "../stores/projects.store";
import {
  useProjectsQuery,
  useToggleProjectStatusMutation,
  useToggleProjectFeaturedMutation,
  useBulkDeleteProjectsMutation,
} from "@shared/hooks/projects/use-projects-hooks";
import type { ProjectStatus } from "../../domain/entities/project.entity";

export function ProjectTable() {
  const locale = useLocale();
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");

  const {
    search,
    categoryId,
    status,
    isFeatured,
    page,
    pageSize,
    sortBy,
    sortOrder,
    selectedIds,
    setPage,
    toggleSelectId,
    toggleSelectAll,
    clearSelection,
    openDeleteModal,
  } = useProjectsStore();

  const { data, isLoading, isError, refetch } = useProjectsQuery({
    search,
    categoryId,
    status,
    isFeatured,
    page,
    pageSize,
    sortBy,
    sortOrder,
  });

  const { data: featuredProjectsData } = useProjectsQuery({ isFeatured: true, pageSize: 100 });
  const featuredCount = featuredProjectsData?.total ?? (featuredProjectsData?.items?.length ?? 0);

  const toggleStatusMutation = useToggleProjectStatusMutation();
  const toggleFeaturedMutation = useToggleProjectFeaturedMutation();
  const bulkDeleteMutation = useBulkDeleteProjectsMutation();

  const projects = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const isAllSelected = projects.length > 0 && projects.every((p) => selectedIds.includes(p.id));

  const handleToggleAll = () => {
    toggleSelectAll(projects.map((p) => p.id));
  };

  const handleBulkStatusChange = async (targetStatus: ProjectStatus) => {
    for (const id of selectedIds) {
      await toggleStatusMutation.mutateAsync({ id, status: targetStatus });
    }
    clearSelection();
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected project(s)?`)) {
      await bulkDeleteMutation.mutateAsync(selectedIds);
      clearSelection();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 bg-card border rounded-xl shadow-xs">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
        <XCircle className="h-10 w-10 mx-auto text-destructive" />
        <h3 className="text-base font-bold text-foreground">{tCommon("error")}</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          An error occurred while fetching project data from Supabase.
        </p>
        <Button size="sm" onClick={() => refetch()} className="text-xs">
          {tCommon("retry")}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Operations Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-xl">
          <span className="text-xs font-semibold text-primary">
            {selectedIds.length} {tCommon("items")} selected
          </span>

          <div className="flex items-center gap-2">
            <Can access="projects:edit">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange("published")}
                className="h-8 text-xs gap-1"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {t("bulkActivate")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange("draft")}
                className="h-8 text-xs gap-1"
              >
                <XCircle className="h-3.5 w-3.5 text-amber-500" /> {t("bulkDeactivate")}
              </Button>
            </Can>

            <Can access="projects:delete">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="h-8 text-xs gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> {t("bulkDelete")}
              </Button>
            </Can>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="h-8 text-xs text-muted-foreground"
            >
              {tCommon("clear")}
            </Button>
          </div>
        </div>
      )}

      {/* Featured Quota Badge & Warning */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant={featuredCount > 3 ? "destructive" : "outline"}
            className="font-mono text-xs gap-1.5 py-0.5 px-2.5 font-semibold self-start"
          >
            <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
            Featured Projects: {featuredCount} / 3
          </Badge>
        </div>

        {featuredCount > 3 && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2.5 shadow-xs">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>{featuredCount} projects</strong> are marked as featured. Only the first 3 will appear on Home.
            </span>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="border rounded-xl bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-10">
                <Checkbox checked={isAllSelected} onCheckedChange={handleToggleAll} />
              </TableHead>
              <TableHead className="text-xs font-bold">{t("table.cover")}</TableHead>
              <TableHead className="text-xs font-bold">{t("table.projectName")}</TableHead>
              <TableHead className="text-xs font-bold">{t("table.location")}</TableHead>
              <TableHead className="text-xs font-bold">{t("table.client")}</TableHead>
              <TableHead className="text-xs font-bold">{t("table.status")}</TableHead>
              <TableHead className="text-xs font-bold">{t("table.featured")}</TableHead>
              <TableHead className="text-xs font-bold text-center">{t("table.order")}</TableHead>
              <TableHead className="text-xs font-bold text-end">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-xs font-bold text-muted-foreground">{t("table.noProjectsTitle")}</p>
                    <p className="text-[11px] text-muted-foreground/80">
                      {t("table.noProjectsDesc")}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(project.id)}
                      onCheckedChange={() => toggleSelectId(project.id)}
                    />
                  </TableCell>

                  {/* Thumbnail Cover */}
                  <TableCell>
                    <div className="h-10 w-14 rounded-md overflow-hidden bg-muted border shrink-0">
                      {project.coverImageUrl ? (
                        <img
                          src={project.coverImageUrl}
                          alt={project.getLocalizedTitle(locale)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                          <FolderOpen className="h-4 w-4 opacity-40" />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Title & Slug */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">
                        {project.getLocalizedTitle(locale)}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        /{project.slug}
                      </span>
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell className="text-xs text-muted-foreground">
                    {project.location || "—"}
                  </TableCell>

                  {/* Client */}
                  <TableCell className="text-xs text-muted-foreground">
                    {project.clientName || "—"}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge variant={project.statusBadgeVariant} className="text-[10px] uppercase font-semibold">
                      {project.statusLabel}
                    </Badge>
                  </TableCell>

                  {/* Featured Toggle */}
                  <TableCell>
                    <Can access="projects:edit">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          toggleFeaturedMutation.mutate({
                            id: project.id,
                            isFeatured: !project.isFeatured,
                          })
                        }
                        className="h-7 w-7 text-amber-500 hover:bg-amber-500/10"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            project.isFeatured ? "fill-amber-500 text-amber-500" : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </Can>
                  </TableCell>

                  {/* Sort Order */}
                  <TableCell className="text-xs font-mono text-center">
                    {project.sortOrder}
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Can access="projects:edit">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <Link href={`/${locale}/admin/projects/edit/${project.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </Can>

                      <Can access="projects:delete">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteModal(project.id)}
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </Can>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        {total > 0 && (
          <div className="p-3 border-t bg-card flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {tCommon("showing")} <strong className="text-foreground">{projects.length}</strong> {tCommon("of")}{" "}
              <strong className="text-foreground">{total}</strong> {tCommon("items")}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="h-7 w-7"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[11px] font-semibold px-2">
                {tCommon("page")} {page} {tCommon("of")} {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="h-7 w-7"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
