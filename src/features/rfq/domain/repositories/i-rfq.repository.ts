// ==============================================================================
// features/rfq/domain/repositories/i-rfq.repository.ts
// IRfqRepository Contract Interface
// ==============================================================================
import type { RfqRequestEntity, RfqStatus, CreateRfqInput } from "../entities/rfq-request.entity";

export interface RfqFilterParams {
  search?: string;
  status?: RfqStatus | "all";
  company?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "full_name" | "company_name" | "status";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedRfqRequests {
  items: RfqRequestEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SendEmailReplyInput {
  rfqId: string;
  toEmail: string;
  toName: string;
  subject: string;
  message: string;
}

export interface IRfqRepository {
  getRfqs(params?: RfqFilterParams): Promise<PaginatedRfqRequests>;
  getRfqById(id: string): Promise<RfqRequestEntity | null>;
  createRfq(input: CreateRfqInput): Promise<RfqRequestEntity>;
  uploadAttachment(file: File): Promise<{ fileUrl: string; fileName: string; mimeType: string; fileSizeKb: number }>;
  updateRfqStatus(id: string, status: RfqStatus, notes?: string): Promise<RfqRequestEntity>;
  deleteRfq(id: string): Promise<void>;
  bulkDeleteRfqs(ids: string[]): Promise<void>;
  bulkUpdateRfqStatus(ids: string[], status: RfqStatus): Promise<void>;
  sendEmailReply(input: SendEmailReplyInput): Promise<void>;
}
