"use client";
// ==============================================================================
// features/about/presentation/components/certificates-manager.tsx
// About Module Certificates manager component with Search, Filter, Bulk Actions & Reordering
// ==============================================================================
import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, Award, Calendar, Building2 } from "lucide-react";
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
  useAboutCertificates,
  useCreateAboutCertificate,
  useUpdateAboutCertificate,
  useDeleteAboutCertificate,
  useReorderAboutCertificates,
  useBulkDeleteAboutCertificates,
  useBulkUpdateAboutCertificatesStatus,
} from "@shared/hooks/about/use-about-hooks";
import { CertificateDialog } from "@shared/dialogs/certificate-dialog";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";
import type { AboutCertificateEntity } from "../../domain/entities/about.entity";

export function CertificatesManager() {
  const { data: certs, isLoading, error, refetch } = useAboutCertificates();
  const createMutation = useCreateAboutCertificate();
  const updateMutation = useUpdateAboutCertificate();
  const deleteMutation = useDeleteAboutCertificate();
  const reorderMutation = useReorderAboutCertificates();
  const bulkDeleteMutation = useBulkDeleteAboutCertificates();
  const bulkStatusMutation = useBulkUpdateAboutCertificatesStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<AboutCertificateEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const filteredCerts = useMemo(() => {
    if (!certs) return [];
    return certs.filter((item) => {
      const matchesSearch =
        item.titleEn.toLowerCase().includes(search.toLowerCase()) ||
        item.titleAr.includes(search) ||
        (item.organization && item.organization.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [certs, search, statusFilter]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredCerts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCerts.map((c) => c.id));
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

  const handleOpenEdit = (cert: AboutCertificateEntity) => {
    setEditingCert(cert);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    if (editingCert) {
      await updateMutation.mutateAsync({
        id: editingCert.id,
        cert: values as Partial<AboutCertificateEntity>,
      });
    } else {
      await createMutation.mutateAsync(values as Omit<AboutCertificateEntity, "id" | "createdAt" | "updatedAt">);
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
    if (!certs) return;
    const newCerts = [...certs];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCerts.length) return;

    const [moved] = newCerts.splice(index, 1);
    newCerts.splice(targetIndex, 0, moved);

    await reorderMutation.mutateAsync(newCerts.map((c) => c.id));
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
      <ErrorState title="Failed to load certificates" error={error} onRetry={() => refetch()} />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Certificates & Accreditation Standards</CardTitle>
            <CardDescription>Official quality standards, compliance certifications, and organization credentials.</CardDescription>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> Add Certificate
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
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

          {filteredCerts.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No certificates found"
              description="Click the button above to upload quality certificates."
              action={<Button onClick={handleOpenCreate} size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Certificate</Button>}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.length === filteredCerts.length && filteredCerts.length > 0}
                    onCheckedChange={handleToggleSelectAll}
                  />
                  <span>Certificate Title</span>
                </div>
                <span>Actions</span>
              </div>

              {filteredCerts.map((cert, index) => {
                const isSelected = selectedIds.includes(cert.id);

                return (
                  <div
                    key={cert.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all gap-4 ${
                      isSelected ? "border-primary/50 bg-primary/5" : "bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox checked={isSelected} onCheckedChange={() => handleToggleSelect(cert.id)} />
                      <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted shrink-0 border flex items-center justify-center">
                        {cert.image ? (
                          <Image src={cert.image} alt={cert.titleEn} fill className="object-contain p-1" />
                        ) : (
                          <Award className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground truncate">{cert.titleEn}</span>
                          <Badge variant={cert.status === "active" ? "default" : "secondary"}>{cert.status}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {cert.organization && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" /> {cert.organization}
                            </span>
                          )}
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
                          disabled={index === filteredCerts.length - 1 || reorderMutation.isPending}
                          onClick={() => handleMove(index, "down")}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(cert)} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeletingId(cert.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <CertificateDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCert}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Certificate"
        description="Are you sure you want to delete this certificate?"
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmDialog
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Delete ${selectedIds.length} Certificates`}
        description={`Are you sure you want to delete ${selectedIds.length} selected certificates?`}
        confirmText="Delete All Selected"
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
