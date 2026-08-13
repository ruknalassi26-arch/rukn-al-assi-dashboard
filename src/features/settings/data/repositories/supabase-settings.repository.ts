// ==============================================================================
// features/settings/data/repositories/supabase-settings.repository.ts
// Supabase Data Repository Implementation for Website Settings & Branding
// Strictly matching official SQL Schema (settings & activity_log)
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  ISettingsRepository,
  UpdateWebsiteSettingsInput,
} from "../../domain/repositories/i-settings.repository";
import { WebsiteSettingsEntity } from "../../domain/entities/website-settings.entity";

function parseSettingValue(rawVal: unknown): string {
  if (rawVal === null || rawVal === undefined) return "";
  let val = String(rawVal).trim();
  
  // Try up to 5 passes of JSON parsing and quote/backslash stripping
  for (let i = 0; i < 5; i++) {
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\\"') && val.endsWith('\\"'))) {
      try {
        const parsed = JSON.parse(val);
        if (typeof parsed === "string") {
          val = parsed.trim();
          continue;
        }
      } catch {
        // Fallback to manual stripping below
      }
    }

    // Strip leading and trailing double quotes, single quotes, and backslashes
    const stripped = val
      .replace(/^["'\\]+/, "")
      .replace(/["'\\]+$/, "")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .trim();

    if (stripped === val) break;
    val = stripped;
  }

  // Final check to strip any remaining outer quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.substring(1, val.length - 1).trim();
  }

  return val;
}

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
      await this.supabase.from("activity_log").insert({
        action,
        entity_type: "settings",
        entity_id: entityId,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking activity log
    }
  }

  async getSettings(): Promise<WebsiteSettingsEntity | null> {
    try {
      const { data, error } = await this.supabase
        .from("settings")
        .select("*");

      if (error || !data) {
        return this.getDefaultSettings();
      }

      const settingsMap: Record<string, string> = {};
      data.forEach((row) => {
        if (row.key) {
          settingsMap[row.key] = parseSettingValue(row.value);
        }
      });

      const companyNameEn = settingsMap.company_name_en || settingsMap.site_name || "Rukn Al Assi";
      const companyNameAr = settingsMap.company_name_ar || "ركن العاصي";
      const companyNameKu = settingsMap.company_name_ku || "";

      return new WebsiteSettingsEntity({
        id: "settings-global",
        companyNameEn,
        companyNameAr,
        companyNameKu,
        taglineEn: settingsMap.tagline_en || "Engineering & Industrial Hydraulic Solutions",
        taglineAr: settingsMap.tagline_ar || "حلول الهيدروليك والهندسة الصناعية",
        taglineKu: settingsMap.tagline_ku || "",
        legalNameEn: settingsMap.legal_name_en || "",
        legalNameAr: settingsMap.legal_name_ar || "",
        legalNameKu: settingsMap.legal_name_ku || "",
        descriptionEn: settingsMap.description_en || "",
        descriptionAr: settingsMap.description_ar || "",
        descriptionKu: settingsMap.description_ku || "",
        registrationInfoEn: settingsMap.registration_info_en || "",
        registrationInfoAr: settingsMap.registration_info_ar || "",
        registrationInfoKu: settingsMap.registration_info_ku || "",
        industryEn: settingsMap.industry_en || "",
        industryAr: settingsMap.industry_ar || "",
        industryKu: settingsMap.industry_ku || "",
        foundedYear: settingsMap.founded_year || "",
        missionEn: settingsMap.mission_en || "",
        missionAr: settingsMap.mission_ar || "",
        missionKu: settingsMap.mission_ku || "",
        visionEn: settingsMap.vision_en || "",
        visionAr: settingsMap.vision_ar || "",
        visionKu: settingsMap.vision_ku || "",
        logoUrl: settingsMap.logo_url || null,
        logoDarkUrl: settingsMap.logo_dark_url || null,
        faviconUrl: settingsMap.favicon_url || null,
        ogImageUrl: settingsMap.og_image_url || null,
        email: settingsMap.contact_email || "info@ruknalassi.com",
        phone: settingsMap.contact_phone || "+964 750 000 0000",
        phoneSecondary: settingsMap.phone_secondary || null,
        addressEn: settingsMap.address_en || "Erbil, Iraq",
        addressAr: settingsMap.address_ar || "أربيل، العراق",
        addressKu: settingsMap.address_ku || "",
        googleMapsUrl: settingsMap.google_maps_url || null,
        latitude: settingsMap.latitude ? parseFloat(settingsMap.latitude) : null,
        longitude: settingsMap.longitude ? parseFloat(settingsMap.longitude) : null,
        workingHoursEn: settingsMap.working_hours_en || "Mon - Sat: 8:00 AM - 5:00 PM",
        workingHoursAr: settingsMap.working_hours_ar || "الإثنين - السبت: 8:00 صباحاً - 5:00 مساءً",
        workingHoursKu: settingsMap.working_hours_ku || "",
        facebookUrl: settingsMap.facebook_url || null,
        twitterUrl: settingsMap.twitter_url || null,
        linkedinUrl: settingsMap.linkedin_url || null,
        instagramUrl: settingsMap.instagram_url || null,
        youtubeUrl: settingsMap.youtube_url || null,
        whatsappNumber: settingsMap.whatsapp_number || null,
        seoTitleEn: settingsMap.seo_title_en || companyNameEn,
        seoTitleAr: settingsMap.seo_title_ar || companyNameAr,
        seoTitleKu: settingsMap.seo_title_ku || companyNameKu,
        seoDescriptionEn: settingsMap.seo_description_en || "",
        seoDescriptionAr: settingsMap.seo_description_ar || "",
        seoDescriptionKu: settingsMap.seo_description_ku || "",
        updatedAt: new Date(),
      });
    } catch {
      return this.getDefaultSettings();
    }
  }

  private getDefaultSettings(): WebsiteSettingsEntity {
    return new WebsiteSettingsEntity({
      id: "settings-global",
      companyNameEn: "Rukn Al Assi",
      companyNameAr: "ركن العاصي",
      companyNameKu: "",
      taglineEn: "Engineering & Industrial Hydraulic Solutions",
      taglineAr: "حلول الهيدروليك والهندسة الصناعية",
      taglineKu: "",
      legalNameEn: "",
      legalNameAr: "",
      legalNameKu: "",
      descriptionEn: "",
      descriptionAr: "",
      descriptionKu: "",
      registrationInfoEn: "",
      registrationInfoAr: "",
      registrationInfoKu: "",
      industryEn: "",
      industryAr: "",
      industryKu: "",
      foundedYear: "",
      missionEn: "",
      missionAr: "",
      missionKu: "",
      visionEn: "",
      visionAr: "",
      visionKu: "",
      logoUrl: null,
      logoDarkUrl: null,
      faviconUrl: null,
      ogImageUrl: null,
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
      seoTitleEn: "Rukn Al Assi",
      seoTitleAr: "ركن العاصي",
      seoTitleKu: "",
      seoDescriptionEn: "",
      seoDescriptionAr: "",
      seoDescriptionKu: "",
      updatedAt: new Date(),
    });
  }

  async updateSettings(input: UpdateWebsiteSettingsInput): Promise<WebsiteSettingsEntity> {
    const keysToUpsert: { key: string; value: string }[] = [
      { key: "site_name", value: input.companyNameEn || "Rukn Al Assi" },
      { key: "company_name_en", value: input.companyNameEn || "" },
      { key: "company_name_ar", value: input.companyNameAr || "" },
      { key: "company_name_ku", value: input.companyNameKu || "" },
      { key: "tagline_en", value: input.taglineEn || "" },
      { key: "tagline_ar", value: input.taglineAr || "" },
      { key: "tagline_ku", value: input.taglineKu || "" },

      { key: "legal_name_en", value: input.legalNameEn || "" },
      { key: "legal_name_ar", value: input.legalNameAr || "" },
      { key: "legal_name_ku", value: input.legalNameKu || "" },
      { key: "description_en", value: input.descriptionEn || "" },
      { key: "description_ar", value: input.descriptionAr || "" },
      { key: "description_ku", value: input.descriptionKu || "" },
      { key: "registration_info_en", value: input.registrationInfoEn || "" },
      { key: "registration_info_ar", value: input.registrationInfoAr || "" },
      { key: "registration_info_ku", value: input.registrationInfoKu || "" },
      { key: "industry_en", value: input.industryEn || "" },
      { key: "industry_ar", value: input.industryAr || "" },
      { key: "industry_ku", value: input.industryKu || "" },
      { key: "founded_year", value: input.foundedYear || "" },
      { key: "mission_en", value: input.missionEn || "" },
      { key: "mission_ar", value: input.missionAr || "" },
      { key: "mission_ku", value: input.missionKu || "" },
      { key: "vision_en", value: input.visionEn || "" },
      { key: "vision_ar", value: input.visionAr || "" },
      { key: "vision_ku", value: input.visionKu || "" },

      { key: "contact_email", value: input.email || "" },
      { key: "contact_phone", value: input.phone || "" },
      { key: "phone_secondary", value: input.phoneSecondary || "" },
      { key: "whatsapp_number", value: input.whatsappNumber || "" },
      { key: "address_en", value: input.addressEn || "" },
      { key: "address_ar", value: input.addressAr || "" },
      { key: "address_ku", value: input.addressKu || "" },
      { key: "working_hours_en", value: input.workingHoursEn || "" },
      { key: "working_hours_ar", value: input.workingHoursAr || "" },
      { key: "working_hours_ku", value: input.workingHoursKu || "" },
      { key: "google_maps_url", value: input.googleMapsUrl || "" },
      { key: "latitude", value: input.latitude !== null && input.latitude !== undefined ? String(input.latitude) : "" },
      { key: "longitude", value: input.longitude !== null && input.longitude !== undefined ? String(input.longitude) : "" },

      { key: "facebook_url", value: input.facebookUrl || "" },
      { key: "twitter_url", value: input.twitterUrl || "" },
      { key: "linkedin_url", value: input.linkedinUrl || "" },
      { key: "instagram_url", value: input.instagramUrl || "" },
      { key: "youtube_url", value: input.youtubeUrl || "" },

      { key: "logo_url", value: input.logoUrl || "" },
      { key: "logo_dark_url", value: input.logoDarkUrl || "" },
      { key: "favicon_url", value: input.faviconUrl || "" },
      { key: "og_image_url", value: input.ogImageUrl || "" },
    ];

    const cleanedKeysToUpsert = keysToUpsert.map((item) => ({
      key: item.key,
      value: parseSettingValue(item.value),
    }));

    try {
      await this.supabase.from("settings").upsert(cleanedKeysToUpsert);
    } catch {
      // Ignore non-fatal storage errors
    }

    const updated = (await this.getSettings())!;
    await this.logActivity("updated", updated.id, "Website Settings & Branding");
    return updated;
  }
}
