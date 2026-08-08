"use client";
// ==============================================================================
// features/contact/presentation/components/branch-table.tsx
// Modern Enterprise Data Table for Company Branches Management
// ==============================================================================
import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  ArrowUpDown,
  MapPin,
  Mail,
  Phone,
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
import { useContactStore } from "../stores/contact.store";
import {
  useBranches,
  useDeleteBranch,
  useBulkDeleteBranches,
  useBulkUpdateBranchStatus,
} from "@shared/hooks/contact/use-contact-hooks";
import { useTranslations } from "next-intl";
import { BRANCH_STATUS_LABELS, BRANCH_STATUS_VARIANTS } from "../../domain/enums/contact.enums";
import type { BranchEntity, BranchStatus } from "../../domain/entities/branch.entity";

export function BranchTable() {
  const t = useTranslations("branchesAdmin");
  const tCommon = useTranslations("common");
  const {
    search,
    status,
    page,
    limit,
    sortBy,
    sortOrder,
    selectedIds,
    setSearch,
    setStatus,
    setPage,
    setSorting,
    toggleSelectId,
    setSelectedIds,
    clearSelection,
    openDrawer,
  } = useContactStore();

  const { data, isLoading, error, refetch, isFetching } = useBranches({
    search,
    status,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const deleteBranchMutation = useDeleteBranch();
  const bulkDeleteMutation = useBulkDeleteBranches();
  const bulkUpdateStatusMutation = useBulkUpdateBranchStatus();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const branches = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const isAllSelected = branches.length > 0 && branches.every((b) => selectedIds.includes(b.id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      setSelectedIds(branches.map((b) => b.id));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteBranchMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    await bulkDeleteMutation.mutateAsync(selectedIds);
    clearSelection();
    setIsBulkDeleteOpen(false);
  };

  const handleBulkStatusChange = async (newStatus: BranchStatus) => {
    if (selectedIds.length === 0) return;
    await bulkUpdateStatusMutation.mutateAsync({ ids: selectedIds, status: newStatus });
    clearSelection();
  };

  const handleSortToggle = (column: "name_en" | "sort_order" | "created_at") => {
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
            <Building2 className="h-5 w-5 text-primary" />
            {t("title")}
          </CardTitle>
          <CardDescription>
            {t("subtitle")}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-1.5">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> {t("refresh")}
          </Button>
          <Link href="/admin/contact/branches/create">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> {t("addBranch")}
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border bg-primary/5 p-3 text-sm">
            <span className="font-semibold text-primary">
              {selectedIds.length} branch{selectedIds.length > 1 ? "es" : ""} selected
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
            <Select value={status} onValueChange={(val: BranchStatus | "all") => setStatus(val)}>
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
            title="Failed to load company branches"
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
                  <TableHead className="cursor-pointer" onClick={() => handleSortToggle("name_en")}>
                    <div className="flex items-center gap-1">
                      <span>{t("table.branchName")}</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>{t("table.cityRegion")}</TableHead>
                  <TableHead>{t("table.contact")}</TableHead>
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
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-end"><Skeleton className="h-8 w-8 ms-auto rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : branches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <EmptyState
                        icon={Building2}
                        title={t("emptyTitle")}
                        description={t("emptyDescription")}
                        action={
                          <Link href="/admin/contact/branches/create">
                            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />{t("addBranch")}</Button>
                          </Link>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  branches.map((branch: BranchEntity) => {
                    const isSelected = selectedIds.includes(branch.id);
                    return (
                      <TableRow key={branch.id} className={isSelected ? "bg-primary/5" : "hover:bg-muted/30"}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectId(branch.id)}
                          />
                        </TableCell>

                        {/* Name */}
                        <TableCell className="font-semibold text-foreground">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span>{branch.nameEn}</span>
                                {branch.isHeadquarters && (
                                  <Badge variant="default" className="text-[10px] py-0 bg-amber-500">
                                    HQ
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs font-normal text-muted-foreground" dir="rtl">{branch.nameAr}</div>
                            </div>
                          </div>
                        </TableCell>

                        {/* City / Location */}
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{branch.cityEn ?? "N/A"}</span>
                          </div>
                        </TableCell>

                        {/* Contact Info */}
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="space-y-0.5">
                            {branch.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[140px]">{branch.email}</span>
                              </div>
                            )}
                            {branch.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{branch.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Sort Order */}
                        <TableCell className="text-sm font-mono">{branch.sortOrder}</TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge variant={branch.isActive ? "default" : "secondary"}>
                            {branch.status}
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
                              <DropdownMenuItem onClick={() => openDrawer(branch.id)}>
                                <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/contact/branches/edit/${branch.id}`}>
                                  <Edit className="mr-2 h-4 w-4 text-emerald-500" /> Edit Branch
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(branch.id)}
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
              <span className="font-semibold">{totalPages}</span> ({total} total branches)
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
        title="Delete Branch?"
        description="Are you sure you want to delete this company branch? This action cannot be undone."
        confirmText="Delete Branch"
        variant="destructive"
        isLoading={deleteBranchMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        title={`Delete ${selectedIds.length} Selected Branches?`}
        description="Are you sure you want to delete all selected company branches? This action cannot be undone."
        confirmText="Delete Branches"
        variant="destructive"
        isLoading={bulkDeleteMutation.isPending}
        onConfirm={handleBulkDeleteConfirm}
      />
    </Card>
  );
}
