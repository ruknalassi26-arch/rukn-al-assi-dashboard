// ==============================================================================
// features/seo/data/repositories/supabase-seo.repository.ts
// Supabase Data Repository Implementation for Public Pages SEO Metadata
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { UpdateTables } from "@core/types/database.types";
import type {
  ISeoRepository,
  UpdateSeoSettingInput,
} from "../../domain/repositories/i-seo.repository";
import { SeoSettingEntity } from "../../domain/entities/seo-setting.entity";
import type { SeoPageKey } from "../../domain/entities/seo-setting.entity";
import { toSeoSettingEntity } from "../mapper/seo.mapper";
import type { SeoSettingDTO } from "../dto/seo.dto";

export class SupabaseSeoRepository implements ISeoRepository {
  private get supabase() {
    return createClient();
  }

  private async logActivity(
    action: "updated",
    entityId: string | null,
    entityTitle: string | null,
    metadata?: Record<string, unknown>
  ) {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      await this.supabase.from("activity_logs").insert({
        action,
        entity_type: "seo",
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

  async getAllSeoSettings(): Promise<SeoSettingEntity[]> {
    const { data, error } = await this.supabase
      .from("seo_settings")
      .select("*")
      .order("page_key", { ascending: true });

    if (error || !data) return [];
    return (data as SeoSettingDTO[]).map(toSeoSettingEntity);
  }

  async getSeoSettingByPageKey(pageKey: SeoPageKey): Promise<SeoSettingEntity | null> {
    const { data, error } = await this.supabase
      .from("seo_settings")
      .select("*")
      .eq("page_key", pageKey)
      .maybeSingle();

    if (error || !data) return null;
    return toSeoSettingEntity(data as SeoSettingDTO);
  }

  async updateSeoSetting(input: UpdateSeoSettingInput): Promise<SeoSettingEntity> {
    const existing = await this.getSeoSettingByPageKey(input.pageKey);

    const payload: UpdateTables<"seo_settings"> = {
      page_key: input.pageKey,
      meta_title_en: input.metaTitleEn ?? null,
      meta_title_ar: input.metaTitleAr ?? null,
      meta_title_ku: input.metaTitleKu ?? null,
      meta_description_en: input.metaDescriptionEn ?? null,
      meta_description_ar: input.metaDescriptionAr ?? null,
      meta_description_ku: input.metaDescriptionKu ?? null,
      keywords_en: input.keywordsEn ?? null,
      keywords_ar: input.keywordsAr ?? null,
      keywords_ku: input.keywordsKu ?? null,
      og_image_url: input.ogImageUrl ?? null,
      is_indexed: input.isIndexed ?? true,
      updated_at: new Date().toISOString(),
    };

    let resultData: SeoSettingDTO | null = null;

    if (existing) {
      const { data, error } = await this.supabase
        .from("seo_settings")
        .update(payload)
        .eq("id", existing.id)
        .select("*")
        .single();

      if (error || !data) throw new Error(error?.message ?? "Failed to update SEO setting");
      resultData = data as SeoSettingDTO;
    } else {
      const { data, error } = await this.supabase
        .from("seo_settings")
        .insert(payload as any)
        .select("*")
        .single();

      if (error || !data) throw new Error(error?.message ?? "Failed to create SEO setting");
      resultData = data as SeoSettingDTO;
    }

    const updated = toSeoSettingEntity(resultData);
    await this.logActivity("updated", updated.id, `SEO Metadata for Page: ${input.pageKey}`, {
      ogImageChanged: existing?.ogImageUrl !== input.ogImageUrl,
    });
    return updated;
  }
}
