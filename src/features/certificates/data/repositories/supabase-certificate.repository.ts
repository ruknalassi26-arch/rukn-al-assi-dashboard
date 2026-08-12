// ==============================================================================
// features/certificates/data/repositories/supabase-certificate.repository.ts
// Supabase Data Repository Implementation for Certificates Management
// Strictly matching official SQL Schema for certifications and certification_translations
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  ICertificateRepository,
  CertificateFilterParams,
  PaginatedCertificates,
  CreateCertificateInput,
  UpdateCertificateInput,
} from "../../domain/repositories/i-certificate.repository";
import { CertificateEntity } from "../../domain/entities/certificate.entity";
import type { CertificateStatus } from "../../domain/entities/certificate.entity";

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
      await (this.supabase.from("activity_log" as any) as any).insert({
        action,
        entity_type: "certificates",
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
      const { data, count, error } = await (this.supabase.from("certifications" as any) as any)
        .select("*, certification_translations(*)", { count: "exact" })
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .range(offset, offset + limit - 1);

      if (error || !data) {
        return { items: [], total: 0, page, limit, totalPages: 0 };
      }

      const items = data.map((item: any) => {
        const transList: any[] = item.certification_translations || [];
        const en = transList.find((t: any) => t.language_code === "en") || {};
        const ar = transList.find((t: any) => t.language_code === "ar") || {};
        const ku = transList.find((t: any) => t.language_code === "ku") || {};
        return new CertificateEntity({
          id: item.id,
          titleEn: en.title || "Certification",
          titleAr: ar.title || "شهادة اعتمادات",
          titleKu: ku.title || null,
          descriptionEn: en.description || null,
          descriptionAr: ar.description || null,
          descriptionKu: ku.description || null,
          image: item.image_url || null,
          issueDate: item.issued_date ? formatDateForInput(item.issued_date) : null,
          organization: item.issued_by || null,
          organizationAr: null,
          organizationKu: null,
          sortOrder: item.sort_order ?? 0,
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
      const { data, error } = await (this.supabase.from("certifications" as any) as any)
        .select("*, certification_translations(*)")
        .eq("id", id)
        .single();

      if (error || !data) return null;

      const transList: any[] = data.certification_translations || [];
      const en = transList.find((t: any) => t.language_code === "en") || {};
      const ar = transList.find((t: any) => t.language_code === "ar") || {};
      const ku = transList.find((t: any) => t.language_code === "ku") || {};

      return new CertificateEntity({
        id: data.id,
        titleEn: en.title || "Certification",
        titleAr: ar.title || "شهادة اعتمادات",
        titleKu: ku.title || null,
        descriptionEn: en.description || null,
        descriptionAr: ar.description || null,
        descriptionKu: ku.description || null,
        image: data.image_url || null,
        issueDate: data.issued_date ? formatDateForInput(data.issued_date) : null,
        organization: data.issued_by || null,
        organizationAr: null,
        organizationKu: null,
        sortOrder: data.sort_order ?? 0,
        status: data.status === "published" ? "active" : "draft",
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
      });
    } catch {
      return null;
    }
  }

  async createCertificate(input: CreateCertificateInput): Promise<CertificateEntity> {
    const insertPayload: Record<string, any> = {
      image_url: input.image ?? "",
      issued_by: input.organization ?? null,
      issued_date: cleanDateValue(input.issueDate),
      sort_order: input.sortOrder ?? 0,
      status: input.status === "active" ? "published" : "draft",
    };

    const { data, error } = await (this.supabase.from("certifications" as any) as any)
      .insert(insertPayload)
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create certificate");

    const transPayloads = [];
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
      await (this.supabase.from("certification_translations" as any) as any).insert(transPayloads);
    }

    const created = (await this.getCertificateById(data.id))!;
    await this.logActivity("created", created.id, created.titleEn);
    return created;
  }

  async updateCertificate(input: UpdateCertificateInput): Promise<CertificateEntity> {
    const updatePayload: Record<string, any> = {};
    if (input.image !== undefined) updatePayload.image_url = input.image;
    if (input.organization !== undefined) updatePayload.issued_by = input.organization;
    if (input.issueDate !== undefined) updatePayload.issued_date = cleanDateValue(input.issueDate);
    if (input.sortOrder !== undefined) updatePayload.sort_order = input.sortOrder;
    if (input.status !== undefined) updatePayload.status = input.status === "active" ? "published" : "draft";

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await (this.supabase.from("certifications" as any) as any)
        .update(updatePayload)
        .eq("id", input.id);
      if (error) throw new Error(error.message);
    }

    if (input.titleEn !== undefined || input.descriptionEn !== undefined) {
      if (input.titleEn?.trim()) {
        await (this.supabase.from("certification_translations" as any) as any).upsert({
          certification_id: input.id,
          language_code: "en",
          title: input.titleEn.trim(),
          description: input.descriptionEn ?? null,
        }, { onConflict: "certification_id,language_code" });
      }
    }

    if (input.titleAr !== undefined || input.descriptionAr !== undefined) {
      if (input.titleAr?.trim()) {
        await (this.supabase.from("certification_translations" as any) as any).upsert({
          certification_id: input.id,
          language_code: "ar",
          title: input.titleAr.trim(),
          description: input.descriptionAr ?? null,
        }, { onConflict: "certification_id,language_code" });
      }
    }

    if (input.titleKu !== undefined || input.descriptionKu !== undefined) {
      if (input.titleKu?.trim()) {
        await (this.supabase.from("certification_translations" as any) as any).upsert({
          certification_id: input.id,
          language_code: "ku",
          title: input.titleKu.trim(),
          description: input.descriptionKu ?? null,
        }, { onConflict: "certification_id,language_code" });
      } else {
        await (this.supabase.from("certification_translations" as any) as any)
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
    await (this.supabase.from("certifications" as any) as any)
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
      status: "draft",
    });
  }

  async bulkDeleteCertificates(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await (this.supabase.from("certifications" as any) as any)
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids);
    await this.logActivity("deleted", null, `${ids.length} certificates`, { count: ids.length });
  }

  async bulkUpdateCertificateStatus(ids: string[], status: CertificateStatus): Promise<void> {
    if (ids.length === 0) return;
    await (this.supabase.from("certifications" as any) as any)
      .update({ status: status === "active" ? "published" : "draft" })
      .in("id", ids);
    await this.logActivity("updated", null, `Bulk updated status to ${status}`, { ids, status });
  }
}
