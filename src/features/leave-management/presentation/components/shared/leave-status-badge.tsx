// ==============================================================================
// features/leave-management/presentation/components/shared/leave-status-badge.tsx
// Status badge component for leave requests
// ==============================================================================

import { Badge } from "@shared/ui";
import type { LeaveRequestStatus } from "../../../domain/enums/leave.enums";
import { Clock, CheckCircle2, XCircle, Ban } from "lucide-react";
import { useTranslations } from "next-intl";

interface LeaveStatusBadgeProps {
  status: LeaveRequestStatus | string;
  className?: string;
}

export function LeaveStatusBadge({ status, className }: LeaveStatusBadgeProps) {
  const t = useTranslations("common");
  const normalized = (status || "pending").toLowerCase() as LeaveRequestStatus;

  switch (normalized) {
    case "approved":
      return (
        <Badge
          variant="outline"
          className={`bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium inline-flex items-center gap-1.5 ${className || ""}`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span>{t("statusApproved", { fallback: "Approved" })}</span>
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className={`bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-medium inline-flex items-center gap-1.5 ${className || ""}`}
        >
          <XCircle className="h-3.5 w-3.5 text-rose-500" />
          <span>{t("statusRejected", { fallback: "Rejected" })}</span>
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className={`bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 font-medium inline-flex items-center gap-1.5 ${className || ""}`}
        >
          <Ban className="h-3.5 w-3.5 text-slate-500" />
          <span>{t("statusCancelled", { fallback: "Cancelled" })}</span>
        </Badge>
      );
    case "pending":
    default:
      return (
        <Badge
          variant="outline"
          className={`bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium inline-flex items-center gap-1.5 ${className || ""}`}
        >
          <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span>{t("pending", { fallback: "Pending" })}</span>
        </Badge>
      );
  }
}
