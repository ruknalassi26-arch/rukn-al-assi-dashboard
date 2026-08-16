"use client";
// ==============================================================================
// features/leave-management/presentation/components/admin/admin-review-modal.tsx
// Review dialog for approving or rejecting an employee leave request
// ==============================================================================

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Label,
  Textarea,
  Badge,
} from "@shared/ui";
import { CheckCircle2, XCircle, Loader2, ShieldCheck, User, Calendar, Clock } from "lucide-react";
import type { LeaveRequestEntity } from "../../../domain/entities";
import { useAdminReviewLeaveRequest } from "../../hooks/use-leave";

interface AdminReviewModalProps {
  request: LeaveRequestEntity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminReviewModal({ request, isOpen, onClose }: AdminReviewModalProps) {
  const reviewMutation = useAdminReviewLeaveRequest();

  const [decision, setDecision] = useState<"approved" | "rejected">("approved");
  const [reviewerNote, setReviewerNote] = useState("");

  if (!request) return null;

  const durationText =
    request.requestUnit === "hour"
      ? `${request.requestedHours ?? 0} Hours`
      : `${request.requestedDays ?? 0} Days`;

  const handleSubmit = async () => {
    await reviewMutation.mutateAsync({
      requestId: request.id,
      decision,
      reviewerNote: reviewerNote.trim() || null,
    });
    setReviewerNote("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Review Leave Application
          </DialogTitle>
          <DialogDescription>
            Approve or reject this leave request submitted by {request.employee?.fullName || "Employee"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Request details summary box */}
          <div className="p-4 rounded-xl bg-muted/40 border space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {request.employee?.fullName || "Employee"}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {request.employee?.department || "General"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-muted-foreground">Leave Type:</span>{" "}
                <strong className="text-foreground">{request.leaveType?.name || "Leave"}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>{" "}
                <strong className="text-foreground font-mono">{durationText}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">From Date:</span>{" "}
                <span className="font-mono text-foreground">{request.fromDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground">To Date:</span>{" "}
                <span className="font-mono text-foreground">{request.toDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Return to Work:</span>{" "}
                <span className="font-mono text-foreground">{request.returnToWorkDate || "—"}</span>
              </div>
              {request.alternativeEmployee && (
                <div>
                  <span className="text-muted-foreground">Covering Colleague:</span>{" "}
                  <span className="text-foreground font-medium">{request.alternativeEmployee.fullName}</span>
                </div>
              )}
            </div>

            {request.note && (
              <div className="pt-2 border-t text-xs">
                <span className="text-muted-foreground block mb-0.5 font-medium">Employee Note:</span>
                <p className="italic text-foreground bg-background/60 p-2 rounded-md">
                  &ldquo;{request.note}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Decision Selector */}
          <div className="space-y-2">
            <Label className="font-semibold text-xs">Decision</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision("approved")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  decision === "approved"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20 shadow-xs"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Approve Request
              </button>

              <button
                type="button"
                onClick={() => setDecision("rejected")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  decision === "rejected"
                    ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/20 shadow-xs"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                <XCircle className="h-4 w-4 text-rose-500" />
                Reject Request
              </button>
            </div>
          </div>

          {/* Optional Reviewer Note */}
          <div className="space-y-1.5">
            <Label htmlFor="reviewerNote" className="font-semibold text-xs">
              Reviewer Feedback / Note (Optional)
            </Label>
            <Textarea
              id="reviewerNote"
              rows={2}
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              placeholder="Add internal feedback or reason for this decision..."
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose} disabled={reviewMutation.isPending}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={reviewMutation.isPending}
            className={`gap-2 ${
              decision === "approved"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-rose-600 hover:bg-rose-700 text-white"
            }`}
          >
            {reviewMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : decision === "approved" ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Confirm Approval
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Confirm Rejection
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
