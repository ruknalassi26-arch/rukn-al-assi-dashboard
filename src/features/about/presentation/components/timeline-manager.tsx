"use client";
// ==============================================================================
// features/about/presentation/components/timeline-manager.tsx
// Company Timeline manager component with Search, Filter, Bulk Actions & Reordering
// ==============================================================================
import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, Calendar, History } from "lucide-react";
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
  useTimeline,
  useCreateTimeline,
  useUpdateTimeline,
  useDeleteTimeline,
  useReorderTimeline,
  useBulkDeleteTimeline,
  useBulkUpdateTimelineStatus,
} from "@shared/hooks/about/use-about-hooks";
import { TimelineDialog } from "@shared/dialogs/timeline-dialog";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";
import type { TimelineEntity } from "../../domain/entities/about.entity";
import { useTranslations } from "next-intl";

export function TimelineManager() {
  const t = useTranslations("aboutAdmin.timeline");
  const tCommon = useTranslations("common");
  const { data: timeline, isLoading, error, refetch } = useTimeline();
  const createMutation = useCreateTimeline();
  const updateMutation = useUpdateTimeline();
  const deleteMutation = useDeleteTimeline();
  const reorderMutation = useReorderTimeline();
  const bulkDeleteMutation = useBulkDeleteTimeline();
  const bulkStatusMutation = useBulkUpdateTimelineStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const filteredTimeline = useMemo(() => {
    if (!timeline) return [];
    return timeline.filter((item) => {
      const matchesSearch =
        item.titleEn.toLowerCase().includes(search.toLowerCase()) ||
        item.titleAr.includes(search) ||
        item.year.toString().includes(search);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [timeline, search, statusFilter]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredTimeline.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTimeline.map((v) => v.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: TimelineEntity) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    if (editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem.id,
        item: values as Partial<TimelineEntity>,
      });
    } else {
      await createMutation.mutateAsync(values as Omit<TimelineEntity, "id" | "createdAt" | "updatedAt">);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await deleteMutation.mutateAsync(deletingId);
    setDeletingId(null);
    setSelectedIds((prev) => prev.filter((i) => i !== deletingId));
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    await bulkDeleteMutation.mutateAsync(selectedIds);
    setSelectedIds([]);
    setIsBulkDeleting(false);
  };

  const handleBulkStatus = async (status: "active" | "draft") => {
    if (selectedIds.length > 0) {
      await bulkStatusMutation.mutateAsync({ ids: selectedIds, status });
      setSelectedIds([]);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (!timeline) return;
    const newTimeline = [...timeline];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTimeline.length) return;

    const [moved] = newTimeline.splice(index, 1);
    newTimeline.splice(targetIndex, 0, moved);

    await reorderMutation.mutateAsync(newTimeline.map((v) => v.id));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState title={tCommon("error")} error={error} onRetry={() => refetch()} />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("subtitle")}</CardDescription>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> {t("addBtn")}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 text-xs"><SelectValue placeholder={tCommon("status")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tCommon("all")}</SelectItem>
                  <SelectItem value="active">{tCommon("active")}</SelectItem>
                  <SelectItem value="draft">{tCommon("draft")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-muted-foreground font-medium me-1">{selectedIds.length} {tCommon("items")}</span>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus("active")} className="text-xs">{tCommon("active")}</Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus("draft")} className="text-xs">{tCommon("draft")}</Button>
                <Button variant="destructive" size="sm" onClick={() => setIsBulkDeleting(true)} className="text-xs">{tCommon("delete")}</Button>
              </div>
            )}
          </div>

          {filteredTimeline.length === 0 ? (
            <EmptyState
              icon={History}
              title={t("emptyTitle")}
              description={t("emptyDesc")}
              action={<Button onClick={handleOpenCreate} size="sm" className="gap-2"><Plus className="h-4 w-4" /> {t("addBtn")}</Button>}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.length === filteredTimeline.length && filteredTimeline.length > 0}
                    onCheckedChange={handleToggleSelectAll}
                  />
                  <span>Timeline Milestone</span>
                </div>
                <span>Actions</span>
              </div>

              {filteredTimeline.map((item, index) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all gap-4 ${
                      isSelected ? "border-primary/50 bg-primary/5" : "bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox checked={isSelected} onCheckedChange={() => handleToggleSelect(item.id)} />
                      <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted shrink-0 border flex items-center justify-center">
                        {item.image ? (
                          <Image src={item.image} alt={item.titleEn} fill className="object-cover" />
                        ) : (
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-bold text-primary">{item.year}</Badge>
                          <span className="font-semibold text-sm text-foreground truncate">{item.titleEn}</span>
                          <Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate" dir="rtl">{item.titleAr}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
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
                          disabled={index === filteredTimeline.length - 1 || reorderMutation.isPending}
                          onClick={() => handleMove(index, "down")}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeletingId(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <TimelineDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Milestone"
        description="Are you sure you want to delete this milestone?"
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmDialog
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Delete ${selectedIds.length} Milestones`}
        description={`Are you sure you want to delete ${selectedIds.length} selected timeline milestones?`}
        confirmText="Delete All Selected"
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
