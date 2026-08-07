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

      const settingsMap: Record<string, string | null> = {};
      data.forEach((row) => {
        settingsMap[row.key] = row.value;
      });

      return new WebsiteSettingsEntity({
        id: "settings-1",
        companyNameEn: settingsMap.site_name || "Rukn Al Assi",
        companyNameAr: "ركن العاصي",
        companyNameKu: "",
        taglineEn: "Engineering & Industrial Hydraulic Solutions",
        taglineAr: "حلول الهيدروليك والهندسة الصناعية",
        taglineKu: "",
        logoUrl: settingsMap.logo_url || null,
        logoDarkUrl: settingsMap.logo_url || null,
        faviconUrl: settingsMap.favicon_url || null,
        email: settingsMap.contact_email || "info@ruknalassi.com",
        phone: settingsMap.contact_phone || "+964 750 000 0000",
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
        whatsappNumber: settingsMap.whatsapp_number || null,
        seoTitleEn: settingsMap.site_name || "Rukn Al Assi",
        seoTitleAr: "ركن العاصي",
        seoTitleKu: "",
        seoDescriptionEn: "Leading provider of hydraulic solutions and spare parts.",
        seoDescriptionAr: "المزود الرائد لحلول الهيدروليك وقطع الغيار.",
        seoDescriptionKu: "",
        updatedAt: new Date(),
      });
    } catch {
      return this.getDefaultSettings();
    }
  }

  private getDefaultSettings(): WebsiteSettingsEntity {
    return new WebsiteSettingsEntity({
      id: "settings-1",
      companyNameEn: "Rukn Al Assi",
      companyNameAr: "ركن العاصي",
      companyNameKu: "",
      taglineEn: "Engineering & Industrial Hydraulic Solutions",
      taglineAr: "حلول الهيدروليك والهندسة الصناعية",
      taglineKu: "",
      logoUrl: null,
      logoDarkUrl: null,
      faviconUrl: null,
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
      seoDescriptionEn: "Leading provider of hydraulic solutions and spare parts.",
      seoDescriptionAr: "المزود الرائد لحلول الهيدروليك وقطع الغيار.",
      seoDescriptionKu: "",
      updatedAt: new Date(),
    });
  }

  async updateSettings(input: UpdateWebsiteSettingsInput): Promise<WebsiteSettingsEntity> {
    const keysToUpsert = [
      { key: "site_name", value: JSON.stringify(input.companyNameEn), category: "general", value_type: "string" },
      { key: "contact_email", value: JSON.stringify(input.email ?? "info@ruknalassi.com"), category: "general", value_type: "string" },
      { key: "contact_phone", value: JSON.stringify(input.phone ?? "+964 750 000 0000"), category: "general", value_type: "string" },
      { key: "whatsapp_number", value: JSON.stringify(input.whatsappNumber ?? ""), category: "general", value_type: "string" },
    ];

    if (input.logoUrl) {
      keysToUpsert.push({ key: "logo_url", value: JSON.stringify(input.logoUrl), category: "branding", value_type: "url" });
    }
    if (input.faviconUrl) {
      keysToUpsert.push({ key: "favicon_url", value: JSON.stringify(input.faviconUrl), category: "branding", value_type: "url" });
    }

    try {
      await this.supabase.from("settings").upsert(
        keysToUpsert.map((item) => ({ key: item.key, value: item.value }))
      );
    } catch {
      // Ignore
    }

    const updated = (await this.getSettings())!;
    await this.logActivity("updated", updated.id, "Website Settings & Branding");
    return updated;
  }
}
