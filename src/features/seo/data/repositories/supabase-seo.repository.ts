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
  language_code?: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  page?: string;
  title_en?: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
  og_image?: string;
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
        const pageKeys: SeoPageKey[] = ["home", "about", "services", "products", "projects", "contact", "careers"];
        return pageKeys.map((pk) => {
          const en = rawRows.find((row) => row.entity_type === pk && row.language_code === "en") || {};
          const ar = rawRows.find((row) => row.entity_type === pk && row.language_code === "ar") || {};
          return new SeoSettingEntity({
            id: String(en.id || `seo-${pk}`),
            pageKey: pk,
            metaTitleEn: en.meta_title || `Rukn Al Assi — ${pk}`,
            metaTitleAr: ar.meta_title || `ركن العاصي — ${pk}`,
            metaTitleKu: null,
            metaDescriptionEn: en.meta_description || "",
            metaDescriptionAr: ar.meta_description || "",
            metaDescriptionKu: null,
            keywordsEn: null,
            keywordsAr: null,
            keywordsKu: null,
            ogImageUrl: en.og_image_url || null,
            isIndexed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
    } catch (e) {
      console.warn("getAllSeoSettings query warning:", e);
    }

    return this.getDefaultSeoSettings();
  }

  private getDefaultSeoSettings(): SeoSettingEntity[] {
    const pageKeys: SeoPageKey[] = ["home", "about", "services", "products", "projects", "contact", "careers"];
    return pageKeys.map((pk) => new SeoSettingEntity({
      id: `seo-${pk}`,
      pageKey: pk,
      metaTitleEn: `Rukn Al Assi — ${pk}`,
      metaTitleAr: `ركن العاصي — ${pk}`,
      metaTitleKu: null,
      metaDescriptionEn: "Leading Provider of Hydraulic Solutions & Engineering Services.",
      metaDescriptionAr: "المزود الرائد لحلول الهيدروليك والخدمات الهندسية.",
      metaDescriptionKu: null,
      keywordsEn: null,
      keywordsAr: null,
      keywordsKu: null,
      ogImageUrl: null,
      isIndexed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  async getSeoSettingByPageKey(pageKey: SeoPageKey): Promise<SeoSettingEntity | null> {
    const all = await this.getAllSeoSettings();
    return all.find((item) => item.pageKey === pageKey) || null;
  }

  async updateSeoSetting(input: UpdateSeoSettingInput): Promise<SeoSettingEntity> {
    try {
      await (this.supabase.from("seo_meta") as any).upsert([
        {
          entity_type: input.pageKey,
          language_code: "en",
          meta_title: input.metaTitleEn,
          meta_description: input.metaDescriptionEn,
          og_image_url: input.ogImageUrl,
        },
        {
          entity_type: input.pageKey,
          language_code: "ar",
          meta_title: input.metaTitleAr,
          meta_description: input.metaDescriptionAr,
          og_image_url: input.ogImageUrl,
        },
      ]);
    } catch (e) {
      console.warn("updateSeoSetting query warning:", e);
    }

    const updated = (await this.getSeoSettingByPageKey(input.pageKey))!;
    await this.logActivity("updated", updated.id, `SEO Settings for ${input.pageKey}`);
    return updated;
  }
}
