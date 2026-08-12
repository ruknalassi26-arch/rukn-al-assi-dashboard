// ==============================================================================
// features/rfq/data/repositories/supabase-rfq.repository.ts
// Supabase Data Repository Implementation for RFQ Requests Management
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IRfqRepository,
  RfqFilterParams,
  PaginatedRfqRequests,
  SendEmailReplyInput,
} from "../../domain/repositories/i-rfq.repository";
import { RfqRequestEntity } from "../../domain/entities/rfq-request.entity";
import type { RfqStatus, CreateRfqInput } from "../../domain/entities/rfq-request.entity";
import { toRfqRequestEntity } from "../mapper/rfq.mapper";

const RFQ_SELECT_QUERY = `
  *,
  rfq_items (
    *,
    products (
      id,
      sku,
      product_translations (
        language_code,
        name
      )
    ),
    services (
      id,
      service_translations (
        language_code,
        name
      )
    )
  ),
  rfq_attachments (*)
`;

export class SupabaseRfqRepository implements IRfqRepository {
  private get supabase() {
    return createClient();
  }

  private async logActivity(
    action: "created" | "updated" | "deleted",
    entityId: string | null,
    entityTitle: string | null,
    metadata?: Record<string, unknown>
  ) {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      await (this.supabase.from("activity_log" as any) as any).insert({
        action,
        entity_type: "rfq",
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async uploadAttachment(file: File): Promise<{ fileUrl: string; fileName: string; mimeType: string; fileSizeKb: number }> {
    const fileExt = file.name.split(".").pop() || "dat";
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filePath = `rfq_${timestamp}_${randomStr}.${fileExt}`;
    const fileSizeKb = Math.round(file.size / 1024);

    const { data, error } = await this.supabase.storage
      .from("rfq-attachments")
      .upload(filePath, file, { upsert: true });

    if (error) {
      throw new Error(`Failed to upload attachment: ${error.message}`);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from("rfq-attachments")
      .getPublicUrl(data.path);

    return {
      fileUrl: publicUrlData.publicUrl,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileSizeKb,
    };
  }

  async getRfqs(params?: RfqFilterParams): Promise<PaginatedRfqRequests> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;
    const sortBy = params?.sortBy ?? "created_at";
    const sortOrder = params?.sortOrder ?? "desc";

    let query = (this.supabase.from("rfq_requests" as any) as any)
      .select(RFQ_SELECT_QUERY, { count: "exact" });

    // Search filter
    if (params?.search && params.search.trim() !== "") {
      const searchStr = params.search.trim();
      query = query.or(
        `company_name.ilike.%${searchStr}%,full_name.ilike.%${searchStr}%,phone.ilike.%${searchStr}%,address.ilike.%${searchStr}%`
      );
    }

    // Status filter
    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    // Company filter
    if (params?.company && params.company.trim() !== "") {
      query = query.ilike("company_name", `%${params.company.trim()}%`);
    }

    // Date range filter
    if (params?.dateFrom) {
      query = query.gte("created_at", params.dateFrom);
    }
    if (params?.dateTo) {
      query = query.lte("created_at", params.dateTo);
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error || !data) {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }

    const items = (data as any[]).map(toRfqRequestEntity);
    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getRfqById(id: string): Promise<RfqRequestEntity | null> {
    const { data, error } = await (this.supabase.from("rfq_requests" as any) as any)
      .select(RFQ_SELECT_QUERY)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    const entity = toRfqRequestEntity(data as any);
    await this.logActivity("updated", entity.id, `Viewed RFQ for ${entity.fullName}`);
    return entity;
  }

  async createRfq(input: CreateRfqInput): Promise<RfqRequestEntity> {
    // 1. Save rfq_requests record first
    const payload = {
      full_name: input.fullName.trim(),
      company_name: input.companyName?.trim() || null,
      phone: input.phone.trim(),
      address: input.address.trim(),
      notes: input.notes?.trim() || null,
      status: input.status || "new",
    };

    const { data: createdRfq, error: rfqError } = await (this.supabase.from("rfq_requests" as any) as any)
      .insert(payload)
      .select("*")
      .single();

    if (rfqError || !createdRfq) {
      throw new Error(rfqError?.message ?? "Failed to create RFQ request");
    }

    // 2. Insert related rfq_items using returned rfq_id
    if (input.items && input.items.length > 0) {
      const itemPayloads = input.items.map((item) => ({
        rfq_id: createdRfq.id,
        item_type: item.itemType,
        product_id: item.itemType === "product" ? item.productId ?? null : null,
        service_id: item.itemType === "service" ? item.serviceId ?? null : null,
        quantity: item.quantity,
        notes: item.notes?.trim() || null,
      }));

      const { error: itemsError } = await (this.supabase.from("rfq_items" as any) as any)
        .insert(itemPayloads);

      if (itemsError) {
        console.error("Failed to insert RFQ items:", itemsError.message);
      }
    }

    // 3. Insert related rfq_attachments using returned rfq_id
    if (input.attachments && input.attachments.length > 0) {
      const attachmentPayloads = input.attachments.map((att) => ({
        rfq_id: createdRfq.id,
        file_url: att.fileUrl,
        file_name: att.fileName,
        mime_type: att.mimeType ?? null,
        file_size_kb: att.fileSizeKb ?? null,
      }));

      const { error: attachmentsError } = await (this.supabase.from("rfq_attachments" as any) as any)
        .insert(attachmentPayloads);

      if (attachmentsError) {
        console.error("Failed to insert RFQ attachments:", attachmentsError.message);
      }
    }

    await this.logActivity("created", createdRfq.id, `RFQ created for ${createdRfq.full_name}`);

    const fullEntity = await this.getRfqById(createdRfq.id);
    if (!fullEntity) {
      return toRfqRequestEntity(createdRfq);
    }
    return fullEntity;
  }

  async updateRfqStatus(id: string, status: RfqStatus, notes?: string): Promise<RfqRequestEntity> {
    const payload: { status: RfqStatus; updated_at: string; notes?: string } = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (notes !== undefined) payload.notes = notes;

    const { data, error } = await (this.supabase.from("rfq_requests" as any) as any)
      .update(payload)
      .eq("id", id)
      .select(RFQ_SELECT_QUERY)
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update RFQ status");

    const updated = toRfqRequestEntity(data as any);
    await this.logActivity("updated", updated.id, `Updated status to ${status} for RFQ of ${updated.fullName}`);
    return updated;
  }

  async deleteRfq(id: string): Promise<void> {
    const existing = await this.getRfqById(id);

    const { error } = await (this.supabase.from("rfq_requests" as any) as any)
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, `RFQ for ${existing?.fullName ?? id}`);
  }

  async bulkDeleteRfqs(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await (this.supabase.from("rfq_requests" as any) as any)
      .delete()
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("deleted", null, `${ids.length} RFQ requests`, { count: ids.length });
  }

  async bulkUpdateRfqStatus(ids: string[], status: RfqStatus): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await (this.supabase.from("rfq_requests" as any) as any)
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("updated", null, `Bulk updated RFQ status to ${status}`, { ids, status });
  }

  async sendEmailReply(input: SendEmailReplyInput): Promise<void> {
    const res = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      await this.logActivity("updated", input.rfqId, `Replied by email to ${input.toEmail}`, { subject: input.subject });
      return;
    }

    await this.logActivity("updated", input.rfqId, `Replied by email to ${input.toEmail}`, { subject: input.subject });
  }
}
