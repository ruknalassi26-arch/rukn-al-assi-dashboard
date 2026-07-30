"use client";
// ==============================================================================
// features/about/presentation/components/core-values-manager.tsx
// Core Values Manager with Search, Filter, Bulk Actions & Reordering
// ==============================================================================
import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, ShieldCheck, Award, Zap, Users, Heart, CheckCircle } from "lucide-react";
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
import { ValueDialog } from "@shared/dialogs/value-dialog";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";
import type { CoreValueEntity } from "../../domain/entities/about.entity";

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  Award,
  Zap,
  Users,
  Heart,
  CheckCircle,
};

export function CoreValuesManager() {
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
      const matchesSearch =
        item.titleEn.toLowerCase().includes(search.toLowerCase()) ||
        item.titleAr.includes(search);
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

  const handleOpenEdit = (val: CoreValueEntity) => {
    setEditingValue(val);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formValues: Record<string, unknown>) => {
    if (editingValue) {
      await updateMutation.mutateAsync({
        id: editingValue.id,
        value: formValues as Partial<CoreValueEntity>,
      });
    } else {
      await createMutation.mutateAsync(formValues as Omit<CoreValueEntity, "id" | "createdAt" | "updatedAt">);
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
    if (selectedIds.length === 0) return;
    await bulkStatusMutation.mutateAsync({ ids: selectedIds, status });
    setSelectedIds([]);
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
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState title="Failed to load core values" error={error} onRetry={() => refetch()} />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Core Values</CardTitle>
            <CardDescription>Define organization principles, culture pillar cards, and corporate ethics.</CardDescription>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> Add Core Value
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search values..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-muted-foreground font-medium me-1">{selectedIds.length} selected</span>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus("active")} className="text-xs">Set Active</Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus("draft")} className="text-xs">Set Draft</Button>
                <Button variant="destructive" size="sm" onClick={() => setIsBulkDeleting(true)} className="text-xs">Delete Selected</Button>
              </div>
            )}
          </div>

          {filteredValues.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No core values found"
              description="Click the button above to add company core values."
              action={<Button onClick={handleOpenCreate} size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Core Value</Button>}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.length === filteredValues.length && filteredValues.length > 0}
                    onCheckedChange={handleToggleSelectAll}
                  />
                  <span>Core Value Title</span>
                </div>
                <span>Actions</span>
              </div>

              {filteredValues.map((val, index) => {
                const IconComponent = (val.icon && ICON_MAP[val.icon]) || ShieldCheck;
                const isSelected = selectedIds.includes(val.id);

                return (
                  <div
                    key={val.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all gap-4 ${
                      isSelected ? "border-primary/50 bg-primary/5" : "bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox checked={isSelected} onCheckedChange={() => handleToggleSelect(val.id)} />
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground truncate">{val.titleEn}</span>
                          <Badge variant={val.status === "active" ? "default" : "secondary"}>{val.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate" dir="rtl">{val.titleAr}</p>
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
                          disabled={index === filteredValues.length - 1 || reorderMutation.isPending}
                          onClick={() => handleMove(index, "down")}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(val)} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeletingId(val.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ValueDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingValue}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Core Value"
        description="Are you sure you want to delete this core value?"
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmDialog
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Delete ${selectedIds.length} Core Values`}
        description={`Are you sure you want to delete ${selectedIds.length} selected core values?`}
        confirmText="Delete All Selected"
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
