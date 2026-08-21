// ==============================================================================
// features/certificates/data/repositories/supabase-certificate.repository.ts
// Supabase Data Repository Implementation for Certificates Management
// Strictly matching official SQL Schema for certifications and certification_translations
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { InsertTables, UpdateTables } from "@core/types/database.types";
import { CertificateEntity } from "../../domain/entities/certificate.entity";
import type { CertificateStatus } from "../../domain/entities/certificate.entity";
import type {
  ICertificateRepository,
  CertificateFilterParams,
  PaginatedCertificates,
  CreateCertificateInput,
  UpdateCertificateInput,
} from "../../domain/repositories/i-certificate.repository";

interface DbCertificationTranslation {
  certification_id: string;
  language_code: string;
  title: string;
  description: string | null;
}

interface DbCertificationRow {
  id: string;
  image_url: string | null;
  issued_by: string | null;
  issued_date: string | null;
  sort_order: number;
  status: "published" | "draft" | "active";
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  is_featured: boolean;
  featured_order: number | null;
  created_at: string;
  updated_at: string;
  certification_translations?: DbCertificationTranslation[];
}

export function formatDateForInput(dateStr?: string | null): string {
  if (!dateStr || dateStr.trim() === "") return "";
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (trimmed.includes("T")) return trimmed.split("T")[0];
  if (trimmed.includes(" ")) return trimmed.split(" ")[0];
  return trimmed;
}

function cleanDateValue(val?: string | null): string | null {
  if (!val || val.trim() === "") return null;
  return formatDateForInput(val);
}

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
      await this.supabase.from("activity_log").insert({
        action,
        entity_type: "certificates" as const,
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getCertificates(params?: CertificateFilterParams): Promise<PaginatedCertificates> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;

    try {
      let query = this.supabase
        .from("certifications")
        .select("*, certification_translations(*)", { count: "exact" })
        .is("deleted_at", null);

      if (params?.status && params.status !== "all") {
        query = query.eq("status", params.status === "active" ? "published" : "draft");
      }

      if (params?.isFeatured !== undefined && params.isFeatured !== "all") {
        query = query.eq("is_featured", params.isFeatured);
      }

      const sortBy = params?.sortBy ?? "sort_order";
      const isAsc = params?.sortOrder !== "desc";

      if (sortBy === "featured_order") {
        query = query.order("featured_order", { ascending: isAsc, nullsFirst: false });
      } else if (sortBy === "issue_date") {
        query = query.order("issued_date", { ascending: isAsc });
      } else if (sortBy === "created_at") {
        query = query.order("created_at", { ascending: isAsc });
      } else {
        query = query.order("sort_order", { ascending: isAsc });
      }

      const { data, count, error } = await query.range(offset, offset + limit - 1);

      if (error || !data) {
        return { items: [], total: 0, page, limit, totalPages: 0 };
      }

      const rows = data as unknown as DbCertificationRow[];
      const items = rows.map((item) => {
        const transList = item.certification_translations || [];
        const en = transList.find((t) => t.language_code === "en");
        const ar = transList.find((t) => t.language_code === "ar");
        const ku = transList.find((t) => t.language_code === "ku");
        return new CertificateEntity({
          id: item.id,
          titleEn: en?.title || "Certification",
          titleAr: ar?.title || "شهادة اعتمادات",
          titleKu: ku?.title || null,
          descriptionEn: en?.description || null,
          descriptionAr: ar?.description || null,
          descriptionKu: ku?.description || null,
          image: item.image_url || null,
          issueDate: item.issued_date ? formatDateForInput(item.issued_date) : null,
          organization: item.issued_by || null,
          organizationAr: null,
          organizationKu: null,
          sortOrder: item.sort_order ?? 0,
          isFeatured: item.is_featured ?? false,
          featuredOrder: item.featured_order ?? null,
          status: item.status === "published" ? "active" : "draft",
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
        });
      });

      const total = count ?? items.length;
      const totalPages = Math.ceil(total / limit);

      return { items, total, page, limit, totalPages };
    } catch {
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }
  }

  async getCertificateById(id: string): Promise<CertificateEntity | null> {
    try {
      const { data, error } = await this.supabase
        .from("certifications")
        .select("*, certification_translations(*)")
        .eq("id", id)
        .single();

      if (error || !data) return null;

      const item = data as unknown as DbCertificationRow;
      const transList = item.certification_translations || [];
      const en = transList.find((t) => t.language_code === "en");
      const ar = transList.find((t) => t.language_code === "ar");
      const ku = transList.find((t) => t.language_code === "ku");

      return new CertificateEntity({
        id: item.id,
        titleEn: en?.title || "Certification",
        titleAr: ar?.title || "شهادة اعتمادات",
        titleKu: ku?.title || null,
        descriptionEn: en?.description || null,
        descriptionAr: ar?.description || null,
        descriptionKu: ku?.description || null,
        image: item.image_url || null,
        issueDate: item.issued_date ? formatDateForInput(item.issued_date) : null,
        organization: item.issued_by || null,
        organizationAr: null,
        organizationKu: null,
        sortOrder: item.sort_order ?? 0,
        isFeatured: item.is_featured ?? false,
        featuredOrder: item.featured_order ?? null,
        status: item.status === "published" ? "active" : "draft",
        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
      });
    } catch {
      return null;
    }
  }

  async createCertificate(input: CreateCertificateInput): Promise<CertificateEntity> {
    const isFeatured = input.isFeatured ?? false;
    const featuredOrder = isFeatured ? (input.featuredOrder ?? null) : null;

    const insertPayload: InsertTables<"certifications"> = {
      image_url: input.image ?? "",
      issued_by: input.organization ?? null,
      issued_date: cleanDateValue(input.issueDate),
      sort_order: input.sortOrder ?? 0,
      is_featured: isFeatured,
      featured_order: featuredOrder,
      status: input.status === "active" ? "published" : "draft",
    };

    const { data, error } = await this.supabase
      .from("certifications")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create certificate");

    const transPayloads: InsertTables<"certification_translations">[] = [];
    if (input.titleEn?.trim()) {
      transPayloads.push({ certification_id: data.id, language_code: "en", title: input.titleEn.trim(), description: input.descriptionEn ?? null });
    }
    if (input.titleAr?.trim()) {
      transPayloads.push({ certification_id: data.id, language_code: "ar", title: input.titleAr.trim(), description: input.descriptionAr ?? null });
    }
    if (input.titleKu?.trim()) {
      transPayloads.push({ certification_id: data.id, language_code: "ku", title: input.titleKu.trim(), description: input.descriptionKu ?? null });
    }

    if (transPayloads.length > 0) {
      await this.supabase.from("certification_translations").insert(transPayloads);
    }

    const created = (await this.getCertificateById(data.id))!;
    await this.logActivity("created", created.id, created.titleEn);
    return created;
  }

  async updateCertificate(input: UpdateCertificateInput): Promise<CertificateEntity> {
    const updatePayload: UpdateTables<"certifications"> = {};
    if (input.image !== undefined) updatePayload.image_url = input.image;
    if (input.organization !== undefined) updatePayload.issued_by = input.organization;
    if (input.issueDate !== undefined) updatePayload.issued_date = cleanDateValue(input.issueDate);
    if (input.sortOrder !== undefined) updatePayload.sort_order = input.sortOrder;
    if (input.status !== undefined) updatePayload.status = input.status === "active" ? "published" : "draft";

    if (input.isFeatured !== undefined) {
      updatePayload.is_featured = input.isFeatured;
      if (!input.isFeatured) {
        updatePayload.featured_order = null;
      } else if (input.featuredOrder !== undefined) {
        updatePayload.featured_order = input.featuredOrder;
      }
    } else if (input.featuredOrder !== undefined) {
      updatePayload.featured_order = input.featuredOrder;
    }

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await this.supabase
        .from("certifications")
        .update(updatePayload)
        .eq("id", input.id);
      if (error) throw new Error(error.message);
    }

    if (input.titleEn !== undefined || input.descriptionEn !== undefined) {
      if (input.titleEn?.trim()) {
        await this.supabase.from("certification_translations").upsert({
          certification_id: input.id,
          language_code: "en",
          title: input.titleEn.trim(),
          description: input.descriptionEn ?? null,
        }, { onConflict: "certification_id,language_code" });
      }
    }

    if (input.titleAr !== undefined || input.descriptionAr !== undefined) {
      if (input.titleAr?.trim()) {
        await this.supabase.from("certification_translations").upsert({
          certification_id: input.id,
          language_code: "ar",
          title: input.titleAr.trim(),
          description: input.descriptionAr ?? null,
        }, { onConflict: "certification_id,language_code" });
      }
    }

    if (input.titleKu !== undefined || input.descriptionKu !== undefined) {
      if (input.titleKu?.trim()) {
        await this.supabase.from("certification_translations").upsert({
          certification_id: input.id,
          language_code: "ku",
          title: input.titleKu.trim(),
          description: input.descriptionKu ?? null,
        }, { onConflict: "certification_id,language_code" });
      } else {
        await this.supabase
          .from("certification_translations")
          .delete()
          .eq("certification_id", input.id)
          .eq("language_code", "ku");
      }
    }

    const updated = (await this.getCertificateById(input.id))!;
    await this.logActivity("updated", updated.id, updated.titleEn);
    return updated;
  }

  async deleteCertificate(id: string): Promise<void> {
    const existing = await this.getCertificateById(id);
    await this.supabase
      .from("certifications")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    await this.logActivity("deleted", id, existing?.titleEn ?? "Certificate");
  }

  async duplicateCertificate(id: string): Promise<CertificateEntity> {
    const existing = await this.getCertificateById(id);
    if (!existing) throw new Error("Certificate not found");

    return this.createCertificate({
      titleEn: `Copy of ${existing.titleEn}`,
      titleAr: existing.titleAr ? `نسخة من ${existing.titleAr}` : `Copy of ${existing.titleEn}`,
      titleKu: existing.titleKu ? `کۆپیی ${existing.titleKu}` : null,
      descriptionEn: existing.descriptionEn,
      descriptionAr: existing.descriptionAr,
      descriptionKu: existing.descriptionKu,
      image: existing.image,
      issueDate: existing.issueDate,
      organization: existing.organization,
      sortOrder: existing.sortOrder,
      isFeatured: false,
      featuredOrder: null,
      status: "draft",
    });
  }

  async bulkDeleteCertificates(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await this.supabase
      .from("certifications")
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids);
    await this.logActivity("deleted", null, `${ids.length} certificates`, { count: ids.length });
  }

  async bulkUpdateCertificateStatus(ids: string[], status: CertificateStatus): Promise<void> {
    if (ids.length === 0) return;
    await this.supabase
      .from("certifications")
      .update({ status: status === "active" ? "published" : "draft" })
      .in("id", ids);
    await this.logActivity("updated", null, `Bulk updated status to ${status}`, { ids, status });
  }
}
