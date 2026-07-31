// ==============================================================================
// features/contact-messages/data/repositories/supabase-contact-messages.repository.ts
// Supabase Data Repository Implementation for Customer Contact Messages Inbox
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IContactMessagesRepository,
  ContactMessageFilterParams,
  PaginatedContactMessages,
  SendMessageReplyInput,
} from "../../domain/repositories/i-contact-messages.repository";
import { ContactMessageEntity } from "../../domain/entities/contact-message.entity";
import type { ContactMessageStatus } from "../../domain/entities/contact-message.entity";
import { toContactMessageEntity } from "../mapper/contact-message.mapper";
import type { ContactMessageDTO } from "../dto/contact-message.dto";

export class SupabaseContactMessagesRepository implements IContactMessagesRepository {
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
      await this.supabase.from("activity_logs").insert({
        action,
        entity_type: "contact",
        entity_id: entityId,
        entity_title: entityTitle,
        user_id: userData.user?.id ?? null,
        user_email: userData.user?.email ?? null,
        metadata: metadata ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getContactMessages(params?: ContactMessageFilterParams): Promise<PaginatedContactMessages> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;
    const sortBy = params?.sortBy ?? "created_at";
    const sortOrder = params?.sortOrder ?? "desc";

    let query = this.supabase
      .from("contact_submissions")
      .select("*", { count: "exact" });

    // Search filter
    if (params?.search && params.search.trim() !== "") {
      const searchStr = params.search.trim();
      query = query.or(
        `name.ilike.%${searchStr}%,email.ilike.%${searchStr}%,subject.ilike.%${searchStr}%,message.ilike.%${searchStr}%`
      );
    }

    // Status filter
    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error || !data) {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }

    const items = (data as ContactMessageDTO[]).map(toContactMessageEntity);
    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getContactMessageById(id: string): Promise<ContactMessageEntity | null> {
    const { data, error } = await this.supabase
      .from("contact_submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    const entity = toContactMessageEntity(data as ContactMessageDTO);

    // Auto-mark new messages as read when viewed
    if (entity.status === "new") {
      await this.updateMessageStatus(id, "read");
    }

    return entity;
  }

  async updateMessageStatus(id: string, status: ContactMessageStatus, notes?: string): Promise<ContactMessageEntity> {
    const payload: { status: ContactMessageStatus; notes?: string } = { status };
    if (notes !== undefined) payload.notes = notes;

    const { data, error } = await this.supabase
      .from("contact_submissions")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update message status");

    const updated = toContactMessageEntity(data as ContactMessageDTO);
    await this.logActivity("updated", updated.id, `Message status updated to ${status} from ${updated.name}`);
    return updated;
  }

  async deleteContactMessage(id: string): Promise<void> {
    const existing = await this.getContactMessageById(id);

    const { error } = await this.supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, `Message from ${existing?.name ?? id}`);
  }

  async bulkDeleteContactMessages(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("contact_submissions")
      .delete()
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("deleted", null, `${ids.length} contact messages`, { count: ids.length });
  }

  async bulkUpdateMessageStatus(ids: string[], status: ContactMessageStatus): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("contact_submissions")
      .update({ status })
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("updated", null, `Bulk updated message status to ${status}`, { ids, status });
  }

  async sendMessageReply(input: SendMessageReplyInput): Promise<void> {
    const res = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      await this.updateMessageStatus(input.messageId, "replied");
      await this.logActivity("updated", input.messageId, `Replied by email to ${input.toEmail}`, { subject: input.subject });
      return;
    }

    await this.updateMessageStatus(input.messageId, "replied");
    await this.logActivity("updated", input.messageId, `Replied by email to ${input.toEmail}`, { subject: input.subject });
  }
}
