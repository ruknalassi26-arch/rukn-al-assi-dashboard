// ==============================================================================
// features/contact-messages/domain/entities/contact-message.entity.ts
// Contact Message Domain Entity Class
// ==============================================================================

export type ContactMessageStatus = "new" | "read" | "replied";

export interface ContactMessageProps {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: ContactMessageStatus;
  attachmentUrl?: string | null;
  notes?: string | null;
  createdAt: Date;
}

export class ContactMessageEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly phone: string | null;
  public readonly subject: string | null;
  public readonly message: string;
  public readonly status: ContactMessageStatus;
  public readonly attachmentUrl: string | null;
  public readonly notes: string | null;
  public readonly createdAt: Date;

  constructor(props: ContactMessageProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.subject = props.subject;
    this.message = props.message;
    this.status = props.status;
    this.attachmentUrl = props.attachmentUrl ?? null;
    this.notes = props.notes ?? null;
    this.createdAt = props.createdAt;
  }

  public get isNew(): boolean {
    return this.status === "new";
  }

  public get hasAttachment(): boolean {
    return !!this.attachmentUrl && this.attachmentUrl.trim().length > 0;
  }
}
