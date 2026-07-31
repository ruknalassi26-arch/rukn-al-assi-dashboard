// ==============================================================================
// features/contact/data/repositories/supabase-contact.repository.ts
// Supabase Data Repository Implementation for Contact Management & Branches
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { UpdateTables } from "@core/types/database.types";
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
import { toContactInfoEntity, toBranchEntity } from "../mapper/contact.mapper";
import type { ContactInfoDTO, BranchDTO } from "../dto/contact.dto";

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

  async getContactInfo(): Promise<ContactInfoEntity | null> {
    const { data, error } = await this.supabase
      .from("website_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return toContactInfoEntity(data as ContactInfoDTO);
  }

  async updateContactInfo(input: UpdateContactInfoInput): Promise<ContactInfoEntity> {
    const existing = await this.getContactInfo();

    const payload: UpdateTables<"website_settings"> = {
      company_name_en: input.companyNameEn,
      company_name_ar: input.companyNameAr,
      company_name_ku: input.companyNameKu ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      phone_secondary: input.phoneSecondary ?? null,
      address_en: input.addressEn ?? null,
      address_ar: input.addressAr ?? null,
      address_ku: input.addressKu ?? null,
      google_maps_url: input.googleMapsUrl ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      working_hours_en: input.workingHoursEn ?? null,
      working_hours_ar: input.workingHoursAr ?? null,
      working_hours_ku: input.workingHoursKu ?? null,
      facebook_url: input.facebookUrl ?? null,
      twitter_url: input.twitterUrl ?? null,
      linkedin_url: input.linkedinUrl ?? null,
      instagram_url: input.instagramUrl ?? null,
      youtube_url: input.youtubeUrl ?? null,
      whatsapp_number: input.whatsappNumber ?? null,
      updated_at: new Date().toISOString(),
    };

    let resultData: ContactInfoDTO | null = null;

    if (existing) {
      const { data, error } = await this.supabase
        .from("website_settings")
        .update(payload)
        .eq("id", existing.id)
        .select("*")
        .single();

      if (error || !data) throw new Error(error?.message ?? "Failed to update contact info");
      resultData = data as ContactInfoDTO;
    } else {
      const { data, error } = await this.supabase
        .from("website_settings")
        .insert(payload as any)
        .select("*")
        .single();

      if (error || !data) throw new Error(error?.message ?? "Failed to save contact info");
      resultData = data as ContactInfoDTO;
    }

    const updated = toContactInfoEntity(resultData);
    await this.logActivity("updated", updated.id, "Contact Information & Business Details");
    return updated;
  }

  async getBranches(params?: BranchFilterParams): Promise<PaginatedBranches> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;
    const sortBy = params?.sortBy ?? "sort_order";
    const sortOrder = params?.sortOrder ?? "asc";

    let query = this.supabase
      .from("company_branches")
      .select("*", { count: "exact" });

    // Search filter
    if (params?.search && params.search.trim() !== "") {
      const searchStr = params.search.trim();
      query = query.or(
        `name_en.ilike.%${searchStr}%,name_ar.ilike.%${searchStr}%,city_en.ilike.%${searchStr}%,email.ilike.%${searchStr}%`
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

    const items = (data as BranchDTO[]).map(toBranchEntity);
    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getBranchById(id: string): Promise<BranchEntity | null> {
    const { data, error } = await this.supabase
      .from("company_branches")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toBranchEntity(data as BranchDTO);
  }

  async createBranch(input: CreateBranchInput): Promise<BranchEntity> {
    const payload = {
      name_en: input.nameEn,
      name_ar: input.nameAr,
      name_ku: input.nameKu ?? null,
      address_en: input.addressEn ?? null,
      address_ar: input.addressAr ?? null,
      address_ku: input.addressKu ?? null,
      city_en: input.cityEn ?? null,
      city_ar: input.cityAr ?? null,
      city_ku: input.cityKu ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      google_maps_url: input.googleMapsUrl ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      working_hours_en: input.workingHoursEn ?? null,
      working_hours_ar: input.workingHoursAr ?? null,
      working_hours_ku: input.workingHoursKu ?? null,
      is_headquarters: input.isHeadquarters ?? false,
      sort_order: input.sortOrder ?? 0,
      status: input.status ?? "active",
    };

    const { data, error } = await this.supabase
      .from("company_branches")
      .insert(payload)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create branch");

    const created = toBranchEntity(data as BranchDTO);
    await this.logActivity("created", created.id, created.nameEn);
    return created;
  }

  async updateBranch(input: UpdateBranchInput): Promise<BranchEntity> {
    const payload: UpdateTables<"company_branches"> = {
      updated_at: new Date().toISOString(),
    };

    if (input.nameEn !== undefined) payload.name_en = input.nameEn;
    if (input.nameAr !== undefined) payload.name_ar = input.nameAr;
    if (input.nameKu !== undefined) payload.name_ku = input.nameKu;
    if (input.addressEn !== undefined) payload.address_en = input.addressEn;
    if (input.addressAr !== undefined) payload.address_ar = input.addressAr;
    if (input.addressKu !== undefined) payload.address_ku = input.addressKu;
    if (input.cityEn !== undefined) payload.city_en = input.cityEn;
    if (input.cityAr !== undefined) payload.city_ar = input.cityAr;
    if (input.cityKu !== undefined) payload.city_ku = input.cityKu;
    if (input.email !== undefined) payload.email = input.email;
    if (input.phone !== undefined) payload.phone = input.phone;
    if (input.googleMapsUrl !== undefined) payload.google_maps_url = input.googleMapsUrl;
    if (input.latitude !== undefined) payload.latitude = input.latitude;
    if (input.longitude !== undefined) payload.longitude = input.longitude;
    if (input.workingHoursEn !== undefined) payload.working_hours_en = input.workingHoursEn;
    if (input.workingHoursAr !== undefined) payload.working_hours_ar = input.workingHoursAr;
    if (input.workingHoursKu !== undefined) payload.working_hours_ku = input.workingHoursKu;
    if (input.isHeadquarters !== undefined) payload.is_headquarters = input.isHeadquarters;
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;
    if (input.status !== undefined) payload.status = input.status;

    const { data, error } = await this.supabase
      .from("company_branches")
      .update(payload)
      .eq("id", input.id)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update branch");

    const updated = toBranchEntity(data as BranchDTO);
    await this.logActivity("updated", updated.id, updated.nameEn);
    return updated;
  }

  async deleteBranch(id: string): Promise<void> {
    const existing = await this.getBranchById(id);

    const { error } = await this.supabase
      .from("company_branches")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.nameEn ?? "Branch");
  }

  async bulkDeleteBranches(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("company_branches")
      .delete()
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("deleted", null, `${ids.length} branches`, { count: ids.length });
  }

  async bulkUpdateBranchStatus(ids: string[], status: BranchStatus): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("company_branches")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("updated", null, `Bulk updated status to ${status}`, { ids, status });
  }
}
