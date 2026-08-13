"use client";
// ==============================================================================
// features/team/presentation/components/team-member-table.tsx
// Modern Enterprise Data Table for Team Members Management
// ==============================================================================
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  ArrowUpDown,
  Briefcase,
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
import { useTeamStore } from "../stores/team.store";
import {
  useTeamMembers,
  useDeleteTeamMember,
  useBulkDeleteTeamMembers,
  useBulkUpdateTeamMemberStatus,
} from "@shared/hooks/team/use-team-hooks";
import { useTranslations } from "next-intl";
import { TEAM_STATUS_LABELS, TEAM_STATUS_VARIANTS } from "../../domain/enums/team.enums";
import type { TeamMemberEntity, TeamMemberStatus } from "../../domain/entities/team-member.entity";

export function TeamMemberTable() {
  const t = useTranslations("teamAdmin");
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
  } = useTeamStore();

  const { data, isLoading, error, refetch, isFetching } = useTeamMembers({
    search,
    status,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const deleteTeamMemberMutation = useDeleteTeamMember();
  const bulkDeleteMutation = useBulkDeleteTeamMembers();
  const bulkUpdateStatusMutation = useBulkUpdateTeamMemberStatus();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const members = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const isAllSelected = members.length > 0 && members.every((m) => selectedIds.includes(m.id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      setSelectedIds(members.map((m) => m.id));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteTeamMemberMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    await bulkDeleteMutation.mutateAsync(selectedIds);
    clearSelection();
    setIsBulkDeleteOpen(false);
  };

  const handleBulkStatusChange = async (newStatus: TeamMemberStatus) => {
    if (selectedIds.length === 0) return;
    await bulkUpdateStatusMutation.mutateAsync({ ids: selectedIds, status: newStatus });
    clearSelection();
  };

  const handleSortToggle = (column: "full_name_en" | "sort_order" | "created_at") => {
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
            <Users className="h-5 w-5 text-primary" />
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
          <Link href="/admin/team/create">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> {t("addMember")}
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border bg-primary/5 p-3 text-sm">
            <span className="font-semibold text-primary">
              {selectedIds.length} team member{selectedIds.length > 1 ? "s" : ""} selected
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
            <Select value={status} onValueChange={(val: TeamMemberStatus | "all") => setStatus(val)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error ? (
          <ErrorState
            title="Failed to load team members"
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
                  <TableHead className="w-16">{t("table.photo")}</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortToggle("full_name_en")}>
                    <div className="flex items-center gap-1">
                      <span>{t("table.fullName")}</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>{t("table.positionDept")}</TableHead>
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
                      <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-end"><Skeleton className="h-8 w-8 ms-auto rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <EmptyState
                        icon={Users}
                        title={t("emptyTitle")}
                        description={t("emptyDescription")}
                        action={
                          <Link href="/admin/team/create">
                            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />{t("addMember")}</Button>
                          </Link>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member: TeamMemberEntity) => {
                    const isSelected = selectedIds.includes(member.id);
                    return (
                      <TableRow key={member.id} className={isSelected ? "bg-primary/5" : "hover:bg-muted/30"}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectId(member.id)}
                          />
                        </TableCell>

                        {/* Photo */}
                        <TableCell>
                          {member.photo ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full border bg-muted">
                              <Image src={member.photo} alt={member.fullNameEn} fill unoptimized className="object-cover" />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-muted-foreground font-bold text-xs">
                              {member.fullNameEn.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </TableCell>

                        {/* Full Name */}
                        <TableCell className="font-semibold text-foreground">
                          <div>
                            <div>{member.fullNameEn}</div>
                            <div className="text-xs font-normal text-muted-foreground" dir="rtl">{member.fullNameAr}</div>
                          </div>
                        </TableCell>

                        {/* Position */}
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <Briefcase className="h-3.5 w-3.5 text-primary" />
                            <span>{member.positionEn ?? "N/A"}</span>
                          </div>
                        </TableCell>

                        {/* Sort Order */}
                        <TableCell className="text-sm font-mono">{member.sortOrder}</TableCell>

                        {/* Status */}
                        <TableCell>
                          {member.isActive ? (
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                              {tCommon("active")}
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30 font-semibold">
                              {tCommon("draft")}
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
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => openDrawer(member.id)} className="gap-2 text-xs">
                                <Eye className="h-3.5 w-3.5" />
                                <span>{tCommon("viewAll")}</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem asChild className="gap-2 text-xs">
                                <Link href={`/admin/team/edit/${member.id}`}>
                                  <Edit className="h-3.5 w-3.5 text-emerald-500" />
                                  <span>{tCommon("edit")}</span>
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => setDeleteId(member.id)}
                                className="gap-2 text-xs text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>{tCommon("delete")}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  }))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              {tCommon("pagination.showingPage")} <span className="font-semibold">{page}</span> {tCommon("pagination.of")}{" "}
              <span className="font-semibold">{totalPages}</span> ({total} {tCommon("pagination.total")})
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                {tCommon("pagination.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                {tCommon("pagination.next")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title={tCommon("delete")}
        description={tCommon("deleteDesc")}
        confirmText={tCommon("delete")}
        variant="destructive"
        isLoading={deleteTeamMemberMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        title={tCommon("delete")}
        description={tCommon("deleteDesc")}
        confirmText={tCommon("delete")}
        variant="destructive"
        isLoading={bulkDeleteMutation.isPending}
        onConfirm={handleBulkDeleteConfirm}
      />
    </Card>
  );
}
