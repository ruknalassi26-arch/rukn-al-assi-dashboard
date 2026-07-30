"use client";
// ==============================================================================
// features/homepage/presentation/components/clients-section-manager.tsx
// Clients & Partners section manager with Search, Filter, Bulk Actions & Reordering
// ==============================================================================
import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, Building2, ExternalLink } from "lucide-react";
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
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  useReorderClients,
  useBulkDeleteClients,
  useBulkUpdateClientsStatus,
} from "@shared/hooks/homepage/use-homepage-hooks";
import { ClientDialog } from "@shared/dialogs/client-dialog";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";
import type { ClientEntity } from "../../domain/entities/homepage.entity";

export function ClientsSectionManager() {
  const { data: clients, isLoading, error, refetch } = useClients();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();
  const reorderMutation = useReorderClients();
  const bulkDeleteMutation = useBulkDeleteClients();
  const bulkStatusMutation = useBulkUpdateClientsStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    return clients.filter((item) => {
      const matchesSearch =
        item.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        item.nameAr.includes(search);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredClients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClients.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (client: ClientEntity) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    if (editingClient) {
      await updateMutation.mutateAsync({
        id: editingClient.id,
        client: values as Partial<ClientEntity>,
      });
    } else {
      await createMutation.mutateAsync(values as Omit<ClientEntity, "id" | "createdAt" | "updatedAt">);
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
    if (!clients) return;
    const newClients = [...clients];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newClients.length) return;

    const [moved] = newClients.splice(index, 1);
    newClients.splice(targetIndex, 0, moved);

    await reorderMutation.mutateAsync(newClients.map((c) => c.id));
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
        title="Failed to load client partners"
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
            <CardTitle>Clients & Partners</CardTitle>
            <CardDescription>
              Manage client logos, partner brands, and trust badges displayed on the homepage.
            </CardDescription>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> Add Client Partner
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-muted-foreground font-medium me-1">
                  {selectedIds.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatus("active")}
                  disabled={bulkStatusMutation.isPending}
                  className="text-xs"
                >
                  Set Active
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatus("draft")}
                  disabled={bulkStatusMutation.isPending}
                  className="text-xs"
                >
                  Set Draft
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsBulkDeleting(true)}
                  disabled={bulkDeleteMutation.isPending}
                  className="text-xs"
                >
                  Delete Selected
                </Button>
              </div>
            )}
          </div>

          {/* List */}
          {filteredClients.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No client partners found"
              description="Click the button above to add client brand logos."
              action={
                <Button onClick={handleOpenCreate} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" /> Add Client Partner
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.length === filteredClients.length && filteredClients.length > 0}
                    onCheckedChange={handleToggleSelectAll}
                  />
                  <span>Client Brand</span>
                </div>
                <span>Actions</span>
              </div>

              {filteredClients.map((client, index) => {
                const isSelected = selectedIds.includes(client.id);

                return (
                  <div
                    key={client.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all gap-4 ${
                      isSelected ? "border-primary/50 bg-primary/5" : "bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleSelect(client.id)}
                      />
                      <div className="relative h-12 w-20 rounded-md overflow-hidden bg-muted shrink-0 border flex items-center justify-center">
                        {client.logoUrl ? (
                          <Image
                            src={client.logoUrl}
                            alt={client.nameEn}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground truncate">
                            {client.nameEn}
                          </span>
                          <Badge variant={client.status === "active" ? "default" : "secondary"}>
                            {client.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span dir="rtl">{client.nameAr}</span>
                          {client.websiteUrl && (
                            <>
                              <span>•</span>
                              <a
                                href={client.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary flex items-center gap-0.5 hover:underline"
                              >
                                Website <ExternalLink className="h-3 w-3" />
                              </a>
                            </>
                          )}
                        </div>
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
                          disabled={index === filteredClients.length - 1 || reorderMutation.isPending}
                          onClick={() => handleMove(index, "down")}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(client)}
                        className="gap-1.5"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingId(client.id)}
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
      <ClientDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingClient}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Confirm Single Delete */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Client Partner"
        description="Are you sure you want to delete this client partner? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      {/* Confirm Bulk Delete */}
      <ConfirmDialog
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Delete ${selectedIds.length} Clients`}
        description={`Are you sure you want to delete ${selectedIds.length} selected client partners? This action cannot be undone.`}
        confirmText="Delete All Selected"
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
