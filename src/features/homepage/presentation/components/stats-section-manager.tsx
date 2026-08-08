"use client";
// ==============================================================================
// features/homepage/presentation/components/stats-section-manager.tsx
// Company Statistics Section manager with Search, Filter, Bulk Actions & Reordering
// ==============================================================================
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, Award, Users, Briefcase, Wrench, Package, CheckCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Badge,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@shared/ui";
import {
  useCompanyStats,
  useCreateCompanyStat,
  useUpdateCompanyStat,
  useDeleteCompanyStat,
  useReorderCompanyStats,
  useBulkDeleteCompanyStats,
  useBulkUpdateCompanyStatsStatus,
} from "@shared/hooks/homepage/use-homepage-hooks";
import { StatDialog } from "@shared/dialogs/stat-dialog";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";
import type { CompanyStatEntity } from "../../domain/entities/homepage.entity";

const ICON_MAP: Record<string, React.ElementType> = {
  Award,
  Users,
  Briefcase,
  Wrench,
  Package,
  CheckCircle,
  Clock,
};

export function StatsSectionManager() {
  const t = useTranslations("homepageAdmin");
  const tCommon = useTranslations("common");
  const { data: stats, isLoading, error, refetch } = useCompanyStats();
  const createMutation = useCreateCompanyStat();
  const updateMutation = useUpdateCompanyStat();
  const deleteMutation = useDeleteCompanyStat();
  const reorderMutation = useReorderCompanyStats();
  const bulkDeleteMutation = useBulkDeleteCompanyStats();
  const bulkStatusMutation = useBulkUpdateCompanyStatsStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<CompanyStatEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Filtering
  const filteredStats = useMemo(() => {
    if (!stats) return [];
    return stats.filter((item) => {
      const matchesSearch =
        item.titleEn.toLowerCase().includes(search.toLowerCase()) ||
        item.titleAr.includes(search) ||
        item.value.includes(search);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [stats, search, statusFilter]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStats.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStats.map((s) => s.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenCreate = () => {
    setEditingStat(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (stat: CompanyStatEntity) => {
    setEditingStat(stat);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStat(null);
  };

  const handleFormSubmit = async (values: any) => {
    if (editingStat) {
      await updateMutation.mutateAsync({ id: editingStat.id, stat: values });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await deleteMutation.mutateAsync(deletingId);
    setDeletingId(null);
  };

  const handleConfirmBulkDelete = async () => {
    await bulkDeleteMutation.mutateAsync(selectedIds);
    setSelectedIds([]);
    setIsBulkDeleting(false);
  };

  const handleBulkStatus = async (status: "active" | "draft") => {
    await bulkStatusMutation.mutateAsync({ ids: selectedIds, status });
    setSelectedIds([]);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (!stats) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stats.length) return;

    const newStats = [...stats];
    const [moved] = newStats.splice(index, 1);
    newStats.splice(targetIndex, 0, moved);

    await reorderMutation.mutateAsync(newStats.map((s) => s.id));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load company statistics"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>{t("statsTitle")}</CardTitle>
          <CardDescription>
            {t("statsSubtitle")}
          </CardDescription>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> {t("addStat")}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchStats")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 text-xs">
                <SelectValue placeholder={tCommon("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tCommon("allStatuses")}</SelectItem>
                <SelectItem value="active">{tCommon("active")}</SelectItem>
                <SelectItem value="draft">{tCommon("draft")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-muted-foreground font-medium me-1">
                {selectedIds.length} {tCommon("selected")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatus("active")}
                disabled={bulkStatusMutation.isPending}
                className="text-xs"
              >
                {tCommon("setActive")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatus("draft")}
                disabled={bulkStatusMutation.isPending}
                className="text-xs"
              >
                {tCommon("setDraft")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleting(true)}
                disabled={bulkDeleteMutation.isPending}
                className="text-xs"
              >
                {tCommon("deleteSelected")}
              </Button>
            </div>
          )}
        </div>

        {/* List */}
        {filteredStats.length === 0 ? (
          <EmptyState
            icon={Award}
            title={t("emptyStatsTitle")}
            description={t("emptyStatsDesc")}
            action={
              <Button onClick={handleOpenCreate} size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> {t("addStat")}
              </Button>
            }
          />
        ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.length === filteredStats.length && filteredStats.length > 0}
                    onCheckedChange={handleToggleSelectAll}
                  />
                  <span>Metric Title & Value</span>
                </div>
                <span>Actions</span>
              </div>

              {filteredStats.map((stat, index) => {
                const IconComponent = (stat.icon && ICON_MAP[stat.icon]) || Award;
                const isSelected = selectedIds.includes(stat.id);

                return (
                  <div
                    key={stat.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all gap-4 ${
                      isSelected ? "border-primary/50 bg-primary/5" : "bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleSelect(stat.id)}
                      />
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-foreground">{stat.value}</span>
                          <span className="font-medium text-sm text-foreground truncate">{stat.titleEn}</span>
                          <Badge variant={stat.status === "active" ? "default" : "secondary"}>
                            {stat.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate" dir="rtl">
                          {stat.titleAr}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Reorder Buttons */}
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={index === 0 || reorderMutation.isPending}
                          onClick={() => handleMove(index, "up")}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={index === filteredStats.length - 1 || reorderMutation.isPending}
                          onClick={() => handleMove(index, "down")}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(stat)}
                        className="gap-1.5"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingId(stat.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <StatDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingStat}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Confirm Single Delete */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Statistic"
        description="Are you sure you want to delete this company statistic? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      {/* Confirm Bulk Delete */}
      <ConfirmDialog
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Delete ${selectedIds.length} Statistics`}
        description={`Are you sure you want to delete ${selectedIds.length} selected statistics? This action cannot be undone.`}
        confirmText="Delete All Selected"
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
