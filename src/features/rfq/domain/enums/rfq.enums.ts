// ==============================================================================
// features/rfq/domain/enums/rfq.enums.ts
// RFQ Status Enums & UI badge variants
// ==============================================================================
import type { RfqStatus } from "../entities/rfq-request.entity";

export enum RfqStatusEnum {
  New = "new",
  Assigned = "assigned",
  Quoted = "quoted",
  Won = "won",
  Lost = "lost",
  Closed = "closed",
}

export const RFQ_STATUS_LABELS: Record<RfqStatus, string> = {
  new: "New",
  assigned: "Assigned",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
  closed: "Closed",
};

export const RFQ_STATUS_VARIANTS: Record<RfqStatus, "default" | "secondary" | "outline" | "destructive"> = {
  new: "outline",
  assigned: "secondary",
  quoted: "default",
  won: "default",
  lost: "destructive",
  closed: "destructive",
};
