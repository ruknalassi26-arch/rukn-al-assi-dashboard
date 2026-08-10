"use client";
// ==============================================================================
// features/about/presentation/components/timeline-manager.tsx
// Timeline Event Manager (timeline_events & timeline_event_translations)
// Strictly matching DB schema & permissions
// ==============================================================================
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, Calendar } from "lucide-react";
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
import { TimelineDialog, type TimelineFormValues } from "./timeline-dialog";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";
import { usePermission } from "@features/roles-permissions/presentation/hooks/use-permission";
import type { TimelineEntity } from "../../domain/entities/about.entity";

export function TimelineManager() {
  const t = useTranslations("aboutAdmin.timeline");
  const tCommon = useTranslations("common");

  const { hasPermission } = usePermission();
  const canManage = hasPermission("about", "manage");

  const { data: timelineEvents, isLoading, error, refetch } = useTimeline();
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

  const filteredEvents = useMemo(() => {
    if (!timelineEvents) return [];
    return timelineEvents.filter((item) => {
      const en = item.getTranslation("en");
      const ar = item.getTranslation("ar");
      const matchesSearch =
        en.title.toLowerCase().includes(search.toLowerCase()) ||
        ar.title.includes(search) ||
        item.eventYear.includes(search);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [timelineEvents, search, statusFilter]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredEvents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEvents.map((v) => v.id));
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

  const handleFormSubmit = async (formValues: TimelineFormValues) => {
    const translations = {
      en: { title: formValues.titleEn, description: formValues.descriptionEn || "" },
      ...(formValues.titleAr ? { ar: { title: formValues.titleAr, description: formValues.descriptionAr || "" } } : {}),
      ...(formValues.titleKu ? { ckb: { title: formValues.titleKu, description: formValues.descriptionKu || "" } } : {}),
    };

    const payload = {
      eventYear: formValues.eventYear,
      sortOrder: formValues.sortOrder,
      status: formValues.status,
      translations,
    };

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, input: payload });
    } else {
      await createMutation.mutateAsync(payload);
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
    if (!timelineEvents) return;
    const newEvents = [...timelineEvents];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newEvents.length) return;

    const [moved] = newEvents.splice(index, 1);
    newEvents.splice(targetIndex, 0, moved);

    await reorderMutation.mutateAsync(newEvents.map((v) => v.id));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                Company Timeline Events
              </CardTitle>
              <CardDescription className="text-xs">
                Manage company milestones, event years, descriptions, and ordering.
              </CardDescription>
            </div>
            {canManage && (
              <Button onClick={handleOpenCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Timeline Event
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search timeline events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {canManage && selectedIds.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto bg-muted/50 p-1.5 rounded-lg border">
                <span className="text-xs font-semibold px-2">
                  {selectedIds.length} Selected
                </span>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus("active")}>
                  Activate
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus("draft")}>
                  Draft
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsBulkDeleting(true)}
                >
                  Delete Selected
                </Button>
              </div>
            )}
          </div>

          {/* Timeline List */}
          {filteredEvents.length === 0 ? (
            <EmptyState
              title="No Timeline Events Found"
              description="Add key company milestones and achievements."
              action={
                canManage ? (
                  <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Timeline Event
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="border rounded-lg overflow-hidden divide-y">
              <div className="bg-muted/40 p-3 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-3">
                  {canManage && (
                    <Checkbox
                      checked={selectedIds.length === filteredEvents.length}
                      onCheckedChange={handleToggleSelectAll}
                    />
                  )}
                  <span>Year & Milestone</span>
                </div>
                <span>Status & Actions</span>
              </div>

              {filteredEvents.map((item, index) => {
                const en = item.getTranslation("en");

                return (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {canManage && (
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={() => handleToggleSelect(item.id)}
                          className="mt-1"
                        />
                      )}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20 font-bold text-xs shrink-0">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.eventYear}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">
                          {en.title || "Untitled Milestone"}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {en.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <Badge
                        variant={item.status === "active" ? "default" : "secondary"}
                        className={
                          item.status === "active"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30"
                        }
                      >
                        {item.status === "active" ? "Active" : "Draft"}
                      </Badge>

                      {canManage && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => handleMove(index, "up")}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === filteredEvents.length - 1}
                            onClick={() => handleMove(index, "down")}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingId(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Form Dialog */}
      <TimelineDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Single Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Timeline Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Selected Timeline Events"
        description={`Are you sure you want to delete ${selectedIds.length} timeline events?`}
        confirmText="Delete All"
        variant="destructive"
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
