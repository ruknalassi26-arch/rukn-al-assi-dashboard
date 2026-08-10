"use client";
// ==============================================================================
// features/about/presentation/components/core-values-manager.tsx
// Core Values Manager (core_values & core_value_translations)
// Strictly matching DB schema & permissions
// ==============================================================================
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, ShieldCheck, Award, Zap, Users, Heart, Star, Target } from "lucide-react";
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
  useCoreValues,
  useCreateCoreValue,
  useUpdateCoreValue,
  useDeleteCoreValue,
  useReorderCoreValues,
  useBulkDeleteCoreValues,
  useBulkUpdateCoreValuesStatus,
} from "@shared/hooks/about/use-about-hooks";
import { ValueDialog, type ValueFormValues } from "./value-dialog";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";
import { usePermission } from "@features/roles-permissions/presentation/hooks/use-permission";
import type { CoreValueEntity, SectionStatus } from "../../domain/entities/about.entity";

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  Award,
  Zap,
  Users,
  Heart,
  Star,
  Target,
};

export function CoreValuesManager() {
  const t = useTranslations("aboutAdmin.coreValues");
  const tCommon = useTranslations("common");

  const { hasPermission } = usePermission();
  const canManage = hasPermission("about", "manage");

  const { data: values, isLoading, error, refetch } = useCoreValues();
  const createMutation = useCreateCoreValue();
  const updateMutation = useUpdateCoreValue();
  const deleteMutation = useDeleteCoreValue();
  const reorderMutation = useReorderCoreValues();
  const bulkDeleteMutation = useBulkDeleteCoreValues();
  const bulkStatusMutation = useBulkUpdateCoreValuesStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<CoreValueEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const filteredValues = useMemo(() => {
    if (!values) return [];
    return values.filter((item) => {
      const en = item.getTranslation("en");
      const ar = item.getTranslation("ar");
      const matchesSearch =
        en.title.toLowerCase().includes(search.toLowerCase()) ||
        ar.title.includes(search);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [values, search, statusFilter]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredValues.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredValues.map((v) => v.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenCreate = () => {
    setEditingValue(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: CoreValueEntity) => {
    setEditingValue(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formValues: ValueFormValues) => {
    const translations = {
      en: { title: formValues.titleEn, description: formValues.descriptionEn || "" },
      ...(formValues.titleAr ? { ar: { title: formValues.titleAr, description: formValues.descriptionAr || "" } } : {}),
      ...(formValues.titleKu ? { ku: { title: formValues.titleKu, description: formValues.descriptionKu || "" } } : {}),
    };

    const payload = {
      icon: formValues.icon,
      sortOrder: formValues.sortOrder,
      status: formValues.status,
      translations,
    };

    if (editingValue) {
      await updateMutation.mutateAsync({ id: editingValue.id, input: payload });
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

  const handleBulkStatus = async (status: SectionStatus) => {
    if (selectedIds.length > 0) {
      await bulkStatusMutation.mutateAsync({ ids: selectedIds, status });
      setSelectedIds([]);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (!values) return;
    const newValues = [...values];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newValues.length) return;

    const [moved] = newValues.splice(index, 1);
    newValues.splice(targetIndex, 0, moved);

    await reorderMutation.mutateAsync(newValues.map((v) => v.id));
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
                Core Values
              </CardTitle>
              <CardDescription className="text-xs">
                Manage your organization core principles, icons, ordering, and translations.
              </CardDescription>
            </div>
            {canManage && (
              <Button onClick={handleOpenCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Core Value
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
                  placeholder="Search core values..."
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
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {canManage && selectedIds.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto bg-muted/50 p-1.5 rounded-lg border">
                <span className="text-xs font-semibold px-2">
                  {selectedIds.length} Selected
                </span>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus("published")}>
                  Publish
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus("draft")}>
                  Draft
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus("archived")}>
                  Archive
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsBulkDeleting(true)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Core Values List */}
          {filteredValues.length === 0 ? (
            <EmptyState
              title="No Core Values Found"
              description="Create core values to display your organizational foundation."
              action={
                canManage ? (
                  <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Core Value
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
                      checked={selectedIds.length === filteredValues.length}
                      onCheckedChange={handleToggleSelectAll}
                    />
                  )}
                  <span>Icon & Value</span>
                </div>
                <span>Status & Actions</span>
              </div>

              {filteredValues.map((item, index) => {
                const IconComp = ICON_MAP[item.icon || ""] || Target;
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
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">
                          {en.title || "Untitled Core Value"}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {en.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <Badge
                        variant="secondary"
                        className={
                          item.status === "published"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                            : item.status === "draft"
                              ? "bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30"
                              : "bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30"
                        }
                      >
                        {item.status === "published" ? "Published" : item.status === "draft" ? "Draft" : "Archived"}
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
                            disabled={index === filteredValues.length - 1}
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

      {/* Value Form Dialog */}
      <ValueDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingValue}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Single Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Core Value"
        description="Are you sure you want to delete this core value? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Selected Core Values"
        description={`Are you sure you want to delete ${selectedIds.length} core values?`}
        confirmText="Delete All"
        variant="destructive"
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
