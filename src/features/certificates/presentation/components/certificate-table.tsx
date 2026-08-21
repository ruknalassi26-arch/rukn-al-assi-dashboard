"use client";
// ==============================================================================
// features/certificates/presentation/components/certificate-table.tsx
// Modern Enterprise Data Table for Certificates Management
// ==============================================================================
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  ArrowUpDown,
  Calendar,
  Building2,
  Copy,
  Loader2,
  Star,
  Sparkles,
  AlertTriangle,
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
import { useCertificateStore } from "../stores/certificate.store";
import {
  useCertificates,
  useDeleteCertificate,
  useDuplicateCertificate,
  useBulkDeleteCertificates,
  useBulkUpdateCertificateStatus,
} from "@shared/hooks/certificates/use-certificate-hooks";
import { useTranslations } from "next-intl";
import type { CertificateEntity, CertificateStatus } from "../../domain/entities/certificate.entity";

export function CertificateTable() {
  const t = useTranslations("certificatesAdmin");
  const tCommon = useTranslations("common");
  const {
    search,
    status,
    isFeatured,
    page,
    limit,
    sortBy,
    sortOrder,
    selectedIds,
    setSearch,
    setStatus,
    setIsFeatured,
    setPage,
    setSorting,
    toggleSelectId,
    setSelectedIds,
    clearSelection,
    openDrawer,
  } = useCertificateStore();

  const { data, isLoading, error, refetch, isFetching } = useCertificates({
    search,
    status,
    isFeatured,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const { data: featuredCertsData } = useCertificates({ isFeatured: true, limit: 100 });
  const featuredCount = featuredCertsData?.total ?? (featuredCertsData?.items?.length ?? 0);

  const deleteCertificateMutation = useDeleteCertificate();
  const duplicateCertificateMutation = useDuplicateCertificate();
  const bulkDeleteMutation = useBulkDeleteCertificates();
  const bulkUpdateStatusMutation = useBulkUpdateCertificateStatus();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const certificates = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const isAllSelected = certificates.length > 0 && certificates.every((c) => selectedIds.includes(c.id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      setSelectedIds(certificates.map((c) => c.id));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteCertificateMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    await bulkDeleteMutation.mutateAsync(selectedIds);
    clearSelection();
    setIsBulkDeleteOpen(false);
  };

  const handleBulkStatusChange = async (newStatus: CertificateStatus) => {
    if (selectedIds.length === 0) return;
    await bulkUpdateStatusMutation.mutateAsync({ ids: selectedIds, status: newStatus });
    clearSelection();
  };

  const handleSortToggle = (column: "title_en" | "sort_order" | "featured_order" | "created_at" | "issue_date") => {
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
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t("title")}
            </CardTitle>
            <Badge
              variant={featuredCount > 4 ? "destructive" : "outline"}
              className="font-mono text-xs gap-1.5 py-0.5 px-2 font-semibold"
            >
              <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
              Featured Certifications: {featuredCount} / 4
            </Badge>
          </div>
          <CardDescription>
            {t("subtitle")}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-1.5">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> {t("refresh")}
          </Button>
          <Link href="/admin/certificates/create">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> {t("addCertificate")}
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border bg-primary/5 p-3 text-sm">
            <span className="font-semibold text-primary">
              {selectedIds.length} certificate{selectedIds.length > 1 ? "s" : ""} selected
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
            {/* Featured Filter */}
            <Select
              value={isFeatured === "all" ? "all" : isFeatured ? "featured" : "not_featured"}
              onValueChange={(val) => {
                if (val === "all") setIsFeatured("all");
                else if (val === "featured") setIsFeatured(true);
                else setIsFeatured(false);
              }}
            >
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="All Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Featured</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="not_featured">Not Featured</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={status} onValueChange={(val) => setStatus(val as CertificateStatus | "all")}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="active">{tCommon("active")}</SelectItem>
                <SelectItem value="draft">{tCommon("draft")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error ? (
          <ErrorState
            title="Failed to load certificates"
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
                  <TableHead className="w-16">{t("table.preview")}</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortToggle("title_en")}>
                    <div className="flex items-center gap-1">
                      <span>Certification</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortToggle("issue_date")}>
                    <div className="flex items-center gap-1">
                      <span>Issued Date</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortToggle("featured_order")}>
                    <div className="flex items-center gap-1">
                      <span>Featured Order</span>
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
                      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-end"><Skeleton className="h-8 w-8 ms-auto rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : certificates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-64 text-center">
                      <EmptyState
                        icon={Shield}
                        title={t("emptyTitle")}
                        description={t("emptyDescription")}
                        action={
                          <Link href="/admin/certificates/create">
                            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />{t("addCertificate")}</Button>
                          </Link>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  certificates.map((cert: CertificateEntity) => {
                    const isSelected = selectedIds.includes(cert.id);
                    return (
                      <TableRow key={cert.id} className={isSelected ? "bg-primary/5" : "hover:bg-muted/30"}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectId(cert.id)}
                          />
                        </TableCell>

                        {/* Image Preview */}
                        <TableCell>
                          {cert.image ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                              <Image src={cert.image} alt={cert.titleEn} fill unoptimized className="object-cover" />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                              <Shield className="h-5 w-5" />
                            </div>
                          )}
                        </TableCell>

                        {/* Certification Title */}
                        <TableCell className="font-semibold text-foreground">
                          <div>
                            <div>{cert.titleEn}</div>
                            <div className="text-xs font-normal text-muted-foreground" dir="rtl">{cert.titleAr}</div>
                          </div>
                        </TableCell>

                        {/* Issuer */}
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{cert.organization ?? "N/A"}</span>
                          </div>
                        </TableCell>

                        {/* Issued Date */}
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{cert.issueDate ?? "N/A"}</span>
                          </div>
                        </TableCell>

                        {/* Featured Badge */}
                        <TableCell>
                          {cert.isFeatured ? (
                            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold gap-1">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              Featured
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground font-normal">
                              Not Featured
                            </Badge>
                          )}
                        </TableCell>

                        {/* Featured Order */}
                        <TableCell>
                          {cert.isFeatured && cert.featuredOrder !== null ? (
                            <span className="inline-flex items-center gap-1 font-mono font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-xs">
                              <Sparkles className="h-3 w-3" />
                              #{cert.featuredOrder}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          {cert.isActive ? (
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                              {cert.status}
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30 font-semibold">
                              {cert.status}
                            </Badge>
                          )}
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
                              <DropdownMenuItem onClick={() => openDrawer(cert.id)}>
                                <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/certificates/edit/${cert.id}`}>
                                  <Edit className="mr-2 h-4 w-4 text-emerald-500" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => duplicateCertificateMutation.mutate(cert.id)}
                                disabled={duplicateCertificateMutation.isPending && duplicateCertificateMutation.variables === cert.id}
                                className="gap-2"
                              >
                                {duplicateCertificateMutation.isPending && duplicateCertificateMutation.variables === cert.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> Duplicating...
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 text-slate-500" /> Duplicate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(cert.id)}
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
              <span className="font-semibold">{totalPages}</span> ({total} total certificates)
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
        title="Delete Certificate?"
        description="Are you sure you want to delete this certificate? This action cannot be undone."
        confirmText="Delete Certificate"
        variant="destructive"
        isLoading={deleteCertificateMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        title={`Delete ${selectedIds.length} Selected Certificates?`}
        description="Are you sure you want to delete all selected certificates? This action cannot be undone."
        confirmText="Delete Certificates"
        variant="destructive"
        isLoading={bulkDeleteMutation.isPending}
        onConfirm={handleBulkDeleteConfirm}
      />
    </Card>
  );
}
