// ==============================================================================
// features/contact-messages/data/repositories/supabase-contact-messages.repository.ts
// Supabase Data Repository Implementation for Customer Contact Messages Inbox
// Strictly matching official SQL Schema (contact_messages & activity_log)
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
      await (this.supabase.from("activity_log" as any) as any).insert({
        action,
        entity_type: "contact",
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getContactMessages(params?: ContactMessageFilterParams): Promise<PaginatedContactMessages> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;

    try {
      let query = (this.supabase.from("contact_messages" as any) as any)
        .select("*", { count: "exact" });

      if (params?.search && params.search.trim() !== "") {
        const searchStr = params.search.trim();
        query = query.or(
          `full_name.ilike.%${searchStr}%,email.ilike.%${searchStr}%,subject.ilike.%${searchStr}%,message.ilike.%${searchStr}%`
        );
      }

      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status);
      }

      query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

      const { data, count, error } = await query;

      if (error || !data) {
        return { items: [], total: 0, page, limit, totalPages: 0 };
      }

      const items = data.map((item: any) => new ContactMessageEntity({
        id: item.id,
        name: item.full_name || "Customer",
        email: item.email || "",
        phone: item.phone || "",
        subject: item.subject || "Contact Query",
        message: item.message || "",
        status: (item.status === "new" || item.status === "read" || item.status === "replied") ? item.status : "new",
        notes: null,
        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
      }));

      const total = count ?? items.length;
      const totalPages = Math.ceil(total / limit);

      return { items, total, page, limit, totalPages };
    } catch {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }
  }

  async getContactMessageById(id: string): Promise<ContactMessageEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("contact_messages" as any) as any)
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return null;

      const entity = new ContactMessageEntity({
        id: data.id,
        name: data.full_name || "Customer",
        email: data.email || "",
        phone: data.phone || "",
        subject: data.subject || "Contact Query",
        message: data.message || "",
        status: (data.status === "new" || data.status === "read" || data.status === "replied") ? data.status : "new",
        notes: null,
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      });

      if (entity.status === "new") {
        await this.updateMessageStatus(id, "read");
      }

      return entity;
    } catch {
      return null;
    }
  }

  async updateMessageStatus(id: string, status: ContactMessageStatus): Promise<ContactMessageEntity> {
    await (this.supabase.from("contact_messages" as any) as any)
      .update({ status })
      .eq("id", id);

    const updated = (await this.getContactMessageById(id))!;
    await this.logActivity("updated", id, `Message status updated to ${status}`);
    return updated;
  }

  async deleteContactMessage(id: string): Promise<void> {
    await (this.supabase.from("contact_messages" as any) as any)
      .delete()
      .eq("id", id);
    await this.logActivity("deleted", id, `Message deleted`);
  }

  async bulkDeleteContactMessages(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await (this.supabase.from("contact_messages" as any) as any)
      .delete()
      .in("id", ids);
    await this.logActivity("deleted", null, `${ids.length} contact messages`, { count: ids.length });
  }

  async bulkUpdateMessageStatus(ids: string[], status: ContactMessageStatus): Promise<void> {
    if (ids.length === 0) return;
    await (this.supabase.from("contact_messages" as any) as any)
      .update({ status })
      .in("id", ids);
    await this.logActivity("updated", null, `Bulk updated message status to ${status}`, { ids, status });
  }

  async sendMessageReply(input: SendMessageReplyInput): Promise<void> {
    await this.updateMessageStatus(input.messageId, "replied");
    await this.logActivity("updated", input.messageId, `Replied by email to ${input.toEmail}`, { subject: input.subject });
  }
}
