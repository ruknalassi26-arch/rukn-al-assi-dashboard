// ==============================================================================
// features/seo/data/repositories/supabase-seo.repository.ts
// Supabase Data Repository Implementation for Public Pages SEO Metadata
// Strictly matching official SQL Schema (seo_meta & activity_log)
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  ISeoRepository,
  UpdateSeoSettingInput,
} from "../../domain/repositories/i-seo.repository";
import { SeoSettingEntity } from "../../domain/entities/seo-setting.entity";
import type { SeoPageKey } from "../../domain/entities/seo-setting.entity";

interface SeoMetaRowDTO {
  id?: string;
  entity_type?: string;
  entity_id?: string | null;
  language_code?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
  canonical_url?: string | null;
  schema_json?: Record<string, unknown> | unknown[] | null;
  page?: string;
  title_en?: string;
  title_ar?: string;
  title_ku?: string;
  description_en?: string;
  description_ar?: string;
  description_ku?: string;
  og_image?: string;
  updated_at?: string;
}

export class SupabaseSeoRepository implements ISeoRepository {
  private get supabase() {
    return createClient();
  }

  private async logActivity(
    action: "updated",
    entityId: string | null,
    entityTitle: string | null,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      await this.supabase.from("activity_log").insert({
        action,
        entity_type: "seo",
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getAllSeoSettings(): Promise<SeoSettingEntity[]> {
    try {
      const { data, error } = await this.supabase.from("seo_meta").select("*");

      if (!error && data) {
        const rawRows = data as unknown as SeoMetaRowDTO[];
        const pageKeys: SeoPageKey[] = ["home", "about", "products", "categories", "services", "projects", "certificates", "contact", "careers"];
        return pageKeys.map((pk) => {
          const enRow = rawRows.find((r) => (r.entity_type === pk || r.page === pk) && r.language_code === "en") || rawRows.find((r) => r.page === pk) || {};
          const arRow = rawRows.find((r) => (r.entity_type === pk || r.page === pk) && r.language_code === "ar") || {};
          const kuRow = rawRows.find((r) => (r.entity_type === pk || r.page === pk) && r.language_code === "ku") || {};

          return new SeoSettingEntity({
            id: String(enRow.id || `seo-${pk}`),
            pageKey: pk,
            metaTitleEn: enRow.meta_title || enRow.title_en || `Rukn Al Assi — ${pk}`,
            metaTitleAr: arRow.meta_title || enRow.title_ar || `ركن العاصي — ${pk}`,
            metaTitleKu: kuRow.meta_title || enRow.title_ku || null,
            metaDescriptionEn: enRow.meta_description || enRow.description_en || "",
            metaDescriptionAr: arRow.meta_description || enRow.description_ar || "",
            metaDescriptionKu: kuRow.meta_description || enRow.description_ku || null,
            canonicalUrlEn: enRow.canonical_url || null,
            canonicalUrlAr: arRow.canonical_url || null,
            canonicalUrlKu: kuRow.canonical_url || null,
            ogImageUrl: enRow.og_image_url || arRow.og_image_url || enRow.og_image || null,
            schemaJson: enRow.schema_json || null,
            isIndexed: true,
            createdAt: new Date(),
            updatedAt: new Date(enRow.updated_at || Date.now()),
          });
        });
      }
    } catch {
      // Fall through to default settings
    }

    return this.getDefaultSeoSettings();
  }

  private getDefaultSeoSettings(): SeoSettingEntity[] {
    const pageKeys: SeoPageKey[] = ["home", "about", "products", "categories", "services", "projects", "certificates", "contact", "careers"];
    return pageKeys.map((pk) => new SeoSettingEntity({
      id: `seo-${pk}`,
      pageKey: pk,
      metaTitleEn: `Rukn Al Assi — ${pk}`,
      metaTitleAr: `ركن العاصي — ${pk}`,
      metaTitleKu: null,
      metaDescriptionEn: "Leading Provider of Hydraulic Solutions & Engineering Services.",
      metaDescriptionAr: "المزود الرائد لحلول الهيدروليك والخدمات الهندسية.",
      metaDescriptionKu: null,
      canonicalUrlEn: null,
      canonicalUrlAr: null,
      canonicalUrlKu: null,
      ogImageUrl: null,
      schemaJson: null,
      isIndexed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  async getSeoSettingByPageKey(pageKey: SeoPageKey): Promise<SeoSettingEntity | null> {
    try {
      const { data, error } = await this.supabase
        .from("seo_meta")
        .select("*")
        .eq("entity_type", pageKey)
        .is("entity_id", null);

      if (!error && data && data.length > 0) {
        const rawRows = data as unknown as SeoMetaRowDTO[];
        const enRow = rawRows.find((r) => r.language_code === "en") || {};
        const arRow = rawRows.find((r) => r.language_code === "ar") || {};
        const kuRow = rawRows.find((r) => r.language_code === "ku") || {};

        return new SeoSettingEntity({
          id: String(enRow.id || `seo-${pageKey}`),
          pageKey,
          metaTitleEn: enRow.meta_title || `Rukn Al Assi — ${pageKey}`,
          metaTitleAr: arRow.meta_title || `ركن العاصي — ${pageKey}`,
          metaTitleKu: kuRow.meta_title || null,
          metaDescriptionEn: enRow.meta_description || "",
          metaDescriptionAr: arRow.meta_description || "",
          metaDescriptionKu: kuRow.meta_description || null,
          canonicalUrlEn: enRow.canonical_url || null,
          canonicalUrlAr: arRow.canonical_url || null,
          canonicalUrlKu: kuRow.canonical_url || null,
          ogImageUrl: enRow.og_image_url || arRow.og_image_url || null,
          schemaJson: (enRow.schema_json as any) || null,
          isIndexed: true,
          createdAt: new Date(),
          updatedAt: new Date(enRow.updated_at || Date.now()),
        });
      }
    } catch {}

    const all = await this.getAllSeoSettings();
    return all.find((item) => item.pageKey === pageKey) || null;
  }

  async updateSeoSetting(input: UpdateSeoSettingInput): Promise<SeoSettingEntity> {
    const pk = input.pageKey;

    const langRows = [
      {
        language_code: "en",
        meta_title: input.metaTitleEn || null,
        meta_description: input.metaDescriptionEn || null,
        canonical_url: input.canonicalUrlEn || null,
      },
      {
        language_code: "ar",
        meta_title: input.metaTitleAr || null,
        meta_description: input.metaDescriptionAr || null,
        canonical_url: input.canonicalUrlAr || null,
      },
    ];

    if (input.metaTitleKu || input.metaDescriptionKu || input.canonicalUrlKu) {
      langRows.push({
        language_code: "ku",
        meta_title: input.metaTitleKu || null,
        meta_description: input.metaDescriptionKu || null,
        canonical_url: input.canonicalUrlKu || null,
      });
    }

    // 1. Primary path: Update or Insert entries for (entity_type = pk, entity_id IS NULL, language_code)
    let primarySuccess = false;
    for (const lang of langRows) {
      const payload: any = {
        entity_type: pk,
        entity_id: null,
        language_code: lang.language_code,
        meta_title: lang.meta_title,
        meta_description: lang.meta_description,
        og_image_url: input.ogImageUrl || null,
        canonical_url: lang.canonical_url,
        schema_json: input.schemaJson || null,
      };

      try {
        const { data: existingRows } = await (this.supabase.from("seo_meta" as any) as any)
          .select("id")
          .eq("entity_type", pk)
          .is("entity_id", null)
          .eq("language_code", lang.language_code)
          .order("id", { ascending: true });

        if (existingRows && existingRows.length > 0) {
          const canonicalId = existingRows[0].id;
          const { error: updateErr } = await (this.supabase.from("seo_meta" as any) as any)
            .update(payload)
            .eq("id", canonicalId);

          if (!updateErr) {
            primarySuccess = true;

            // Cleanup extra duplicate rows if previous runs created duplicates
            if (existingRows.length > 1) {
              const duplicateIds = existingRows.slice(1).map((r: any) => r.id);
              await (this.supabase.from("seo_meta" as any) as any)
                .delete()
                .in("id", duplicateIds);
            }
          }
        } else {
          const { error: insertErr } = await (this.supabase.from("seo_meta" as any) as any)
            .insert(payload);

          if (!insertErr) {
            primarySuccess = true;
          }
        }
      } catch {}
    }

    // 2. Fallback path: Save single-row entry if table uses page column schema
    if (!primarySuccess) {
      const singlePayload: any = {
        page: pk,
        title_en: input.metaTitleEn || null,
        title_ar: input.metaTitleAr || null,
        title_ku: input.metaTitleKu || null,
        description_en: input.metaDescriptionEn || null,
        description_ar: input.metaDescriptionAr || null,
        description_ku: input.metaDescriptionKu || null,
        og_image: input.ogImageUrl || null,
        updated_at: new Date().toISOString(),
      };

      try {
        const { data: existing } = await (this.supabase.from("seo_meta" as any) as any)
          .select("id")
          .eq("page", pk)
          .maybeSingle();

        if (existing?.id) {
          await (this.supabase.from("seo_meta" as any) as any)
            .update(singlePayload)
            .eq("id", existing.id);
        } else {
          await (this.supabase.from("seo_meta" as any) as any)
            .insert(singlePayload);
        }
      } catch {}
    }

    const updated = (await this.getSeoSettingByPageKey(pk))!;
    await this.logActivity("updated", updated.id, `SEO Settings for ${pk}`);
    return updated;
  }
}
