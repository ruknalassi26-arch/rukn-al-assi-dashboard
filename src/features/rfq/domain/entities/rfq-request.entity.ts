// ==============================================================================
// features/rfq/domain/entities/rfq-request.entity.ts
// RFQ Request Domain Entity Class following Clean Architecture
// ==============================================================================

export type RfqStatus = "pending" | "reviewed" | "quoted" | "closed";

export interface RfqRequestProps {
  id: string;
  referenceNumber: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  country: string | null;
  productId: string | null;
  productName: string | null;
  quantity: number | null;
  unit: string | null;
  requirements: string | null;
  attachmentUrl: string | null;
  status: RfqStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class RfqRequestEntity {
  public readonly id: string;
  public readonly referenceNumber: string;
  public readonly companyName: string;
  public readonly contactName: string;
  public readonly email: string;
  public readonly phone: string | null;
  public readonly country: string | null;
  public readonly productId: string | null;
  public readonly productName: string | null;
  public readonly quantity: number | null;
  public readonly unit: string | null;
  public readonly requirements: string | null;
  public readonly attachmentUrl: string | null;
  public readonly status: RfqStatus;
  public readonly notes: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: RfqRequestProps) {
    this.id = props.id;
    this.referenceNumber = props.referenceNumber;
    this.companyName = props.companyName;
    this.contactName = props.contactName;
    this.email = props.email;
    this.phone = props.phone;
    this.country = props.country;
    this.productId = props.productId;
    this.productName = props.productName;
    this.quantity = props.quantity;
    this.unit = props.unit;
    this.requirements = props.requirements;
    this.attachmentUrl = props.attachmentUrl;
    this.status = props.status;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public get isPending(): boolean {
    return this.status === "pending";
  }

  public get hasAttachment(): boolean {
    return !!this.attachmentUrl && this.attachmentUrl.trim().length > 0;
  }
}
