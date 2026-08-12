// ==============================================================================
// features/rfq/domain/entities/rfq-request.entity.ts
// RFQ Request, RFQ Item & Attachment Domain Entities following Clean Architecture
// ==============================================================================

export type RfqStatus = "new" | "assigned" | "quoted" | "won" | "lost" | "closed";

export interface RfqItemEntity {
  id?: string;
  rfqId?: string;
  itemType: "product" | "service";
  productId?: string | null;
  serviceId?: string | null;
  productName?: string | null;
  serviceName?: string | null;
  quantity: number;
  notes?: string | null;
  createdAt?: Date;
}

export interface CreateRfqItemInput {
  itemType: "product" | "service";
  productId?: string | null;
  serviceId?: string | null;
  quantity: number;
  notes?: string | null;
}

export interface RfqAttachmentEntity {
  id?: string;
  rfqId?: string;
  fileUrl: string;
  fileName: string;
  mimeType?: string | null;
  fileSizeKb?: number | null;
  createdAt?: Date;
}

export interface CreateRfqAttachmentInput {
  fileUrl: string;
  fileName: string;
  mimeType?: string | null;
  fileSizeKb?: number | null;
}

export interface CreateRfqInput {
  fullName: string;
  companyName?: string | null;
  phone: string;
  address: string;
  notes?: string | null;
  status?: RfqStatus;
  items?: CreateRfqItemInput[];
  attachments?: CreateRfqAttachmentInput[];
}

export interface RfqRequestProps {
  id: string;
  fullName: string;
  companyName: string | null;
  phone: string;
  address: string | null;
  notes: string | null;
  status: RfqStatus;
  createdAt: Date;
  updatedAt: Date;
  items?: RfqItemEntity[];
  attachments?: RfqAttachmentEntity[];
}

export class RfqRequestEntity {
  public readonly id: string;
  public readonly fullName: string;
  public readonly companyName: string | null;
  public readonly phone: string;
  public readonly address: string | null;
  public readonly notes: string | null;
  public readonly status: RfqStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly items: RfqItemEntity[];
  public readonly attachments: RfqAttachmentEntity[];

  constructor(props: RfqRequestProps) {
    this.id = props.id;
    this.fullName = props.fullName;
    this.companyName = props.companyName ?? null;
    this.phone = props.phone;
    this.address = props.address ?? null;
    this.notes = props.notes ?? null;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.items = props.items ?? [];
    this.attachments = props.attachments ?? [];
  }

  // Helper backward-compatibility getters for presentation layer display
  public get referenceNumber(): string {
    return `RFQ-${this.id.substring(0, 8).toUpperCase()}`;
  }

  public get contactName(): string {
    return this.fullName;
  }

  public get email(): string {
    return "";
  }

  public get isPending(): boolean {
    return this.status === "new";
  }

  public get hasAttachment(): boolean {
    return this.attachments.length > 0;
  }
}
