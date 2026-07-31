// ==============================================================================
// features/contact-messages/domain/repositories/i-contact-messages.repository.ts
// IContactMessagesRepository Contract Interface
// ==============================================================================
import type { ContactMessageEntity, ContactMessageStatus } from "../entities/contact-message.entity";

export interface ContactMessageFilterParams {
  search?: string;
  status?: ContactMessageStatus | "all";
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "name" | "status";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedContactMessages {
  items: ContactMessageEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SendMessageReplyInput {
  messageId: string;
  toEmail: string;
  toName: string;
  subject: string;
  message: string;
}

export interface IContactMessagesRepository {
  getContactMessages(params?: ContactMessageFilterParams): Promise<PaginatedContactMessages>;
  getContactMessageById(id: string): Promise<ContactMessageEntity | null>;
  updateMessageStatus(id: string, status: ContactMessageStatus, notes?: string): Promise<ContactMessageEntity>;
  deleteContactMessage(id: string): Promise<void>;
  bulkDeleteContactMessages(ids: string[]): Promise<void>;
  bulkUpdateMessageStatus(ids: string[], status: ContactMessageStatus): Promise<void>;
  sendMessageReply(input: SendMessageReplyInput): Promise<void>;
}
