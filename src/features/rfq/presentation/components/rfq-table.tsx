"use client";
// ==============================================================================
// features/rfq/presentation/components/rfq-table.tsx
// Modern Enterprise Data Table for RFQ Requests Management with Export CSV
// ==============================================================================
import React, { useState } from "react";
import {
  FileText,
  Search,
  RefreshCw,
  Trash2,
  Eye,
  MoreVertical,
  ArrowUpDown,
  Download,
  Mail,
  Calendar,
  Building2,
  Package,
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
import { useTranslations } from "next-intl";
import { EmptyState, DataTablePagination } from "@shared/components";
import { ErrorState } from "@shared/components/error-state";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { useRfqStore } from "../stores/rfq.store";
import {
  useRfqs,
  useDeleteRfq,
  useBulkDeleteRfqs,
  useBulkUpdateRfqStatus,
} from "@shared/hooks/rfq/use-rfq-hooks";
import { RFQ_STATUS_VARIANTS } from "../../domain/enums/rfq.enums";
import type { RfqRequestEntity, RfqStatus } from "../../domain/entities/rfq-request.entity";

export function RfqTable() {
  const t = useTranslations("rfqAdmin");
  const tCommon = useTranslations("common");
  const {
    search,
    status,
    companyFilter,
    dateFrom,
    dateTo,
    page,
    limit,
    sortBy,
    sortOrder,
    selectedIds,
    setSearch,
    setStatus,
    setCompanyFilter,
    setPage,
    setSorting,
    toggleSelectId,
    setSelectedIds,
    clearSelection,
    openDrawer,
    openEmailModal,
  } = useRfqStore();

  const { data, isLoading, error, refetch, isFetching } = useRfqs({
    search,
    status,
    company: companyFilter,
    dateFrom,
    dateTo,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const deleteRfqMutation = useDeleteRfq();
  const bulkDeleteMutation = useBulkDeleteRfqs();
  const bulkUpdateStatusMutation = useBulkUpdateRfqStatus();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const rfqs = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const isAllSelected = rfqs.length > 0 && rfqs.every((r) => selectedIds.includes(r.id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      setSelectedIds(rfqs.map((r) => r.id));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteRfqMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    await bulkDeleteMutation.mutateAsync(selectedIds);
    clearSelection();
    setIsBulkDeleteOpen(false);
  };

  const handleBulkStatusChange = async (newStatus: RfqStatus) => {
    if (selectedIds.length === 0) return;
    await bulkUpdateStatusMutation.mutateAsync({ ids: selectedIds, status: newStatus });
    clearSelection();
  };

  const handleSortToggle = (column: "created_at" | "reference_number" | "company_name" | "status") => {
    if (sortBy === column) {
      setSorting(column, sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSorting(column, "asc");
    }
  };

  // CSV Export functionality
  const handleExportCsv = () => {
    if (rfqs.length === 0) return;

    const headers = ["Reference #", "Company Name", "Contact Name", "Email", "Phone", "Product", "Quantity", "Status", "Date"];
    const rows = rfqs.map((r) => [
      `"${r.referenceNumber}"`,
      `"${r.companyName.replace(/"/g, '""')}"`,
      `"${r.contactName.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone ?? ""}"`,
      `"${(r.productName ?? "").replace(/"/g, '""')}"`,
      `"${r.quantity ?? ""}"`,
      `"${r.status}"`,
      `"${r.createdAt.toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `rfq-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border shadow-xs">
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b bg-muted/20 pb-4">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {t("title")}
          </CardTitle>
          <CardDescription>
            {t("subtitle")}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={rfqs.length === 0} className="gap-1.5">
            <Download className="h-4 w-4" /> {t("exportCsv")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-1.5">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> {t("refresh")}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border bg-primary/5 p-3 text-sm">
            <span className="font-semibold text-primary">
              {selectedIds.length} RFQ request{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("reviewed")}>
                Mark In Review
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("quoted")}>
                Mark Quoted
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("closed")}>
                Close Selected
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9 h-9"
              />
            </div>

            <Input
              placeholder={t("companyFilter")}
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full sm:w-48 h-9"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <Select value={status} onValueChange={(val: RfqStatus | "all") => setStatus(val)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="pending">{t("statuses.pending")}</SelectItem>
                <SelectItem value="reviewed">{t("statuses.reviewed")}</SelectItem>
                <SelectItem value="quoted">{t("statuses.quoted")}</SelectItem>
                <SelectItem value="closed">{t("statuses.closed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error ? (
          <ErrorState
            title="Failed to load RFQ requests"
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
                  <TableHead className="cursor-pointer text-start" onClick={() => handleSortToggle("reference_number")}>
                    <div className="flex items-center gap-1">
                      <span>{t("headers.ref")}</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer text-start" onClick={() => handleSortToggle("company_name")}>
                    <div className="flex items-center gap-1">
                      <span>{t("headers.company")}</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="text-start">{t("headers.item")}</TableHead>
                  <TableHead className="cursor-pointer text-start" onClick={() => handleSortToggle("created_at")}>
                    <div className="flex items-center gap-1">
                      <span>{t("headers.date")}</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer text-start" onClick={() => handleSortToggle("status")}>
                    <div className="flex items-center gap-1">
                      <span>{t("headers.status")}</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="text-end">{t("headers.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-end"><Skeleton className="h-8 w-8 ms-auto rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : rfqs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <EmptyState
                        icon={FileText}
                        title={t("emptyTitle")}
                        description={t("emptyDescription")}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  rfqs.map((rfq: RfqRequestEntity) => {
                    const isSelected = selectedIds.includes(rfq.id);
                    return (
                      <TableRow key={rfq.id} className={isSelected ? "bg-primary/5" : "hover:bg-muted/30"}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectId(rfq.id)}
                          />
                        </TableCell>

                        {/* Ref # */}
                        <TableCell className="font-mono font-bold text-primary">
                          #{rfq.referenceNumber}
                        </TableCell>

                        {/* Company & Contact */}
                        <TableCell className="font-semibold text-foreground">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{rfq.companyName}</span>
                            </div>
                            <div className="text-xs font-normal text-muted-foreground">
                              {rfq.contactName} ({rfq.email})
                            </div>
                          </div>
                        </TableCell>

                        {/* Requested Item */}
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <Package className="h-3.5 w-3.5 text-primary" />
                            <span>{rfq.productName ?? tCommon("generalQuotation")}</span>
                          </div>
                          {rfq.quantity && (
                            <div className="text-xs text-muted-foreground">
                              Qty: {rfq.quantity} {rfq.unit ?? ""}
                            </div>
                          )}
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{rfq.createdAt.toLocaleDateString()}</span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge variant={RFQ_STATUS_VARIANTS[rfq.status]}>
                            {t(`statuses.${rfq.status}`)}
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
                              <DropdownMenuItem onClick={() => openDrawer(rfq.id)}>
                                <Eye className="me-2 h-4 w-4 text-blue-500" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEmailModal(rfq.id)}>
                                <Mail className="me-2 h-4 w-4 text-emerald-500" /> Reply by Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(rfq.id)}
                              >
                                <Trash2 className="me-2 h-4 w-4" /> Delete
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
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          totalItems={total}
          onPageChange={setPage}
        />
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete RFQ Request?"
        description="Are you sure you want to delete this quotation request? This action cannot be undone."
        confirmText="Delete RFQ"
        variant="destructive"
        isLoading={deleteRfqMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        title={`Delete ${selectedIds.length} Selected RFQ Requests?`}
        description="Are you sure you want to delete all selected quotation requests? This action cannot be undone."
        confirmText="Delete RFQs"
        variant="destructive"
        isLoading={bulkDeleteMutation.isPending}
        onConfirm={handleBulkDeleteConfirm}
      />
    </Card>
  );
}
