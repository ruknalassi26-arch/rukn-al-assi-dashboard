// ==============================================================================
// features/vacation/presentation/components/admin/review-vacation-dialog.tsx
// Modal for approving or rejecting an employee vacation request
// ==============================================================================

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Textarea,
  Label,
  Badge,
} from "@shared/ui";
import { CheckCircle2, XCircle, Calendar, User, Clock } from "lucide-react";
import type { VacationRequestEntity } from "../../../domain/entities/vacation.entity";
import { useAdminReviewVacationRequest } from "../../hooks/use-vacation";

interface ReviewVacationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: VacationRequestEntity | null;
}

export function ReviewVacationDialog({
  isOpen,
  onClose,
  request,
}: ReviewVacationDialogProps) {
  const [reviewerNote, setReviewerNote] = useState("");
  const reviewMutation = useAdminReviewVacationRequest();

  if (!request) return null;

  const handleReview = async (decision: "approved" | "rejected") => {
    try {
      await reviewMutation.mutateAsync({
        requestId: request.id,
        decision,
        reviewerNote: reviewerNote.trim() || undefined,
      });
      setReviewerNote("");
      onClose();
    } catch {
      // Error handled in hook toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Review Vacation Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Request summary card */}
          <div className="rounded-lg border bg-muted/20 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {request.employee?.fullName || "Employee"}
                </span>
              </div>
              <Badge variant="outline" className="font-normal text-xs">
                {request.vacationType?.name || "Vacation"}
              </Badge>
            </div>

            {request.employee?.department && (
              <p className="text-xs text-muted-foreground">
                Dept: {request.employee.department}{" "}
                {request.employee.jobTitle && `• ${request.employee.jobTitle}`}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
              <div>
                <span className="text-muted-foreground block">Period:</span>
                <span className="font-medium text-foreground">
                  {request.fromDate} → {request.toDate}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Duration:</span>
                <span className="font-medium text-foreground">
                  {request.requestedDays} Days
                </span>
              </div>
            </div>

            <div className="pt-1 text-xs">
              <span className="text-muted-foreground block">Return to work:</span>
              <span className="font-medium text-foreground">
                {request.returnToWorkDate}
              </span>
            </div>

            {request.note && (
              <div className="pt-2 border-t text-xs">
                <span className="text-muted-foreground block font-medium">
                  Employee Note:
                </span>
                <p className="italic text-foreground mt-0.5">&quot;{request.note}&quot;</p>
              </div>
            )}
          </div>

          {/* Optional Reviewer Note */}
          <div className="space-y-1.5">
            <Label htmlFor="reviewer-note" className="text-xs font-medium">
              Reviewer Note / Feedback (Optional)
            </Label>
            <Textarea
              id="reviewer-note"
              placeholder="e.g. Approved as discussed with team lead..."
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              className="resize-none text-xs"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={reviewMutation.isPending}>
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              className="gap-1 text-xs"
              disabled={reviewMutation.isPending}
              onClick={() => handleReview("rejected")}
            >
              <XCircle className="h-4 w-4" /> Reject
            </Button>
            <Button
              size="sm"
              className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={reviewMutation.isPending}
              onClick={() => handleReview("approved")}
            >
              <CheckCircle2 className="h-4 w-4" /> Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
