"use client";
// ==============================================================================
// features/rfq/presentation/components/rfq-details-drawer.tsx
// RFQ Request Full Details Sheet Component
// ==============================================================================
import React, { useState } from "react";
import {
  FileText,
  Mail,
  Phone,
  Building2,
  Globe,
  Calendar,
  Package,
  Paperclip,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
  Skeleton,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Label,
} from "@shared/ui";
import { useRfqStore } from "../stores/rfq.store";
import { useRfq, useUpdateRfqStatus } from "@shared/hooks/rfq/use-rfq-hooks";
import { RFQ_STATUS_LABELS, RFQ_STATUS_VARIANTS } from "../../domain/enums/rfq.enums";
import type { RfqStatus } from "../../domain/entities/rfq-request.entity";

export function RfqDetailsDrawer() {
  const {
    drawerOpen,
    selectedRfqId,
    closeDrawer,
    openEmailModal,
    openAttachmentViewer,
  } = useRfqStore();

  const { data: rfq, isLoading } = useRfq(selectedRfqId ?? "");
  const updateStatusMutation = useUpdateRfqStatus();

  const [notes, setNotes] = useState("");

  if (!selectedRfqId) return null;

  const handleStatusChange = async (newStatus: RfqStatus) => {
    if (!rfq) return;
    await updateStatusMutation.mutateAsync({ id: rfq.id, status: newStatus, notes });
  };

  return (
    <Dialog open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <FileText className="h-5 w-5 text-primary" />
              <span>RFQ Details #{rfq?.referenceNumber}</span>
            </div>

            {rfq && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => openEmailModal(rfq.id)}
                  className="gap-1.5"
                >
                  <Send className="h-4 w-4" /> Reply by Email
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : rfq ? (
          <div className="space-y-6 py-2">
            {/* Status & Reference Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 border">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Reference Number
                </span>
                <h3 className="text-xl font-mono font-bold text-primary">#{rfq.referenceNumber}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Received: {rfq.createdAt.toLocaleDateString()} at {rfq.createdAt.toLocaleTimeString()}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Current Status
                </span>
                <div className="flex items-center gap-2">
                  <Select
                    value={rfq.status}
                    onValueChange={(val) => handleStatusChange(val as RfqStatus)}
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">In Review</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant={RFQ_STATUS_VARIANTS[rfq.status]}>
                    {RFQ_STATUS_LABELS[rfq.status]}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Customer Information Grid */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-primary" /> Customer & Company Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border bg-background text-sm">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block">Company Name</span>
                  <span className="font-semibold text-foreground">{rfq.companyName}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block">Contact Person</span>
                  <span className="font-semibold text-foreground">{rfq.contactName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block">Email</span>
                    <a href={`mailto:${rfq.email}`} className="text-primary underline font-medium">
                      {rfq.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block">Phone</span>
                    <span>{rfq.phone ?? "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block">Country</span>
                    <span>{rfq.country ?? "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requested Products / Services */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                <Package className="h-4 w-4 text-primary" /> Requested Product / Service & Quantity
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg border bg-background text-sm">
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-xs font-semibold text-muted-foreground block">Product / Service Requested</span>
                  <span className="font-bold text-foreground text-base">{rfq.productName ?? "General Inquiry"}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block">Quantity / Units</span>
                  <span className="font-mono font-bold text-foreground">
                    {rfq.quantity ? `${rfq.quantity} ${rfq.unit ?? "units"}` : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Requirements & Description */}
            {rfq.requirements && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground">Technical Requirements / Specs</h4>
                <div className="p-4 rounded-lg border bg-muted/20 text-sm whitespace-pre-wrap leading-relaxed">
                  {rfq.requirements}
                </div>
              </div>
            )}

            {/* Attachments Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Paperclip className="h-3.5 w-3.5" /> Attachments
              </h4>
              {rfq.hasAttachment ? (
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Paperclip className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs font-mono truncate">{rfq.attachmentUrl}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openAttachmentViewer(rfq.attachmentUrl!)}
                    className="gap-1 text-xs shrink-0"
                  >
                    View Attachment
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No attachment provided with this request.</p>
              )}
            </div>

            <Separator />

            {/* Admin Notes */}
            <div className="space-y-2">
              <Label htmlFor="adminNotes" className="text-xs font-semibold uppercase text-muted-foreground">
                Internal Admin Notes
              </Label>
              <Textarea
                id="adminNotes"
                placeholder="Add internal notes about pricing, availability, or communication history..."
                value={notes || rfq.notes || ""}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs min-h-[70px]"
              />
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleStatusChange(rfq.status)}
                  disabled={updateStatusMutation.isPending}
                >
                  Save Internal Notes
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">RFQ request not found.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
