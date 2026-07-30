"use client";
// ==============================================================================
// features/about/presentation/components/team-manager.tsx
// Management Team section manager component with Search, Filter, Bulk Actions & Reordering
// ==============================================================================
import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, Users, User, Mail } from "lucide-react";
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
  useTeamMembers,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
  useReorderTeamMembers,
  useBulkDeleteTeamMembers,
  useBulkUpdateTeamMembersStatus,
} from "@shared/hooks/about/use-about-hooks";
import { TeamMemberDialog } from "@shared/dialogs/team-member-dialog";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";
import type { TeamMemberEntity } from "../../domain/entities/about.entity";

export function TeamManager() {
  const { data: team, isLoading, error, refetch } = useTeamMembers();
  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();
  const deleteMutation = useDeleteTeamMember();
  const reorderMutation = useReorderTeamMembers();
  const bulkDeleteMutation = useBulkDeleteTeamMembers();
  const bulkStatusMutation = useBulkUpdateTeamMembersStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const filteredTeam = useMemo(() => {
    if (!team) return [];
    return team.filter((item) => {
      const matchesSearch =
        item.fullNameEn.toLowerCase().includes(search.toLowerCase()) ||
        item.fullNameAr.includes(search) ||
        (item.positionEn && item.positionEn.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [team, search, statusFilter]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredTeam.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTeam.map((t) => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenCreate = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (member: TeamMemberEntity) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    if (editingMember) {
      await updateMutation.mutateAsync({
        id: editingMember.id,
        member: values as Partial<TeamMemberEntity>,
      });
    } else {
      await createMutation.mutateAsync(values as Omit<TeamMemberEntity, "id" | "createdAt" | "updatedAt">);
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
    if (!team) return;
    const newTeam = [...team];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTeam.length) return;

    const [moved] = newTeam.splice(index, 1);
    newTeam.splice(targetIndex, 0, moved);

    await reorderMutation.mutateAsync(newTeam.map((t) => t.id));
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
      <ErrorState title="Failed to load management team" error={error} onRetry={() => refetch()} />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Management Team</CardTitle>
            <CardDescription>Executive leaders, department heads, and engineering directors.</CardDescription>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> Add Team Member
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
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

          {filteredTeam.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No team members found"
              description="Click the button above to add leadership profile cards."
              action={<Button onClick={handleOpenCreate} size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Team Member</Button>}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.length === filteredTeam.length && filteredTeam.length > 0}
                    onCheckedChange={handleToggleSelectAll}
                  />
                  <span>Team Leader</span>
                </div>
                <span>Actions</span>
              </div>

              {filteredTeam.map((member, index) => {
                const isSelected = selectedIds.includes(member.id);

                return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all gap-4 ${
                      isSelected ? "border-primary/50 bg-primary/5" : "bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox checked={isSelected} onCheckedChange={() => handleToggleSelect(member.id)} />
                      <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted shrink-0 border flex items-center justify-center">
                        {member.photo ? (
                          <Image src={member.photo} alt={member.fullNameEn} fill className="object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground truncate">{member.fullNameEn}</span>
                          <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {member.positionEn && <span>{member.positionEn}</span>}
                          {member.positionEn && member.positionAr && <span>•</span>}
                          {member.positionAr && <span dir="rtl">{member.positionAr}</span>}
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
                          disabled={index === filteredTeam.length - 1 || reorderMutation.isPending}
                          onClick={() => handleMove(index, "down")}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(member)} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeletingId(member.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <TeamMemberDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingMember}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Team Member"
        description="Are you sure you want to delete this team member?"
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmDialog
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Delete ${selectedIds.length} Team Members`}
        description={`Are you sure you want to delete ${selectedIds.length} selected team members?`}
        confirmText="Delete All Selected"
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
