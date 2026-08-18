"use client";
// ==============================================================================
// features/vacation/presentation/components/admin/review-vacation-dialog.tsx
// Modal for approving or rejecting an employee vacation request with i18n
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
import { CheckCircle2, XCircle, Calendar, User, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { VacationRequestEntity } from "../../../domain/entities/vacation.entity";
import {
  useAdminReviewVacationRequest,
  useAdminEmployees,
} from "../../hooks/use-vacation";

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
  const t = useTranslations("vacation.review");
  const [reviewerNote, setReviewerNote] = useState("");
  const reviewMutation = useAdminReviewVacationRequest();
  const { data: employees = [] } = useAdminEmployees();

  if (!request) return null;

  const coveringColleague = request.alternativeEmployeeId
    ? employees.find((e) => e.id === request.alternativeEmployeeId)
    : null;

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
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Request summary card */}
          <div className="rounded-lg border bg-muted/20 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {request.employee?.fullName || t("employee")}
                </span>
              </div>
              <Badge variant="outline" className="font-normal text-xs">
                {request.vacationType?.name || t("leaveType")}
              </Badge>
            </div>

            {request.employee?.department && (
              <p className="text-xs text-muted-foreground">
                {request.employee.department}{" "}
                {request.employee.jobTitle && `• ${request.employee.jobTitle}`}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
              <div>
                <span className="text-muted-foreground block">{t("period")}:</span>
                <span className="font-medium text-foreground">
                  {request.fromDate} → {request.toDate}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">{t("duration")}:</span>
                <span className="font-medium text-foreground">
                  {request.requestedDays} {t("days")}
                </span>
              </div>
            </div>

            <div className="pt-1 text-xs">
              <span className="text-muted-foreground block">{t("returnToWork")}:</span>
              <span className="font-medium text-foreground">
                {request.returnToWorkDate}
              </span>
            </div>

            {coveringColleague && (
              <div className="pt-1 text-xs flex items-center gap-1.5 bg-background/50 p-2 rounded border">
                <UserCheck className="h-3.5 w-3.5 text-primary" />
                <div>
                  <span className="text-muted-foreground text-[11px] block">
                    {t("coveringColleague")}:
                  </span>
                  <span className="font-semibold text-foreground">
                    {coveringColleague.fullName}
                    {coveringColleague.department ? ` (${coveringColleague.department})` : ""}
                  </span>
                </div>
              </div>
            )}

            {request.note && (
              <div className="pt-2 border-t text-xs">
                <span className="text-muted-foreground block font-medium">
                  {t("employeeNote")}:
                </span>
                <p className="italic text-foreground mt-0.5">&quot;{request.note}&quot;</p>
              </div>
            )}

            <div className="pt-2 border-t flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t("currentStatus")}:</span>
              <Badge
                variant={
                  request.status === "approved"
                    ? "default"
                    : request.status === "rejected"
                    ? "destructive"
                    : "secondary"
                }
                className="capitalize text-[10px]"
              >
                {request.status}
              </Badge>
            </div>
          </div>

          {/* Optional Reviewer Note */}
          <div className="space-y-1.5">
            <Label htmlFor="reviewer-note" className="text-xs font-medium">
              {t("reviewerNote")}
            </Label>
            <Textarea
              id="reviewer-note"
              placeholder={t("reviewerNotePlaceholder")}
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              className="resize-none text-xs"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={reviewMutation.isPending}>
            {t("close")}
          </Button>

          <div className="flex items-center gap-2">
            {request.status !== "rejected" && (
              <Button
                variant="destructive"
                size="sm"
                className="gap-1 text-xs"
                disabled={reviewMutation.isPending}
                onClick={() => handleReview("rejected")}
              >
                <XCircle className="h-4 w-4" /> {t("reject")}
              </Button>
            )}
            {request.status !== "approved" && (
              <Button
                size="sm"
                className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={reviewMutation.isPending}
                onClick={() => handleReview("approved")}
              >
                <CheckCircle2 className="h-4 w-4" /> {t("approve")}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
