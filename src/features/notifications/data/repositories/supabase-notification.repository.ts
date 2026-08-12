// ==============================================================================
// features/notifications/data/repositories/supabase-notification.repository.ts
// Supabase Concrete Implementation of INotificationRepository
// Strongly typed DTOs matching official SQL Schema
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  INotificationRepository,
  NotificationFilters,
  PaginatedNotifications,
} from "../../domain/repositories/i-notification.repository";
import { NotificationEntity } from "../../domain/entities/notification.entity";
import { toNotificationEntity } from "../mapper/notification.mapper";
import type { NotificationDTO } from "../dto/notification.dto";

interface RfqFallbackRowDTO {
  id: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
  status: string | null;
  created_at: string | null;
}

interface ContactFallbackRowDTO {
  id: string;
  full_name: string | null;
  email: string | null;
  subject: string | null;
  status: string | null;
  created_at: string | null;
}

export class SupabaseNotificationRepository implements INotificationRepository {
  private get supabase() {
    return createClient();
  }

  async getNotifications(filters: NotificationFilters = {}): Promise<PaginatedNotifications> {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, filters.pageSize ?? 10));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      let query = (this.supabase as any)
        .from("notifications")
        .select("*", { count: "exact" });

      if (filters.search && filters.search.trim() !== "") {
        const term = `%${filters.search.trim()}%`;
        query = query.or(`title.ilike.${term},message.ilike.${term}`);
      }

      if (filters.type && filters.type !== "all") {
        query = query.eq("type", filters.type);
      }

      if (filters.readStatus === "unread") {
        query = query.eq("is_read", false);
      } else if (filters.readStatus === "read") {
        query = query.eq("is_read", true);
      }

      query = query.order("created_at", { ascending: false }).range(from, to);

      const { data, count, error } = await query;

      if (!error && data && data.length > 0) {
        const total = count ?? data.length;
        const unreadCount = await this.getUnreadCount();
        const totalPages = Math.ceil(total / pageSize);
        const items = (data as NotificationDTO[]).map(toNotificationEntity);

        return { items, total, unreadCount, page, pageSize, totalPages };
      }
    } catch {
      // Fall through to dynamic fallback stream
    }

    return this.getFallbackNotifications(filters, page, pageSize);
  }

  async getUnreadCount(): Promise<number> {
    try {
      const { count, error } = await (this.supabase as any)
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      if (!error && count !== null) return count;
    } catch {
      // Fallback
    }

    try {
      const [rfqRes, contactRes] = await Promise.all([
        this.supabase.from("rfq_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
        this.supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
      ]);

      return (rfqRes.count ?? 0) + (contactRes.count ?? 0);
    } catch {
      return 0;
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await (this.supabase as any)
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
    } catch {
      // Non-blocking
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await (this.supabase as any)
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);
    } catch {
      // Non-blocking
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await (this.supabase as any)
        .from("notifications")
        .delete()
        .eq("id", id);
    } catch {
      // Non-blocking
    }
  }

  private async getFallbackNotifications(
    filters: NotificationFilters,
    page: number,
    pageSize: number
  ): Promise<PaginatedNotifications> {
    try {
      const [rfqsRes, contactsRes] = await Promise.all([
        this.supabase
          .from("rfq_requests")
          .select("id, full_name, phone, company_name, status, created_at")
          .order("created_at", { ascending: false })
          .limit(20),
        this.supabase
          .from("contact_messages")
          .select("id, full_name, email, subject, status, created_at")
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      const generatedItems: NotificationEntity[] = [];

      if (rfqsRes.data) {
        const rawRfqs = rfqsRes.data as unknown as RfqFallbackRowDTO[];
        rawRfqs.forEach((rfq) => {
          generatedItems.push(
            new NotificationEntity({
              id: `rfq-${rfq.id}`,
              type: "rfq_new",
              title: `New RFQ: ${rfq.full_name || "Customer"}`,
              message: `${rfq.company_name || rfq.phone || "A customer"} submitted a new quotation inquiry request.`,
              link: "/admin/rfq",
              isRead: rfq.status !== "new",
              createdAt: rfq.created_at ? new Date(rfq.created_at) : new Date(),
            })
          );
        });
      }

      if (contactsRes.data) {
        const rawContacts = contactsRes.data as unknown as ContactFallbackRowDTO[];
        rawContacts.forEach((contact) => {
          generatedItems.push(
            new NotificationEntity({
              id: `contact-${contact.id}`,
              type: "contact_new",
              title: `Contact Message: ${contact.full_name || "Customer"}`,
              message: contact.subject || `${contact.email || "Customer"} sent a message via website contact form.`,
              link: "/admin/contact-messages",
              isRead: contact.status !== "new",
              createdAt: contact.created_at ? new Date(contact.created_at) : new Date(),
            })
          );
        });
      }

      generatedItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      let filtered = generatedItems;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(
          (n) => n.title.toLowerCase().includes(s) || n.message.toLowerCase().includes(s)
        );
      }

      if (filters.type && filters.type !== "all") {
        filtered = filtered.filter((n) => n.type === filters.type);
      }

      if (filters.readStatus === "unread") {
        filtered = filtered.filter((n) => !n.isRead);
      } else if (filters.readStatus === "read") {
        filtered = filtered.filter((n) => n.isRead);
      }

      const total = filtered.length;
      const unreadCount = generatedItems.filter((n) => !n.isRead).length;
      const totalPages = Math.ceil(total / pageSize);
      const paginatedItems = filtered.slice((page - 1) * pageSize, page * pageSize);

      return {
        items: paginatedItems,
        total,
        unreadCount,
        page,
        pageSize,
        totalPages,
      };
    } catch {
      return {
        items: [],
        total: 0,
        unreadCount: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }
  }
}
