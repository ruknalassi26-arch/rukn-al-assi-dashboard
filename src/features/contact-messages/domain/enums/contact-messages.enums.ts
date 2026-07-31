// ==============================================================================
// features/contact-messages/domain/enums/contact-messages.enums.ts
// Contact Messages status labels & badge variants
// ==============================================================================
import type { ContactMessageStatus } from "../entities/contact-message.entity";

export enum ContactMessageStatusEnum {
  New = "new",
  Read = "read",
  Replied = "replied",
}

export const CONTACT_MESSAGE_STATUS_LABELS: Record<ContactMessageStatus, string> = {
  new: "New Message",
  read: "Read",
  replied: "Replied",
};

export const CONTACT_MESSAGE_STATUS_VARIANTS: Record<ContactMessageStatus, "default" | "secondary" | "outline" | "destructive"> = {
  new: "default",
  read: "secondary",
  replied: "outline",
};
