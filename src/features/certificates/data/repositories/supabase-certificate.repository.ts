// ==============================================================================
// features/certificates/data/repositories/supabase-certificate.repository.ts
// Supabase Data Repository Implementation for Certificates Management
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { UpdateTables } from "@core/types/database.types";
import type {
  ICertificateRepository,
  CertificateFilterParams,
  PaginatedCertificates,
  CreateCertificateInput,
  UpdateCertificateInput,
} from "../../domain/repositories/i-certificate.repository";
import { CertificateEntity } from "../../domain/entities/certificate.entity";
import type { CertificateStatus } from "../../domain/entities/certificate.entity";
import { toCertificateEntity } from "../mapper/certificate.mapper";
import type { CertificateDTO } from "../dto/certificate.dto";

export class SupabaseCertificateRepository implements ICertificateRepository {
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
        entity_type: "homepage",
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

  async getCertificates(params?: CertificateFilterParams): Promise<PaginatedCertificates> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;
    const sortBy = params?.sortBy ?? "sort_order";
    const sortOrder = params?.sortOrder ?? "asc";

    let query = this.supabase
      .from("certificates")
      .select("*", { count: "exact" });

    // Search filter
    if (params?.search && params.search.trim() !== "") {
      const searchStr = params.search.trim();
      query = query.or(`title_en.ilike.%${searchStr}%,title_ar.ilike.%${searchStr}%,organization.ilike.%${searchStr}%`);
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

    const items = (data as CertificateDTO[]).map(toCertificateEntity);
    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getCertificateById(id: string): Promise<CertificateEntity | null> {
    const { data, error } = await this.supabase
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return toCertificateEntity(data as CertificateDTO);
  }

  async createCertificate(input: CreateCertificateInput): Promise<CertificateEntity> {
    const payload = {
      title_en: input.titleEn,
      title_ar: input.titleAr,
      title_ku: input.titleKu ?? null,
      description_en: input.descriptionEn ?? null,
      description_ar: input.descriptionAr ?? null,
      description_ku: input.descriptionKu ?? null,
      image: input.image ?? null,
      issue_date: input.issueDate ?? null,
      expiry_date: input.expiryDate ?? null,
      organization: input.organization ?? null,
      organization_ar: input.organizationAr ?? null,
      organization_ku: input.organizationKu ?? null,
      sort_order: input.sortOrder ?? 0,
      status: input.status ?? "active",
    };

    const { data, error } = await this.supabase
      .from("certificates")
      .insert(payload)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create certificate");

    const created = toCertificateEntity(data as CertificateDTO);
    await this.logActivity("created", created.id, created.titleEn);
    return created;
  }

  async updateCertificate(input: UpdateCertificateInput): Promise<CertificateEntity> {
    const payload: UpdateTables<"certificates"> = {
      updated_at: new Date().toISOString(),
    };

    if (input.titleEn !== undefined) payload.title_en = input.titleEn;
    if (input.titleAr !== undefined) payload.title_ar = input.titleAr;
    if (input.titleKu !== undefined) payload.title_ku = input.titleKu;
    if (input.descriptionEn !== undefined) payload.description_en = input.descriptionEn;
    if (input.descriptionAr !== undefined) payload.description_ar = input.descriptionAr;
    if (input.descriptionKu !== undefined) payload.description_ku = input.descriptionKu;
    if (input.image !== undefined) payload.image = input.image;
    if (input.issueDate !== undefined) payload.issue_date = input.issueDate;
    if (input.expiryDate !== undefined) payload.expiry_date = input.expiryDate;
    if (input.organization !== undefined) payload.organization = input.organization;
    if (input.organizationAr !== undefined) payload.organization_ar = input.organizationAr;
    if (input.organizationKu !== undefined) payload.organization_ku = input.organizationKu;
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;
    if (input.status !== undefined) payload.status = input.status;

    const { data, error } = await this.supabase
      .from("certificates")
      .update(payload)
      .eq("id", input.id)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update certificate");

    const updated = toCertificateEntity(data as CertificateDTO);
    await this.logActivity("updated", updated.id, updated.titleEn);
    return updated;
  }

  async deleteCertificate(id: string): Promise<void> {
    const existing = await this.getCertificateById(id);

    const { error } = await this.supabase
      .from("certificates")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    await this.logActivity("deleted", id, existing?.titleEn ?? "Certificate");
  }

  async bulkDeleteCertificates(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("certificates")
      .delete()
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("deleted", null, `${ids.length} certificates`, { count: ids.length });
  }

  async bulkUpdateCertificateStatus(ids: string[], status: CertificateStatus): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.supabase
      .from("certificates")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
    await this.logActivity("updated", null, `Bulk updated status to ${status}`, { ids, status });
  }
}
