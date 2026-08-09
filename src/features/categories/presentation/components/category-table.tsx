"use client";
// ==============================================================================
// features/categories/presentation/components/category-table.tsx
// Modern Enterprise Data Table for Categories Management
// ==============================================================================
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderKanban,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  ArrowUpDown,
  Tag,
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
import { useCategoryStore } from "../stores/category.store";
import {
  useCategories,
  useDeleteCategory,
} from "@shared/hooks/categories/use-category-hooks";
import type { CategoryEntity } from "../../domain/entities/category.entity";

import { useTranslations } from "next-intl";

export function CategoryTable() {
  const t = useTranslations("categoriesAdmin");
  const tCommon = useTranslations("common");
  const {
    search,
    status,
    page,
    limit,
    sortBy,
    sortOrder,
    setSearch,
    setStatus,
    setPage,
    setSorting,
    openDrawer,
  } = useCategoryStore();

  const { data, isLoading, error, refetch, isFetching } = useCategories({
    search,
    status,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const deleteCategoryMutation = useDeleteCategory();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categories = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteCategoryMutation.mutateAsync(deleteId);
    setDeleteId(null);
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
            <FolderKanban className="h-5 w-5 text-primary" />
            {t("title")}
          </CardTitle>
          <CardDescription>
            {t("subtitle")}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> {t("refresh")}
          </Button>
          <Link href="/admin/categories/create">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> {t("addCategory")}
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
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
            <Select value={status} onValueChange={(val) => setStatus(val as any)}>
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
            title="Failed to load categories"
            error={error}
            onRetry={() => refetch()}
          />
        ) : (
          /* Table Section */
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-16">{t("table.image")}</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortToggle("name_en")}>
                    <div className="flex items-center gap-1">
                      <span>{t("table.englishName")}</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>{t("table.arabicName")}</TableHead>
                  <TableHead>{t("table.kurdishName")}</TableHead>
                  <TableHead>{t("table.slug")}</TableHead>
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
                      <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-end"><Skeleton className="h-8 w-8 ms-auto rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center">
                      <EmptyState
                        icon={FolderKanban}
                        title={t("emptyTitle")}
                        description={t("emptyDescription")}
                        action={
                          <Link href="/admin/categories/create">
                            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />{t("addCategory")}</Button>
                          </Link>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat: CategoryEntity) => (
                    <TableRow key={cat.id} className="hover:bg-muted/30">
                      {/* Image / Icon */}
                      <TableCell>
                        {cat.image ? (
                          <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                            <Image src={cat.image} alt={cat.nameEn} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                            <FolderKanban className="h-5 w-5" />
                          </div>
                        )}
                      </TableCell>

                      {/* Name EN */}
                      <TableCell className="font-semibold text-foreground">
                        {cat.nameEn}
                      </TableCell>

                      {/* Name AR */}
                      <TableCell dir="rtl" className="font-medium text-muted-foreground">
                        {cat.nameAr}
                      </TableCell>

                      {/* Name KU */}
                      <TableCell dir="rtl" className="text-xs text-muted-foreground">
                        {cat.nameKu ?? "—"}
                      </TableCell>

                      {/* Slug */}
                      <TableCell>
                        <code className="text-xs font-mono bg-muted/60 px-1.5 py-0.5 rounded text-muted-foreground">
                          {cat.slug}
                        </code>
                      </TableCell>

                      {/* Sort Order */}
                      <TableCell className="text-sm font-mono">{cat.sortOrder}</TableCell>

                      {/* Status */}
                      <TableCell>
                        {cat.isActive ? (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                            {cat.status}
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30 font-semibold">
                            {cat.status}
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
                            <DropdownMenuItem onClick={() => openDrawer(cat.id)}>
                              <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/categories/edit/${cat.id}`}>
                                <Edit className="mr-2 h-4 w-4 text-emerald-500" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteId(cat.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
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
              <span className="font-semibold">{totalPages}</span> ({total} total categories)
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
        title="Delete Category?"
        description="Are you sure you want to delete this category? Products assigned to this category might be affected."
        confirmText="Delete Category"
        variant="destructive"
        isLoading={deleteCategoryMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </Card>
  );
}
