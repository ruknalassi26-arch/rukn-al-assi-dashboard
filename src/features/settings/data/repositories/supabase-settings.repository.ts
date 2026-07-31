// ==============================================================================
// features/settings/data/repositories/supabase-settings.repository.ts
// Supabase Data Repository Implementation for Website Settings & Branding
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { UpdateTables } from "@core/types/database.types";
import type {
  ISettingsRepository,
  UpdateWebsiteSettingsInput,
} from "../../domain/repositories/i-settings.repository";
import { WebsiteSettingsEntity } from "../../domain/entities/website-settings.entity";
import { toWebsiteSettingsEntity } from "../mapper/settings.mapper";
import type { WebsiteSettingsDTO } from "../dto/settings.dto";

export class SupabaseSettingsRepository implements ISettingsRepository {
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
        entity_type: "settings",
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

  async getSettings(): Promise<WebsiteSettingsEntity | null> {
    const { data, error } = await this.supabase
      .from("website_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return toWebsiteSettingsEntity(data as WebsiteSettingsDTO);
  }

  async updateSettings(input: UpdateWebsiteSettingsInput): Promise<WebsiteSettingsEntity> {
    const existing = await this.getSettings();

    const payload: UpdateTables<"website_settings"> = {
      company_name_en: input.companyNameEn,
      company_name_ar: input.companyNameAr,
      company_name_ku: input.companyNameKu ?? null,
      tagline_en: input.taglineEn ?? null,
      tagline_ar: input.taglineAr ?? null,
      tagline_ku: input.taglineKu ?? null,
      logo_url: input.logoUrl ?? null,
      logo_dark_url: input.logoDarkUrl ?? null,
      favicon_url: input.faviconUrl ?? null,
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
      seo_title_en: input.seoTitleEn ?? null,
      seo_title_ar: input.seoTitleAr ?? null,
      seo_title_ku: input.seoTitleKu ?? null,
      seo_description_en: input.seoDescriptionEn ?? null,
      seo_description_ar: input.seoDescriptionAr ?? null,
      seo_description_ku: input.seoDescriptionKu ?? null,
      updated_at: new Date().toISOString(),
    };

    let resultData: WebsiteSettingsDTO | null = null;

    if (existing) {
      const { data, error } = await this.supabase
        .from("website_settings")
        .update(payload)
        .eq("id", existing.id)
        .select("*")
        .single();

      if (error || !data) throw new Error(error?.message ?? "Failed to update website settings");
      resultData = data as WebsiteSettingsDTO;
    } else {
      const { data, error } = await this.supabase
        .from("website_settings")
        .insert(payload as any)
        .select("*")
        .single();

      if (error || !data) throw new Error(error?.message ?? "Failed to create website settings");
      resultData = data as WebsiteSettingsDTO;
    }

    const updated = toWebsiteSettingsEntity(resultData);
    await this.logActivity("updated", updated.id, "Website Settings & Branding");
    return updated;
  }
}
