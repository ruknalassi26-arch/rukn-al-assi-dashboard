"use client";
// ==============================================================================
// features/rfq/presentation/components/rfq-details-drawer.tsx
// RFQ Request Full Details Sheet Component with Items Display
// ==============================================================================
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  FileText,
  Phone,
  Building2,
  Calendar,
  Package,
  Wrench,
  User,
  MapPin,
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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@shared/ui";
import { useRfqStore } from "../stores/rfq.store";
import { useRfq, useUpdateRfqStatus } from "@shared/hooks/rfq/use-rfq-hooks";
import { RFQ_STATUS_LABELS, RFQ_STATUS_VARIANTS } from "../../domain/enums/rfq.enums";
import type { RfqStatus } from "../../domain/entities/rfq-request.entity";

export function RfqDetailsDrawer() {
  const tCommon = useTranslations("common");
  const {
    drawerOpen,
    selectedRfqId,
    closeDrawer,
  } = useRfqStore();

  const { data: rfq, isLoading } = useRfq(selectedRfqId ?? "");
  const updateStatusMutation = useUpdateRfqStatus();

  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (rfq) {
      setNotes(rfq.notes ?? "");
    }
  }, [rfq]);

  if (!selectedRfqId) return null;

  const handleStatusChange = async (newStatus: RfqStatus) => {
    if (!rfq) return;
    await updateStatusMutation.mutateAsync({ id: rfq.id, status: newStatus, notes });
  };

  const handleSaveNotes = async () => {
    if (!rfq) return;
    await updateStatusMutation.mutateAsync({ id: rfq.id, status: rfq.status, notes });
  };

  return (
    <Dialog open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <FileText className="h-5 w-5 text-primary" />
              <span>RFQ Details</span>
              {rfq && (
                <span className="text-xs font-mono font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  #{rfq.referenceNumber}
                </span>
              )}
            </div>
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
            {/* Status & Date Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border shadow-2xs">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Submitted Date
                </span>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  {rfq.createdAt.toLocaleDateString()} at {rfq.createdAt.toLocaleTimeString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Select
                  value={rfq.status}
                  onValueChange={(val) => handleStatusChange(val as RfqStatus)}
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {(["new", "assigned", "quoted", "won", "lost", "closed"] as RfqStatus[]).map((st) => (
                      <SelectItem key={st} value={st}>
                        {RFQ_STATUS_LABELS[st]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant={RFQ_STATUS_VARIANTS[rfq.status]}>
                  {RFQ_STATUS_LABELS[rfq.status]}
                </Badge>
              </div>
            </div>

            {/* Customer Information Grid */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary" /> Customer & Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border bg-background text-sm">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block">Full Name</span>
                  <span className="font-semibold text-foreground">{rfq.fullName}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block">Company Name</span>
                  <span className="font-semibold text-foreground">{rfq.companyName || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block">Phone</span>
                    <a href={`tel:${rfq.phone}`} className="text-primary underline font-medium">
                      {rfq.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block">Address</span>
                    <span>{rfq.address || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requested Products / Services Items Table */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                <Package className="h-4 w-4 text-primary" /> Requested Items ({rfq.items.length})
              </h4>

              {rfq.items.length === 0 ? (
                <div className="p-4 rounded-lg border bg-muted/20 text-center text-xs text-muted-foreground italic">
                  No specific product or service items attached to this RFQ request.
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="w-24">Type</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead className="w-20 text-center">Qty</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rfq.items.map((item, idx) => (
                        <TableRow key={item.id || idx}>
                          <TableCell>
                            <Badge variant="outline" className="capitalize text-xs font-medium gap-1">
                              {item.itemType === "product" ? (
                                <Package className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Wrench className="h-3 w-3 text-purple-500" />
                              )}
                              {item.itemType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-sm">
                            {item.productName || item.serviceName || "Custom Item"}
                          </TableCell>
                          <TableCell className="text-center font-mono font-bold text-sm">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {item.notes || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            <Separator />

            {/* Internal Notes */}
            <div className="space-y-2">
              <Label htmlFor="adminNotes" className="text-xs font-semibold uppercase text-muted-foreground">
                Internal Notes / Requirements
              </Label>
              <Textarea
                id="adminNotes"
                placeholder="Add internal notes about pricing, status, or customer communication..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs min-h-[80px]"
              />
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleSaveNotes}
                  disabled={updateStatusMutation.isPending}
                >
                  Save Notes
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
