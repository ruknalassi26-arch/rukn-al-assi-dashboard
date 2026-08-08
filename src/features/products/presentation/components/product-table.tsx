"use client";
// ==============================================================================
// features/products/presentation/components/product-table.tsx
// Modern Enterprise Data Table for Products Management
// ==============================================================================
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Search,
  Plus,
  RefreshCw,
  Download,
  Trash2,
  Copy,
  Edit,
  Eye,
  Star,
  MoreVertical,
  CheckCircle,
  XCircle,
  Archive,
  ArrowUpDown,
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
import { useProductStore } from "../stores/product.store";
import {
  useProducts,
  useProductCategories,
  useDeleteProduct,
  useDuplicateProduct,
  useToggleFeatureProduct,
  useBulkDeleteProducts,
  useBulkUpdateProductStatus,
} from "@shared/hooks/products/use-product-hooks";
import type { ProductEntity, ProductStatus } from "../../domain/entities/product.entity";

import { useTranslations } from "next-intl";

export function ProductTable() {
  const t = useTranslations("productsAdmin");
  const tCommon = useTranslations("common");
  const {
    search,
    categoryId,
    status,
    featured,
    page,
    limit,
    sortBy,
    sortOrder,
    selectedIds,
    setSearch,
    setCategoryId,
    setStatus,
    setFeatured,
    setPage,
    setLimit,
    setSorting,
    toggleSelectId,
    toggleSelectAll,
    clearSelection,
    openDrawer,
    resetFilters,
  } = useProductStore();

  const isFeaturedFilter = featured === "featured" ? true : featured === "standard" ? false : undefined;

  const { data, isLoading, error, refetch, isRefetching } = useProducts({
    search,
    categoryId,
    status,
    isFeatured: isFeaturedFilter,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const { data: categories } = useProductCategories();

  const deleteMutation = useDeleteProduct();
  const duplicateMutation = useDuplicateProduct();
  const toggleFeatureMutation = useToggleFeatureProduct();
  const bulkDeleteMutation = useBulkDeleteProducts();
  const bulkStatusMutation = useBulkUpdateProductStatus();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const products = data?.items ?? [];
  const allIdsOnPage = products.map((p) => p.id);
  const isAllSelected = allIdsOnPage.length > 0 && allIdsOnPage.every((id) => selectedIds.includes(id));

  // CSV Export
  const handleExportCSV = () => {
    if (products.length === 0) return;
    const headers = ["ID", "Name (EN)", "Name (AR)", "Slug", "Category", "Status", "Featured", "Created At"];
    const rows = products.map((p) => [
      p.id,
      `"${p.nameEn.replace(/"/g, '""')}"`,
      `"${p.nameAr.replace(/"/g, '""')}"`,
      p.slug,
      p.category?.nameEn ?? "Uncategorized",
      p.status,
      p.isFeatured ? "Yes" : "No",
      p.createdAt.toISOString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `products-export-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSorting(column, sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSorting(column, "asc");
    }
  };

  if (error) {
    return <ErrorState title="Failed to load products" error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching} className="gap-1 text-xs">
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} /> {t("refresh")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1 text-xs">
            <Download className="h-3.5 w-3.5" /> {t("exportCsv")}
          </Button>
          <Button asChild size="sm" className="gap-1.5 text-xs">
            <Link href="/admin/products/create">
              <Plus className="h-4 w-4" /> {t("addProduct")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="bg-card">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9 text-xs"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryId} onValueChange={(val) => setCategoryId(val)}>
              <SelectTrigger className="text-xs"><SelectValue placeholder={t("allCategories")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.nameEn}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={status} onValueChange={(val: ProductStatus | "all") => setStatus(val)}>
              <SelectTrigger className="text-xs"><SelectValue placeholder={t("allStatuses")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Featured Filter */}
            <Select value={featured} onValueChange={(val: "all" | "featured" | "standard") => setFeatured(val)}>
              <SelectTrigger className="text-xs"><SelectValue placeholder={t("allFeatured")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allFeatured")}</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="standard">Standard Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filters */}
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-muted-foreground">
              {t("resetFilters")}
            </Button>
          </div>

          {/* Bulk Actions Bar */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between p-2.5 bg-primary/10 border border-primary/20 rounded-lg animate-in fade-in">
              <span className="text-xs font-semibold text-primary">
                {selectedIds.length} product(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: "active" })}
                >
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Set Active
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: "draft" })}
                >
                  <XCircle className="h-3.5 w-3.5 text-amber-600" /> Set Draft
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 text-xs gap-1"
                  onClick={() => setIsBulkDeleteOpen(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Selected
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={clearSelection}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card>
        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={() => toggleSelectAll(allIdsOnPage)}
                    />
                  </TableHead>
                  <TableHead className="w-16">{t("table.thumbnail")}</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name_en")}>
                    <div className="flex items-center gap-1">
                      {t("table.productName")} <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>{t("table.category")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.featured")}</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("sort_order")}>
                    <div className="flex items-center gap-1">
                      {t("table.order")} <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("created_at")}>
                    <div className="flex items-center gap-1">
                      {t("table.created")} <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="text-end">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  Array.from({ length: limit }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-12 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-end"><Skeleton className="h-8 w-8 ms-auto rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-64 text-center">
                      <EmptyState
                        icon={Package}
                        title={t("emptyTitle")}
                        description={t("emptyDescription")}
                        action={
                          <Link href="/admin/products/create">
                            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />{t("addProduct")}</Button>
                          </Link>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const isSelected = selectedIds.includes(product.id);
                    return (
                      <TableRow key={product.id} className={isSelected ? "bg-primary/5" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectId(product.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="relative h-10 w-12 rounded overflow-hidden bg-muted border flex items-center justify-center">
                            {product.displayImage ? (
                              <Image src={product.displayImage} alt={product.nameEn} fill className="object-cover" />
                            ) : (
                              <Package className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <span className="font-semibold text-sm text-foreground block truncate max-w-[200px]">
                              {product.nameEn}
                            </span>
                            <span className="text-xs text-muted-foreground block truncate max-w-[200px]" dir="rtl">
                              {product.nameAr}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {product.category?.nameEn ?? "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.status === "active"
                                ? "default"
                                : product.status === "draft"
                                ? "secondary"
                                : "outline"
                            }
                            className="capitalize text-xs"
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              toggleFeatureMutation.mutate({ id: product.id, isFeatured: !product.isFeatured })
                            }
                          >
                            <Star
                              className={`h-4 w-4 ${
                                product.isFeatured ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                        </TableCell>
                        <TableCell className="text-xs font-mono">{product.sortOrder}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {product.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openDrawer(product.id)} className="gap-2">
                                <Eye className="h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/products/edit/${product.id}`} className="gap-2">
                                  <Edit className="h-4 w-4" /> Edit Product
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => duplicateMutation.mutate(product.id)}
                                className="gap-2"
                              >
                                <Copy className="h-4 w-4" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeleteTargetId(product.id)}
                                className="gap-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" /> Delete
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

          {/* Pagination Footer */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t text-xs">
              <span className="text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} products
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="h-8 text-xs"
                >
                  Previous
                </Button>
                <span className="font-semibold">
                  Page {page} of {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="h-8 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={async () => {
          if (deleteTargetId) {
            await deleteMutation.mutateAsync(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete Product"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={async () => {
          await bulkDeleteMutation.mutateAsync(selectedIds);
          clearSelection();
          setIsBulkDeleteOpen(false);
        }}
        title={`Delete ${selectedIds.length} Products`}
        description="Are you sure you want to permanently delete all selected products?"
        confirmText="Delete All Selected"
        variant="destructive"
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
