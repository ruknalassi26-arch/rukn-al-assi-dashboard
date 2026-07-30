// ==============================================================================
// features/rfq/domain/enums/rfq.enums.ts
// RFQ Status Enums & UI badge variants
// ==============================================================================
import type { RfqStatus } from "../entities/rfq-request.entity";

export enum RfqStatusEnum {
  Pending = "pending",
  Reviewed = "reviewed",
  Quoted = "quoted",
  Closed = "closed",
}

export const RFQ_STATUS_LABELS: Record<RfqStatus, string> = {
  pending: "Pending",
  reviewed: "In Review",
  quoted: "Quoted",
  closed: "Closed",
};

export const RFQ_STATUS_VARIANTS: Record<RfqStatus, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  reviewed: "secondary",
  quoted: "default",
  closed: "destructive",
};
