"use client";
// ==============================================================================
// features/contact-messages/presentation/components/message-details-drawer.tsx
// Customer Contact Message Details Sheet Component
// ==============================================================================
import React, { useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Send,
  User,
  Paperclip,
  MessageSquare,
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
import { useContactMessagesStore } from "../stores/contact-messages.store";
import { useContactMessage, useUpdateMessageStatus } from "@shared/hooks/contact-messages/use-contact-messages-hooks";
import { CONTACT_MESSAGE_STATUS_LABELS, CONTACT_MESSAGE_STATUS_VARIANTS } from "../../domain/enums/contact-messages.enums";
import type { ContactMessageStatus } from "../../domain/entities/contact-message.entity";

export function MessageDetailsDrawer() {
  const {
    drawerOpen,
    selectedMessageId,
    closeDrawer,
    openEmailModal,
  } = useContactMessagesStore();

  const { data: msg, isLoading } = useContactMessage(selectedMessageId ?? "");
  const updateStatusMutation = useUpdateMessageStatus();

  const [notes, setNotes] = useState("");

  if (!selectedMessageId) return null;

  const handleStatusChange = async (newStatus: ContactMessageStatus) => {
    if (!msg) return;
    await updateStatusMutation.mutateAsync({ id: msg.id, status: newStatus, notes });
  };

  return (
    <Dialog open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <Mail className="h-5 w-5 text-primary" />
              <span>Customer Message Details</span>
            </div>

            {msg && (
              <Button
                size="sm"
                onClick={() => openEmailModal(msg.id)}
                className="gap-1.5"
              >
                <Send className="h-4 w-4" /> Reply by Email
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : msg ? (
          <div className="space-y-6 py-2">
            {/* Status & Date Header */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Submitted On
                </span>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  {msg.createdAt.toLocaleDateString()} at {msg.createdAt.toLocaleTimeString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={msg.status}
                  onValueChange={(val) => handleStatusChange(val as ContactMessageStatus)}
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant={CONTACT_MESSAGE_STATUS_VARIANTS[msg.status]}>
                  {CONTACT_MESSAGE_STATUS_LABELS[msg.status]}
                </Badge>
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary" /> Sender Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border bg-background text-sm">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block">Customer Name</span>
                  <span className="font-bold text-foreground">{msg.name}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block">Email Address</span>
                  <a href={`mailto:${msg.email}`} className="text-primary underline font-medium">
                    {msg.email}
                  </a>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-xs font-semibold text-muted-foreground block">Phone Number</span>
                  <span>{msg.phone ?? "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Message Subject & Body */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-primary" /> Subject: {msg.subject ?? "General Inquiry"}
              </h4>
              <div className="p-4 rounded-lg border bg-muted/20 text-sm whitespace-pre-wrap leading-relaxed font-sans">
                {msg.message}
              </div>
            </div>

            {/* Attachment */}
            {msg.hasAttachment && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                  <Paperclip className="h-3.5 w-3.5" /> Attached File
                </h4>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                  <span className="text-xs font-mono truncate">{msg.attachmentUrl}</span>
                  <a href={msg.attachmentUrl!} target="_blank" rel="noopener noreferrer" download>
                    <Button size="sm" variant="outline" className="text-xs">
                      Download File
                    </Button>
                  </a>
                </div>
              </div>
            )}

            <Separator />

            {/* Admin Internal Notes */}
            <div className="space-y-2">
              <Label htmlFor="internalNotes" className="text-xs font-semibold uppercase text-muted-foreground">
                Internal Admin Notes
              </Label>
              <Textarea
                id="internalNotes"
                placeholder="Add internal notes about this inquiry or communication history..."
                value={notes || msg.notes || ""}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs min-h-[70px]"
              />
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleStatusChange(msg.status)}
                  disabled={updateStatusMutation.isPending}
                >
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">Contact message not found.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
