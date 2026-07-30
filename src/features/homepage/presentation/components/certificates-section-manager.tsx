"use client";
// ==============================================================================
// features/homepage/presentation/components/certificates-section-manager.tsx
// Certificates section manager with Search, Filter, Bulk Actions & Reordering
// ==============================================================================
import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, Award, Calendar } from "lucide-react";
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
  useCertificates,
  useCreateCertificate,
  useUpdateCertificate,
  useDeleteCertificate,
  useReorderCertificates,
  useBulkDeleteCertificates,
  useBulkUpdateCertificatesStatus,
} from "@shared/hooks/homepage/use-homepage-hooks";
import { CertificateDialog } from "@shared/dialogs/certificate-dialog";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";
import type { CertificateEntity } from "../../domain/entities/homepage.entity";

export function CertificatesSectionManager() {
  const { data: certificates, isLoading, error, refetch } = useCertificates();
  const createMutation = useCreateCertificate();
  const updateMutation = useUpdateCertificate();
  const deleteMutation = useDeleteCertificate();
  const reorderMutation = useReorderCertificates();
  const bulkDeleteMutation = useBulkDeleteCertificates();
  const bulkStatusMutation = useBulkUpdateCertificatesStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const filteredCertificates = useMemo(() => {
    if (!certificates) return [];
    return certificates.filter((item) => {
      const matchesSearch =
        item.titleEn.toLowerCase().includes(search.toLowerCase()) ||
        item.titleAr.includes(search);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [certificates, search, statusFilter]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredCertificates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCertificates.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenCreate = () => {
    setEditingCert(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cert: CertificateEntity) => {
    setEditingCert(cert);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    if (editingCert) {
      await updateMutation.mutateAsync({
        id: editingCert.id,
        certificate: values as Partial<CertificateEntity>,
      });
    } else {
      await createMutation.mutateAsync(values as Omit<CertificateEntity, "id" | "createdAt" | "updatedAt">);
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
    if (!certificates) return;
    const newCerts = [...certificates];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCerts.length) return;

    const [moved] = newCerts.splice(index, 1);
    newCerts.splice(targetIndex, 0, moved);

    await reorderMutation.mutateAsync(newCerts.map((c) => c.id));
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
        title="Failed to load certificates"
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
            <CardTitle>Certifications & Quality Badges</CardTitle>
            <CardDescription>
              Manage ISO quality certifications, industry accreditations, and safety standards displayed on the homepage.
            </CardDescription>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> Add Certificate
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search certificates..."
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
          {filteredCertificates.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No certificates found"
              description="Click the button above to upload quality certificates."
              action={
                <Button onClick={handleOpenCreate} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" /> Add Certificate
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.length === filteredCertificates.length && filteredCertificates.length > 0}
                    onCheckedChange={handleToggleSelectAll}
                  />
                  <span>Certificate / Badge</span>
                </div>
                <span>Actions</span>
              </div>

              {filteredCertificates.map((cert, index) => {
                const isSelected = selectedIds.includes(cert.id);

                return (
                  <div
                    key={cert.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all gap-4 ${
                      isSelected ? "border-primary/50 bg-primary/5" : "bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleSelect(cert.id)}
                      />
                      <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted shrink-0 border flex items-center justify-center">
                        {cert.image ? (
                          <Image
                            src={cert.image}
                            alt={cert.titleEn}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <Award className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground truncate">
                            {cert.titleEn}
                          </span>
                          <Badge variant={cert.status === "active" ? "default" : "secondary"}>
                            {cert.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span dir="rtl">{cert.titleAr}</span>
                          {cert.issueDate && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {cert.issueDate}
                              </span>
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
                          disabled={index === filteredCertificates.length - 1 || reorderMutation.isPending}
                          onClick={() => handleMove(index, "down")}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(cert)}
                        className="gap-1.5"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingId(cert.id)}
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
      <CertificateDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCert}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Confirm Single Delete */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Certificate"
        description="Are you sure you want to delete this certificate? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      {/* Confirm Bulk Delete */}
      <ConfirmDialog
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Delete ${selectedIds.length} Certificates`}
        description={`Are you sure you want to delete ${selectedIds.length} selected certificates? This action cannot be undone.`}
        confirmText="Delete All Selected"
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
