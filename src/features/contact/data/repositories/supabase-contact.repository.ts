// ==============================================================================
// features/contact/data/repositories/supabase-contact.repository.ts
// Supabase Data Repository Implementation for Contact Management & Branches
// Strictly matching official SQL Schema (branches & branch_translations)
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IContactRepository,
  BranchFilterParams,
  PaginatedBranches,
  UpdateContactInfoInput,
  CreateBranchInput,
  UpdateBranchInput,
} from "../../domain/repositories/i-contact.repository";
import { ContactInfoEntity } from "../../domain/entities/contact-info.entity";
import { BranchEntity } from "../../domain/entities/branch.entity";
import type { BranchStatus } from "../../domain/entities/branch.entity";

export class SupabaseContactRepository implements IContactRepository {
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

  async getContactInfo(): Promise<ContactInfoEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("settings" as any) as any).select("*");
      if (error || !data) return this.getDefaultContactInfo();

      const settingsMap: Record<string, any> = {};
      data.forEach((row: any) => {
        settingsMap[row.key] = row.value;
      });

      return new ContactInfoEntity({
        id: "contact-1",
        companyNameEn: settingsMap.site_name || "Rukn Al Assi",
        companyNameAr: "ركن العاصي",
        companyNameKu: "",
        email: settingsMap.contact_email || "info@ruknalassi.com",
        phone: settingsMap.contact_phone || "+964 750 000 0000",
        phoneSecondary: null,
        addressEn: "Erbil, Iraq",
        addressAr: "أربيل، العراق",
        addressKu: "",
        googleMapsUrl: null,
        latitude: null,
        longitude: null,
        workingHoursEn: "Mon - Sat: 8:00 AM - 5:00 PM",
        workingHoursAr: "الإثنين - السبت: 8:00 صباحاً - 5:00 مساءً",
        workingHoursKu: "",
        facebookUrl: null,
        twitterUrl: null,
        linkedinUrl: null,
        instagramUrl: null,
        youtubeUrl: null,
        whatsappNumber: settingsMap.whatsapp_number || null,
        updatedAt: new Date(),
      });
    } catch {
      return this.getDefaultContactInfo();
    }
  }

  private getDefaultContactInfo(): ContactInfoEntity {
    return new ContactInfoEntity({
      id: "contact-1",
      companyNameEn: "Rukn Al Assi",
      companyNameAr: "ركن العاصي",
      companyNameKu: "",
      email: "info@ruknalassi.com",
      phone: "+964 750 000 0000",
      phoneSecondary: null,
      addressEn: "Erbil, Iraq",
      addressAr: "أربيل، العراق",
      addressKu: "",
      googleMapsUrl: null,
      latitude: null,
      longitude: null,
      workingHoursEn: "Mon - Sat: 8:00 AM - 5:00 PM",
      workingHoursAr: "الإثنين - السبت: 8:00 صباحاً - 5:00 مساءً",
      workingHoursKu: "",
      facebookUrl: null,
      twitterUrl: null,
      linkedinUrl: null,
      instagramUrl: null,
      youtubeUrl: null,
      whatsappNumber: null,
      updatedAt: new Date(),
    });
  }

  async updateContactInfo(input: UpdateContactInfoInput): Promise<ContactInfoEntity> {
    try {
      await (this.supabase.from("settings" as any) as any).upsert([
        { key: "site_name", value: JSON.stringify(input.companyNameEn), category: "general" },
        { key: "contact_email", value: JSON.stringify(input.email ?? ""), category: "general" },
      ]);
    } catch {
      // Ignore
    }

    const updated = (await this.getContactInfo())!;
    await this.logActivity("updated", updated.id, "Contact Information & Business Details");
    return updated;
  }

  async getBranches(params?: BranchFilterParams): Promise<PaginatedBranches> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;

    try {
      const { data, count, error } = await (this.supabase.from("branches" as any) as any)
        .select("*, branch_translations(*)", { count: "exact" })
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .range(offset, offset + limit - 1);

      if (error || !data) {
        return { items: [], total: 0, page, limit, totalPages: 0 };
      }

      const items = data.map((item: any) => {
        const transList: any[] = item.branch_translations || [];
        const en = transList.find((t: any) => t.language_code === "en") || {};
        const ar = transList.find((t: any) => t.language_code === "ar") || {};
        const ku = transList.find((t: any) => t.language_code === "ku") || {};

        return new BranchEntity({
          id: item.id,
          nameEn: en.name || "Branch",
          nameAr: ar.name || "فرع",
          nameKu: ku.name || "",
          addressEn: en.address || "",
          addressAr: ar.address || "",
          addressKu: ku.address || "",
          cityEn: "Erbil",
          cityAr: "أربيل",
          cityKu: "",
          email: item.email || "",
          phone: item.phone || "",
          googleMapsUrl: null,
          latitude: item.map_lat ?? null,
          longitude: item.map_lng ?? null,
          workingHoursEn: "",
          workingHoursAr: "",
          workingHoursKu: "",
          isHeadquarters: false,
          sortOrder: item.sort_order ?? 0,
          status: item.status === "published" ? "active" : "draft",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const total = count ?? items.length;
      const totalPages = Math.ceil(total / limit);

      return { items, total, page, limit, totalPages };
    } catch {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }
  }

  async getBranchById(id: string): Promise<BranchEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("branches" as any) as any)
        .select("*, branch_translations(*)")
        .eq("id", id)
        .single();

      if (error || !data) return null;

      const transList: any[] = data.branch_translations || [];
      const en = transList.find((t: any) => t.language_code === "en") || {};
      const ar = transList.find((t: any) => t.language_code === "ar") || {};
      const ku = transList.find((t: any) => t.language_code === "ku") || {};

      return new BranchEntity({
        id: data.id,
        nameEn: en.name || "Branch",
        nameAr: ar.name || "فرع",
        nameKu: ku.name || "",
        addressEn: en.address || "",
        addressAr: ar.address || "",
        addressKu: ku.address || "",
        cityEn: "Erbil",
        cityAr: "أربيل",
        cityKu: "",
        email: data.email || "",
        phone: data.phone || "",
        googleMapsUrl: null,
        latitude: data.map_lat ?? null,
        longitude: data.map_lng ?? null,
        workingHoursEn: "",
        workingHoursAr: "",
        workingHoursKu: "",
        isHeadquarters: false,
        sortOrder: data.sort_order ?? 0,
        status: data.status === "published" ? "active" : "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch {
      return null;
    }
  }

  async createBranch(input: CreateBranchInput): Promise<BranchEntity> {
    const { data, error } = await (this.supabase.from("branches" as any) as any)
      .insert({
        map_lat: input.latitude,
        map_lng: input.longitude,
        phone: input.phone,
        email: input.email,
        whatsapp_number: input.phone,
        sort_order: input.sortOrder ?? 0,
        status: input.status === "active" ? "published" : "draft",
      })
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create branch");

    await (this.supabase.from("branch_translations" as any) as any).insert([
      { branch_id: data.id, language_code: "en", name: input.nameEn, address: input.addressEn },
      { branch_id: data.id, language_code: "ar", name: input.nameAr, address: input.addressAr },
    ]);

    const created = (await this.getBranchById(data.id))!;
    await this.logActivity("created", created.id, created.nameEn);
    return created;
  }

  async updateBranch(input: UpdateBranchInput): Promise<BranchEntity> {
    await (this.supabase.from("branches" as any) as any)
      .update({
        map_lat: input.latitude,
        map_lng: input.longitude,
        phone: input.phone,
        email: input.email,
        sort_order: input.sortOrder,
        status: input.status === "active" ? "published" : "draft",
      })
      .eq("id", input.id);

    if (input.nameEn !== undefined || input.addressEn !== undefined) {
      await (this.supabase.from("branch_translations" as any) as any).upsert({
        branch_id: input.id,
        language_code: "en",
        name: input.nameEn || "",
        address: input.addressEn || "",
      });
    }
    if (input.nameAr !== undefined || input.addressAr !== undefined) {
      await (this.supabase.from("branch_translations" as any) as any).upsert({
        branch_id: input.id,
        language_code: "ar",
        name: input.nameAr || "",
        address: input.addressAr || "",
      });
    }

    const updated = (await this.getBranchById(input.id))!;
    await this.logActivity("updated", updated.id, updated.nameEn);
    return updated;
  }

  async deleteBranch(id: string): Promise<void> {
    const existing = await this.getBranchById(id);
    await (this.supabase.from("branches" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    await this.logActivity("deleted", id, existing?.nameEn ?? "Branch");
  }

  async bulkDeleteBranches(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await (this.supabase.from("branches" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids);
    await this.logActivity("deleted", null, `${ids.length} branches`, { count: ids.length });
  }

  async bulkUpdateBranchStatus(ids: string[], status: BranchStatus): Promise<void> {
    if (ids.length === 0) return;
    await (this.supabase.from("branches" as any) as any)
      .update({ status: status === "active" ? "published" : "draft" })
      .in("id", ids);
    await this.logActivity("updated", null, `Bulk updated status to ${status}`, { ids, status });
  }
}
