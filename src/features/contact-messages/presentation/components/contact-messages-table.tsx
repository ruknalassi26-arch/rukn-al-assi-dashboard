"use client";
// ==============================================================================
// features/contact-messages/presentation/components/contact-messages-table.tsx
// Modern Enterprise Data Table for Customer Contact Messages Inbox with CSV Export
// ==============================================================================
import React, { useState } from "react";
import {
  Mail,
  Search,
  RefreshCw,
  Trash2,
  Eye,
  MoreVertical,
  ArrowUpDown,
  Download,
  Calendar,
  User,
  MessageSquare,
  CheckCircle2,
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
import { useContactMessagesStore } from "../stores/contact-messages.store";
import {
  useContactMessages,
  useDeleteContactMessage,
  useBulkDeleteContactMessages,
  useBulkUpdateMessageStatus,
} from "@shared/hooks/contact-messages/use-contact-messages-hooks";
import { CONTACT_MESSAGE_STATUS_LABELS, CONTACT_MESSAGE_STATUS_VARIANTS } from "../../domain/enums/contact-messages.enums";
import type { ContactMessageEntity, ContactMessageStatus } from "../../domain/entities/contact-message.entity";

export function ContactMessagesTable() {
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
    openEmailModal,
  } = useContactMessagesStore();

  const { data, isLoading, error, refetch, isFetching } = useContactMessages({
    search,
    status,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const deleteMessageMutation = useDeleteContactMessage();
  const bulkDeleteMutation = useBulkDeleteContactMessages();
  const bulkUpdateStatusMutation = useBulkUpdateMessageStatus();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const messages = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const isAllSelected = messages.length > 0 && messages.every((m) => selectedIds.includes(m.id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      setSelectedIds(messages.map((m) => m.id));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteMessageMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    await bulkDeleteMutation.mutateAsync(selectedIds);
    clearSelection();
    setIsBulkDeleteOpen(false);
  };

  const handleBulkStatusChange = async (newStatus: ContactMessageStatus) => {
    if (selectedIds.length === 0) return;
    await bulkUpdateStatusMutation.mutateAsync({ ids: selectedIds, status: newStatus });
    clearSelection();
  };

  const handleSortToggle = (column: "created_at" | "name" | "status") => {
    if (sortBy === column) {
      setSorting(column, sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSorting(column, "asc");
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (messages.length === 0) return;

    const headers = ["Message ID", "Customer Name", "Email", "Phone", "Subject", "Message Preview", "Status", "Date"];
    const rows = messages.map((m) => [
      `"${m.id}"`,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.email}"`,
      `"${m.phone ?? ""}"`,
      `"${(m.subject ?? "").replace(/"/g, '""')}"`,
      `"${m.message.slice(0, 100).replace(/"/g, '""')}"`,
      `"${m.status}"`,
      `"${m.createdAt.toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `contact-messages-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border shadow-xs">
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b bg-muted/20 pb-4">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Customer Contact Messages Inbox
          </CardTitle>
          <CardDescription>
            View messages submitted from the public website Contact form, reply by email, and manage statuses.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={messages.length === 0} className="gap-1.5">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-1.5">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border bg-primary/5 p-3 text-sm">
            <span className="font-semibold text-primary">
              {selectedIds.length} message{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("read")}>
                Mark as Read
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("replied")}>
                Mark as Replied
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sender name, email, subject, text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Status Filter */}
            <Select value={status} onValueChange={(val) => setStatus(val as any)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error ? (
          <ErrorState
            title="Failed to load contact messages"
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
                  <TableHead className="cursor-pointer" onClick={() => handleSortToggle("name")}>
                    <div className="flex items-center gap-1">
                      <span>Customer Name</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>Email & Phone</TableHead>
                  <TableHead>Subject & Preview</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortToggle("created_at")}>
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortToggle("status")}>
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-end"><Skeleton className="h-8 w-8 ms-auto rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <EmptyState
                        icon={Mail}
                        title="No contact messages found"
                        description="There are currently no customer contact form submissions matching your criteria."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((msg: ContactMessageEntity) => {
                    const isSelected = selectedIds.includes(msg.id);
                    return (
                      <TableRow key={msg.id} className={isSelected ? "bg-primary/5" : msg.isNew ? "bg-blue-50/40 font-medium hover:bg-blue-50/70" : "hover:bg-muted/30"}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectId(msg.id)}
                          />
                        </TableCell>

                        {/* Customer Name */}
                        <TableCell className="font-semibold text-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{msg.name}</span>
                          </div>
                        </TableCell>

                        {/* Email & Phone */}
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="space-y-0.5">
                            <div>{msg.email}</div>
                            {msg.phone && <div className="text-[11px] font-mono">{msg.phone}</div>}
                          </div>
                        </TableCell>

                        {/* Subject & Preview */}
                        <TableCell className="text-sm">
                          <div className="font-medium text-foreground truncate max-w-[200px]">
                            {msg.subject ?? "General Inquiry"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[240px]">
                            {msg.message}
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{msg.createdAt.toLocaleDateString()}</span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge variant={CONTACT_MESSAGE_STATUS_VARIANTS[msg.status]}>
                            {CONTACT_MESSAGE_STATUS_LABELS[msg.status]}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openDrawer(msg.id)}>
                                <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Message
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEmailModal(msg.id)}>
                                <Mail className="mr-2 h-4 w-4 text-emerald-500" /> Reply via Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(msg.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Showing page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span> ({total} total messages)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Contact Message?"
        description="Are you sure you want to delete this customer message? This action cannot be undone."
        confirmText="Delete Message"
        variant="destructive"
        isLoading={deleteMessageMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        title={`Delete ${selectedIds.length} Selected Messages?`}
        description="Are you sure you want to delete all selected messages? This action cannot be undone."
        confirmText="Delete Messages"
        variant="destructive"
        isLoading={bulkDeleteMutation.isPending}
        onConfirm={handleBulkDeleteConfirm}
      />
    </Card>
  );
}
