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
} from "../../domain/repositories/i-contact.repository";
import { ContactInfoEntity } from "../../domain/entities/contact-info.entity";
import { BranchEntity } from "../../domain/entities/branch.entity";
import type { BranchStatus, CreateBranchInput, UpdateBranchInput } from "../../domain/entities/branch.entity";
import { toBranchEntity } from "../mapper/contact.mapper";

function sanitizeCoordinate(val: unknown, min: number, max: number): number | null {
  if (val === undefined || val === null || val === "") return null;
  const num = typeof val === "number" ? val : parseFloat(String(val));
  if (isNaN(num) || !isFinite(num)) return null;
  if (num < min || num > max) return null;
  return num;
}

function mapStatusToDb(status?: string): "published" | "draft" | "archived" {
  if (status === "active" || status === "published") return "published";
  if (status === "archived") return "archived";
  return "draft";
}

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
        .order("sort_order", { ascending: params?.sortOrder === "asc" })
        .range(offset, offset + limit - 1);

      if (error || !data) {
        return { items: [], total: 0, page, limit, totalPages: 0 };
      }

      const items = data.map(toBranchEntity);
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
      return toBranchEntity(data);
    } catch {
      return null;
    }
  }

  async createBranch(input: CreateBranchInput): Promise<BranchEntity> {
    const branchPayload = {
      map_lat: sanitizeCoordinate(input.latitude, -90, 90),
      map_lng: sanitizeCoordinate(input.longitude, -180, 180),
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      whatsapp_number: input.whatsappNumber?.trim() || null,
      sort_order: input.sortOrder ?? 0,
      status: mapStatusToDb(input.status),
    };

    const { data: branchRow, error: branchError } = await (this.supabase.from("branches" as any) as any)
      .insert(branchPayload)
      .select("*")
      .single();

    if (branchError || !branchRow) {
      throw new Error(branchError?.message ?? "Failed to create branch");
    }

    const translationsPayload = [
      { branch_id: branchRow.id, language_code: "en", name: input.nameEn.trim(), address: input.addressEn?.trim() || null },
      { branch_id: branchRow.id, language_code: "ar", name: input.nameAr.trim(), address: input.addressAr?.trim() || null },
    ];

    if (input.nameKu?.trim() || input.addressKu?.trim()) {
      translationsPayload.push({
        branch_id: branchRow.id,
        language_code: "ku",
        name: input.nameKu?.trim() || "",
        address: input.addressKu?.trim() || null,
      });
    }

    await (this.supabase.from("branch_translations" as any) as any)
      .insert(translationsPayload);

    const created = (await this.getBranchById(branchRow.id))!;
    await this.logActivity("created", created.id, created.nameEn);
    return created;
  }

  async updateBranch(input: UpdateBranchInput): Promise<BranchEntity> {
    const branchPayload = {
      map_lat: sanitizeCoordinate(input.latitude, -90, 90),
      map_lng: sanitizeCoordinate(input.longitude, -180, 180),
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      whatsapp_number: input.whatsappNumber?.trim() || null,
      sort_order: input.sortOrder ?? 0,
      status: mapStatusToDb(input.status),
    };

    const { error: branchError } = await (this.supabase.from("branches" as any) as any)
      .update(branchPayload)
      .eq("id", input.id);

    if (branchError) {
      throw new Error(branchError.message);
    }

    const translationsPayload = [
      { branch_id: input.id, language_code: "en", name: input.nameEn.trim(), address: input.addressEn?.trim() || null },
      { branch_id: input.id, language_code: "ar", name: input.nameAr.trim(), address: input.addressAr?.trim() || null },
    ];

    if (input.nameKu?.trim() || input.addressKu?.trim()) {
      translationsPayload.push({
        branch_id: input.id,
        language_code: "ku",
        name: input.nameKu?.trim() || "",
        address: input.addressKu?.trim() || null,
      });
    }

    await (this.supabase.from("branch_translations" as any) as any)
      .upsert(translationsPayload, { onConflict: "branch_id,language_code" });

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
    const dbStatus = mapStatusToDb(status);
    await (this.supabase.from("branches" as any) as any)
      .update({ status: dbStatus })
      .in("id", ids);
    await this.logActivity("updated", null, `Bulk updated status to ${dbStatus}`, { ids, status: dbStatus });
  }
}
