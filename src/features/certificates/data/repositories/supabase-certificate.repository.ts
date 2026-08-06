// ==============================================================================
// features/certificates/data/repositories/supabase-certificate.repository.ts
// Supabase Data Repository Implementation for Certificates Management
// Strictly matching official SQL Schema (certifications & certification_translations)
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
          titleKu: ku.title || "",
          descriptionEn: en.description || "",
          descriptionAr: ar.description || "",
          descriptionKu: ku.description || "",
          image: item.image_url || "",
          issueDate: item.issued_date || "",
          expiryDate: "",
          organization: item.issued_by || "",
          organizationAr: "",
          organizationKu: "",
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
        titleKu: ku.title || "",
        descriptionEn: en.description || "",
        descriptionAr: ar.description || "",
        descriptionKu: ku.description || "",
        image: data.image_url || "",
        issueDate: data.issued_date || "",
        expiryDate: "",
        organization: data.issued_by || "",
        organizationAr: "",
        organizationKu: "",
        sortOrder: data.sort_order ?? 0,
        status: data.status === "published" ? "active" : "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch {
      return null;
    }
  }

  async createCertificate(input: CreateCertificateInput): Promise<CertificateEntity> {
    const { data, error } = await (this.supabase.from("certifications" as any) as any)
      .insert({
        image_url: input.image ?? null,
        issued_by: input.organization ?? null,
        issued_date: input.issueDate ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status === "active" ? "published" : "draft",
      })
      .select("*")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create certificate");

    await (this.supabase.from("certification_translations" as any) as any).insert([
      { certification_id: data.id, language_code: "en", title: input.titleEn, description: input.descriptionEn },
      { certification_id: data.id, language_code: "ar", title: input.titleAr, description: input.descriptionAr },
    ]);

    const created = (await this.getCertificateById(data.id))!;
    await this.logActivity("created", created.id, created.titleEn);
    return created;
  }

  async updateCertificate(input: UpdateCertificateInput): Promise<CertificateEntity> {
    await (this.supabase.from("certifications" as any) as any)
      .update({
        image_url: input.image,
        issued_by: input.organization,
        issued_date: input.issueDate ?? null,
        sort_order: input.sortOrder,
        status: input.status === "active" ? "published" : "draft",
      })
      .eq("id", input.id);

    if (input.titleEn !== undefined || input.descriptionEn !== undefined) {
      await (this.supabase.from("certification_translations" as any) as any).upsert({
        certification_id: input.id,
        language_code: "en",
        title: input.titleEn || "",
        description: input.descriptionEn || "",
      });
    }
    if (input.titleAr !== undefined || input.descriptionAr !== undefined) {
      await (this.supabase.from("certification_translations" as any) as any).upsert({
        certification_id: input.id,
        language_code: "ar",
        title: input.titleAr || "",
        description: input.descriptionAr || "",
      });
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
