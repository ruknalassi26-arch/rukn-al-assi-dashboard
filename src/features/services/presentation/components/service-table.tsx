"use client";
// ==============================================================================
// features/services/presentation/components/service-table.tsx
// Modern Enterprise Data Table for Services Management
// ==============================================================================
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  Star,
  MoreVertical,
  ArrowUpDown,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from "@shared/ui";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { useServiceStore } from "../stores/service.store";
import {
  useServices,
  useDeleteService,
  useToggleFeatureService,
  useBulkDeleteServices,
  useBulkUpdateServiceStatus,
} from "@shared/hooks/services/use-service-hooks";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_VARIANTS } from "../../domain/enums/service.enums";
import type { ServiceEntity, ServiceStatus } from "../../domain/entities/service.entity";

export function ServiceTable() {
  const t = useTranslations("servicesAdmin");
  const tCommon = useTranslations("common");
  const {
    search,
    status,
    featured,
    page,
    limit,
    sortBy,
    sortOrder,
    selectedIds,
    setSearch,
    setStatus,
    setFeatured,
    setPage,
    setSorting,
    toggleSelectId,
    setSelectedIds,
    clearSelection,
    openDrawer,
  } = useServiceStore();

  const isFeaturedParam = featured === "all" ? undefined : featured;

  const { data, isLoading, error, refetch, isFetching } = useServices({
    search,
    status,
    isFeatured: isFeaturedParam,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const deleteServiceMutation = useDeleteService();
  const toggleFeatureMutation = useToggleFeatureService();
  const bulkDeleteMutation = useBulkDeleteServices();
  const bulkUpdateStatusMutation = useBulkUpdateServiceStatus();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const services = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const isAllSelected = services.length > 0 && services.every((s) => selectedIds.includes(s.id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      setSelectedIds(services.map((s) => s.id));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteServiceMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    await bulkDeleteMutation.mutateAsync(selectedIds);
    clearSelection();
    setIsBulkDeleteOpen(false);
  };

  const handleBulkStatusChange = async (newStatus: ServiceStatus) => {
    if (selectedIds.length === 0) return;
    await bulkUpdateStatusMutation.mutateAsync({ ids: selectedIds, status: newStatus });
    clearSelection();
  };

  const handleExportCSV = () => {
    if (services.length === 0) return;
    const headers = ["ID", "Slug", "Title EN", "Title AR", "Status", "Featured", "Sort Order", "Created At"];
    const rows = services.map((s) => [
      s.id,
      `"${s.slug}"`,
      `"${s.titleEn.replace(/"/g, '""')}"`,
      `"${s.titleAr.replace(/"/g, '""')}"`,
      s.status,
      s.isFeatured ? "Yes" : "No",
      s.sortOrder,
      s.createdAt.toISOString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `services_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSortToggle = (column: "title_en" | "sort_order" | "created_at") => {
    if (sortBy === column) {
      setSorting(column, sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSorting(column, "asc");
    }
  };

  return (
    <Card className="border shadow-xs">
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b bg-muted/20 pb-4">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            {t("title")}
          </CardTitle>
          <CardDescription>
            {t("subtitle")}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={services.length === 0} className="gap-1.5">
            <Download className="h-4 w-4" /> {t("exportCsv")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-1.5">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> {t("refresh")}
          </Button>
          <Link href="/admin/services/create">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> {t("addService")}
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border bg-primary/5 p-3 text-sm">
            <span className="font-semibold text-primary">
              {selectedIds.length} service{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("active")}>
                Publish Selected
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("draft")}>
                Draft Selected
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setIsBulkDeleteOpen(true)} className="gap-1.5">
                <Trash2 className="h-4 w-4" /> Delete Selected
              </Button>
              <Button size="sm" variant="ghost" onClick={clearSelection}>
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9 h-9"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Status Filter */}
            <Select value={status} onValueChange={(val: ServiceStatus | "all") => setStatus(val)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            {/* Featured Filter */}
            <Select
              value={featured === "all" ? "all" : featured ? "featured" : "standard"}
              onValueChange={(val) =>
                setFeatured(val === "all" ? "all" : val === "featured")
              }
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder={t("allFeatured")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allFeatured")}</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="standard">Standard Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error ? (
          <ErrorState
            title="Failed to load services"
            error={error}
            onRetry={() => refetch()}
          />
        ) : (
          /* Table Section */
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAllToggle}
                    />
                  </TableHead>
                  <TableHead className="w-16">{t("table.image")}</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortToggle("title_en")}>
                    <div className="flex items-center gap-1">
                      <span>{t("table.serviceTitle")}</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>{t("table.arabicTitle")}</TableHead>
                  <TableHead>{t("table.slug")}</TableHead>
                  <TableHead>{t("table.featured")}</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortToggle("sort_order")}>
                    <div className="flex items-center gap-1">
                      <span>{t("table.order")}</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead className="text-end">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-end"><Skeleton className="h-8 w-8 ms-auto rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-64 text-center">
                      <EmptyState
                        icon={Wrench}
                        title={t("emptyTitle")}
                        description={t("emptyDescription")}
                        action={
                          <Link href="/admin/services/create">
                            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />{t("addService")}</Button>
                          </Link>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service: ServiceEntity) => {
                    const isSelected = selectedIds.includes(service.id);
                    return (
                      <TableRow key={service.id} className={isSelected ? "bg-primary/5" : "hover:bg-muted/30"}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectId(service.id)}
                          />
                        </TableCell>

                        {/* Image / Icon */}
                        <TableCell>
                          {service.image ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                              <Image src={service.image} alt={service.titleEn} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                              <Wrench className="h-5 w-5" />
                            </div>
                          )}
                        </TableCell>

                        {/* Title EN */}
                        <TableCell className="font-semibold text-foreground">
                          {service.titleEn}
                        </TableCell>

                        {/* Title AR */}
                        <TableCell dir="rtl" className="font-medium text-muted-foreground">
                          {service.titleAr}
                        </TableCell>

                        {/* Slug */}
                        <TableCell>
                          <code className="text-xs font-mono bg-muted/60 px-1.5 py-0.5 rounded text-muted-foreground">
                            {service.slug}
                          </code>
                        </TableCell>

                        {/* Featured */}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              toggleFeatureMutation.mutate({ id: service.id, isFeatured: !service.isFeatured })
                            }
                          >
                            <Star className={`h-4 w-4 ${service.isFeatured ? "fill-amber-500 text-amber-500" : "text-muted-foreground/40"}`} />
                          </Button>
                        </TableCell>

                        {/* Sort Order */}
                        <TableCell className="text-sm font-mono">{service.sortOrder}</TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.status}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openDrawer(service.id)}>
                                <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/services/edit/${service.id}`}>
                                  <Edit className="mr-2 h-4 w-4 text-emerald-500" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(service.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Showing page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span> ({total} total services)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Service?"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete Service"
        variant="destructive"
        isLoading={deleteServiceMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        title={`Delete ${selectedIds.length} Selected Services?`}
        description="Are you sure you want to delete all selected services? This action cannot be undone."
        confirmText="Delete Services"
        variant="destructive"
        isLoading={bulkDeleteMutation.isPending}
        onConfirm={handleBulkDeleteConfirm}
      />
    </Card>
  );
}
