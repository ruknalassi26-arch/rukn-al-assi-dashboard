// ==============================================================================
// features/homepage/data/repository/supabase-homepage.repository.ts
// Concrete Supabase implementation of IHomepageRepository
// Strictly matching official SQL Schema (homepage_sections, homepage_section_translations, etc.)
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, InsertTables, UpdateTables } from "@core/types/database.types";
import type { IHomepageRepository } from "../../domain/repositories/i-homepage.repository";
import {
  HeroSectionEntity,
  AboutPreviewEntity,
  CompanyStatEntity,
  FeaturedServiceEntity,
  FeaturedProductEntity,
  FeaturedProjectEntity,
  ClientEntity,
  CertificateEntity,
  ContactCtaEntity,
} from "../../domain/entities/homepage.entity";
import {
  toHeroSectionEntity,
  toAboutPreviewEntity,
  toCompanyStatEntity,
  toFeaturedServiceEntity,
  toFeaturedProductEntity,
  toFeaturedProjectEntity,
  toClientEntity,
  toCertificateEntity,
  toContactCtaEntity,
} from "../mapper/homepage.mapper";
import type { HeroSettingsDTO } from "../dto/homepage.dto";

export class SupabaseHomepageRepository implements IHomepageRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // ============================================================================
  // TAB 1: HERO SECTION (homepage_sections where section_key = 'hero')
  // ============================================================================
  async getHeroSection(): Promise<HeroSectionEntity> {
    try {
      const { data, error } = await (this.supabase.from("homepage_sections" as any) as any)
        .select("*")
        .eq("section_key", "hero")
        .maybeSingle();

      if (!error && data) {
        return toHeroSectionEntity(data);
      }
    } catch {}

    // Sensible fallback matching schema
    return new HeroSectionEntity({
      id: "hero-1",
      sectionKey: "hero",
      isVisible: true,
      mediaType: "video",
      videoUrl: null,
      videoPosterUrl: null,
      videoMobileUrl: null,
      overlayOpacity: 40,
      titleEn: "Engineering & Industrial Hydraulic Solutions",
      titleAr: "حلول الهيدروليك والهندسة الصناعية",
      titleKu: "چارەسەرەکانی هایدرۆلیکی و ئەندازیاری پیشەسازی",
      subtitleEn: "Leading provider of high-pressure hydraulic equipment and spare parts across Iraq.",
      subtitleAr: "المزود الرائد لمعدات الهيدروليك وقطع الغيار في العراق.",
      subtitleKu: "پێشەنگ لە دابینکردنی کەرەستە و پارچەی یەدەگی هایدرۆلیکی لە سەرانسەری عێراق.",
      bodyEn: "Delivering world-class heavy industrial machinery, hydraulic cylinders, pumps, valves, and precision turnkey automation.",
      bodyAr: "نقدم أحدث الآلات والمعدات الهيدروليكية الثقيلة، والاسطوانات، والمضخات، والصمامات، وحلول الأتمتة المتقدمة.",
      bodyKu: "پێشکەشکردنی ئامێر و کەرەستەی پیشەسازی قورس و سلندەر و پەمپ و ڤاڵڤ و سیستەمی ئۆتۆمەیشنی پێشکەوتوو.",
      primaryButtonTextEn: "Explore Products",
      primaryButtonTextAr: "استكشف المنتجات",
      primaryButtonTextKu: "بڕوانە بەرهەمەکان",
      primaryButtonUrl: "/products",
      secondaryButtonTextEn: "Contact Us",
      secondaryButtonTextAr: "اتصل بنا",
      secondaryButtonTextKu: "پەیوەندیمان پێوە بکە",
      secondaryButtonUrl: "/contact",
      updatedAt: new Date(),
    });
  }

  async updateHeroSection(data: Partial<HeroSectionEntity>): Promise<HeroSectionEntity> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    const { data: existingRow } = await (this.supabase.from("homepage_sections" as any) as any)
      .select("*")
      .eq("section_key", "hero")
      .maybeSingle();

    const currentSettings = (existingRow?.settings || {}) as Partial<HeroSettingsDTO>;
    const updatedSettings: HeroSettingsDTO = {
      media_type: data.mediaType ?? currentSettings.media_type ?? "video",
      video_url: data.videoUrl !== undefined ? data.videoUrl : (currentSettings.video_url ?? null),
      video_poster_url: data.videoPosterUrl !== undefined ? data.videoPosterUrl : (currentSettings.video_poster_url ?? null),
      video_mobile_url: data.videoMobileUrl !== undefined ? data.videoMobileUrl : (currentSettings.video_mobile_url ?? null),
      overlay_opacity: typeof data.overlayOpacity === "number" ? data.overlayOpacity : (currentSettings.overlay_opacity ?? 40),

      title_en: data.titleEn !== undefined ? data.titleEn : (currentSettings.title_en ?? ""),
      title_ar: data.titleAr !== undefined ? data.titleAr : (currentSettings.title_ar ?? ""),
      title_ku: data.titleKu !== undefined ? (data.titleKu ?? "") : (currentSettings.title_ku ?? ""),

      subtitle_en: data.subtitleEn !== undefined ? (data.subtitleEn ?? "") : (currentSettings.subtitle_en ?? ""),
      subtitle_ar: data.subtitleAr !== undefined ? (data.subtitleAr ?? "") : (currentSettings.subtitle_ar ?? ""),
      subtitle_ku: data.subtitleKu !== undefined ? (data.subtitleKu ?? "") : (currentSettings.subtitle_ku ?? ""),

      body_en: data.bodyEn !== undefined ? (data.bodyEn ?? "") : (currentSettings.body_en ?? ""),
      body_ar: data.bodyAr !== undefined ? (data.bodyAr ?? "") : (currentSettings.body_ar ?? ""),
      body_ku: data.bodyKu !== undefined ? (data.bodyKu ?? "") : (currentSettings.body_ku ?? ""),

      primary_button_text_en: data.primaryButtonTextEn !== undefined ? (data.primaryButtonTextEn ?? "") : (currentSettings.primary_button_text_en ?? ""),
      primary_button_text_ar: data.primaryButtonTextAr !== undefined ? (data.primaryButtonTextAr ?? "") : (currentSettings.primary_button_text_ar ?? ""),
      primary_button_text_ku: data.primaryButtonTextKu !== undefined ? (data.primaryButtonTextKu ?? "") : (currentSettings.primary_button_text_ku ?? ""),
      primary_button_url: data.primaryButtonUrl !== undefined ? (data.primaryButtonUrl ?? "") : (currentSettings.primary_button_url ?? ""),

      secondary_button_text_en: data.secondaryButtonTextEn !== undefined ? (data.secondaryButtonTextEn ?? "") : (currentSettings.secondary_button_text_en ?? ""),
      secondary_button_text_ar: data.secondaryButtonTextAr !== undefined ? (data.secondaryButtonTextAr ?? "") : (currentSettings.secondary_button_text_ar ?? ""),
      secondary_button_text_ku: data.secondaryButtonTextKu !== undefined ? (data.secondaryButtonTextKu ?? "") : (currentSettings.secondary_button_text_ku ?? ""),
      secondary_button_url: data.secondaryButtonUrl !== undefined ? data.secondaryButtonUrl : (currentSettings.secondary_button_url ?? null),
    };

    let validAdminId: string | null = null;
    if (user?.id) {
      const { data: profile } = await (this.supabase.from("admin_profiles" as any) as any)
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      if (profile) validAdminId = profile.id;
    }

    const updatePayload: Record<string, any> = {
      settings: updatedSettings,
      updated_by: validAdminId,
      updated_at: new Date().toISOString(),
    };

    if (data.isVisible !== undefined) {
      updatePayload.is_visible = data.isVisible;
    }

    if (existingRow?.id) {
      const { data: updatedRows, error } = await (this.supabase.from("homepage_sections" as any) as any)
        .update(updatePayload)
        .eq("section_key", "hero")
        .select();

      if (error) {
        throw new Error(error.message);
      }
      if (!updatedRows || updatedRows.length === 0) {
        throw new Error("Database RLS Permission Error: Could not update homepage_sections. Please run the provided SQL policy in Supabase SQL Editor.");
      }
    } else {
      const { data: insertedRows, error } = await (this.supabase.from("homepage_sections" as any) as any)
        .insert({
          section_key: "hero",
          is_visible: data.isVisible ?? true,
          sort_order: 0,
          ...updatePayload,
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }
      if (!insertedRows || insertedRows.length === 0) {
        throw new Error("Database RLS Permission Error: Could not insert homepage_sections. Please run the provided SQL policy in Supabase SQL Editor.");
      }
    }

    await this.logActivity("updated", "homepage_sections", `Hero Section: ${data.titleEn ?? "Hero"}`);
    return this.getHeroSection();
  }

  // ============================================================================
  // TAB 2: ABOUT PREVIEW (homepage_sections section_key = 'about')
  // ============================================================================
  async getAboutPreview(): Promise<AboutPreviewEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("homepage_sections" as any) as any)
        .select("*, homepage_section_translations(*)")
        .eq("section_key", "about")
        .maybeSingle();

      if (!error && data) {
        return toAboutPreviewEntity(data);
      }
    } catch {}

    return new AboutPreviewEntity({
      id: "about-preview-1",
      titleEn: "About Rukn Al Assi",
      titleAr: "عن ركن العاصي",
      titleKu: "دەربارەی ڕوکن ئەلعاسی",
      subtitleEn: "Pioneering Hydraulic Excellence",
      subtitleAr: "الريادة في التميز الهيدروليكي",
      subtitleKu: "پێشەنگ لە هەڵبژاردنی هیدرۆلیکی",
      descriptionEn: "Pioneering Hydraulic Excellence Since 2010. Rukn Al Assi is a trusted industrial leader delivering high-pressure hydraulic systems.",
      descriptionAr: "الريادة في التميز الهيدروليكي منذ 2010. شركة ركن العاصي رائدة في تقديم الأنظمة الهيدروليكية ذات الضغط العالي.",
      descriptionKu: "پێشەنگ لە هەڵبژاردنی هیدرۆلیکی لە ساڵی 2010ەوە. کۆمپانیای ڕوکن ئەلعاسی ڕابەرێکی باوەڕپێکراوی پیشەسازییە.",
      imageUrl: "/about-1.jpg",
      buttonTextEn: "Learn More",
      buttonTextAr: "اعرف المزيد",
      buttonTextKu: "زیاتر بزانە",
      buttonUrl: "/about",
      highlightsEn: ["14+ Years Experience", "250+ Completed Projects", "99% Satisfaction"],
      highlightsAr: ["خبرة أكثر من 14 عاماً", "أكثر من 250 مشروع منجز", "نسبة رضا 99%"],
      highlightsKu: ["زیاتر لە 14 ساڵ ئەزموون", "زیاتر لە 250 پرۆژەی تەواوکراو", "ڕێژەی ڕەزامەندی 99%"],
      status: "active",
      updatedAt: new Date(),
    });
  }

  async updateAboutPreview(data: Partial<AboutPreviewEntity>): Promise<AboutPreviewEntity> {
    const existing = await this.getAboutPreview();

    let sectionId = existing?.id && existing.id !== "about-preview-1" ? existing.id : null;

    if (!sectionId) {
      const { data: sectionRow } = await (this.supabase.from("homepage_sections" as any) as any)
        .select("id")
        .eq("section_key", "about")
        .maybeSingle();
      if (sectionRow?.id) {
        sectionId = sectionRow.id;
      }
    }

    const currentHighlights = {
      en: data.highlightsEn ?? existing?.highlightsEn ?? ["14+ Years Experience", "250+ Completed Projects", "99% Satisfaction"],
      ar: data.highlightsAr ?? existing?.highlightsAr ?? ["خبرة أكثر من 14 عاماً", "أكثر من 250 مشروع منجز", "نسبة رضا 99%"],
      ku: data.highlightsKu ?? existing?.highlightsKu ?? ["زیاتر لە 14 ساڵ ئەزموون", "زیاتر لە 250 پرۆژەی تەواوکراو", "ڕێژەی ڕەزامەندی 99%"],
    };

    const sectionPayload: UpdateTables<"homepage_sections"> = {
      settings: { highlights: currentHighlights } as any,
    };
    if (data.status !== undefined) sectionPayload.is_visible = data.status === "active";

    if (sectionId) {
      await (this.supabase.from("homepage_sections" as any) as any)
        .update(sectionPayload)
        .eq("id", sectionId);
    } else {
      const insertSectionPayload: InsertTables<"homepage_sections"> = {
        section_key: "about",
        is_visible: data.status === "active",
        sort_order: 2,
        settings: { highlights: currentHighlights } as any,
      };

      const { data: newSection, error: sectionErr } = await (this.supabase.from("homepage_sections" as any) as any)
        .insert(insertSectionPayload)
        .select()
        .single();

      if (sectionErr || !newSection) throw new Error(sectionErr?.message ?? "Failed to create about section");
      sectionId = newSection.id;
    }

    const imageUrl = data.imageUrl ?? existing?.imageUrl ?? null;
    const buttonUrl = data.buttonUrl ?? existing?.buttonUrl ?? null;

    const translationsPayload = [
      {
        section_id: sectionId,
        language_code: "en",
        title: data.titleEn ?? existing?.titleEn ?? "About Rukn Al Assi",
        subtitle: data.subtitleEn ?? existing?.subtitleEn ?? null,
        body: data.descriptionEn ?? existing?.descriptionEn ?? null,
        image_url: imageUrl,
        cta_label: data.buttonTextEn ?? existing?.buttonTextEn ?? null,
        cta_url: buttonUrl,
      },
      {
        section_id: sectionId,
        language_code: "ar",
        title: data.titleAr ?? existing?.titleAr ?? "عن ركن العاصي",
        subtitle: data.subtitleAr ?? existing?.subtitleAr ?? null,
        body: data.descriptionAr ?? existing?.descriptionAr ?? null,
        image_url: imageUrl,
        cta_label: data.buttonTextAr ?? existing?.buttonTextAr ?? null,
        cta_url: buttonUrl,
      },
      {
        section_id: sectionId,
        language_code: "ku",
        title: data.titleKu ?? existing?.titleKu ?? null,
        subtitle: data.subtitleKu ?? existing?.subtitleKu ?? null,
        body: data.descriptionKu ?? existing?.descriptionKu ?? null,
        image_url: imageUrl,
        cta_label: data.buttonTextKu ?? existing?.buttonTextKu ?? null,
        cta_url: buttonUrl,
      },
    ];

    await (this.supabase.from("homepage_section_translations" as any) as any)
      .upsert(translationsPayload, { onConflict: "section_id,language_code" });

    await this.logActivity("updated", "homepage_sections", "About Section");
    return (await this.getAboutPreview())!;
  }

  // ============================================================================
  // TAB 3: COMPANY STATS (stats & stat_translations)
  // ============================================================================
  async getCompanyStats(): Promise<CompanyStatEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("stats" as any) as any)
        .select("*, stat_translations(*)")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(toCompanyStatEntity);
      }
    } catch {}

    return [
      new CompanyStatEntity({ id: "stat-1", titleEn: "Projects Delivered", titleAr: "مشروع منجز", value: "250+", icon: "Building", sortOrder: 1, status: "active", createdAt: new Date(), updatedAt: new Date() }),
      new CompanyStatEntity({ id: "stat-2", titleEn: "Happy Clients", titleAr: "عميل سعيد", value: "180+", icon: "Users", sortOrder: 2, status: "active", createdAt: new Date(), updatedAt: new Date() }),
    ];
  }

  async createCompanyStat(stat: Omit<CompanyStatEntity, "id" | "createdAt" | "updatedAt">): Promise<CompanyStatEntity> {
    const dbStatus = stat.status === "active" ? "published" : "draft";

    const statsPayload: InsertTables<"stats"> = {
      number_value: stat.value,
      icon: stat.icon || "Building",
      sort_order: stat.sortOrder ?? 0,
      status: dbStatus as any,
    };

    const { data: row, error } = await (this.supabase.from("stats" as any) as any)
      .insert(statsPayload)
      .select()
      .single();

    if (error || !row) throw new Error(error?.message ?? "Failed to create statistic");

    const transPayload = [
      {
        stat_id: row.id,
        language_code: "en",
        label: stat.titleEn,
      },
      {
        stat_id: row.id,
        language_code: "ar",
        label: stat.titleAr,
      },
      {
        stat_id: row.id,
        language_code: "ku",
        label: stat.titleKu || null,
      },
    ];

    await (this.supabase.from("stat_translations" as any) as any).insert(transPayload);
    await this.logActivity("created", "stats", stat.titleEn);

    const created = await this.getCompanyStats();
    return created.find((s) => s.id === row.id) || created[0];
  }

  async updateCompanyStat(id: string, stat: Partial<CompanyStatEntity>): Promise<CompanyStatEntity> {
    const existingList = await this.getCompanyStats();
    const existing = existingList.find((s) => s.id === id);

    const updatePayload: UpdateTables<"stats"> = {};
    if (stat.value !== undefined) updatePayload.number_value = stat.value;
    if (stat.icon !== undefined) updatePayload.icon = stat.icon;
    if (stat.sortOrder !== undefined) updatePayload.sort_order = stat.sortOrder;
    if (stat.status !== undefined) updatePayload.status = (stat.status === "active" ? "published" : "draft") as any;

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await (this.supabase.from("stats" as any) as any)
        .update(updatePayload)
        .eq("id", id);
      if (error) throw new Error(error.message);
    }

    const transPayload = [
      {
        stat_id: id,
        language_code: "en",
        label: stat.titleEn ?? existing?.titleEn ?? "",
      },
      {
        stat_id: id,
        language_code: "ar",
        label: stat.titleAr ?? existing?.titleAr ?? "",
      },
      {
        stat_id: id,
        language_code: "ku",
        label: stat.titleKu ?? existing?.titleKu ?? null,
      },
    ];

    await (this.supabase.from("stat_translations" as any) as any)
      .upsert(transPayload, { onConflict: "stat_id,language_code" });

    await this.logActivity("updated", "stats", stat.titleEn ?? existing?.titleEn);
    const updatedList = await this.getCompanyStats();
    return updatedList.find((s) => s.id === id) || updatedList[0];
  }

  async deleteCompanyStat(id: string): Promise<void> {
    await (this.supabase.from("stat_translations" as any) as any)
      .delete()
      .eq("stat_id", id);

    const { error } = await (this.supabase.from("stats" as any) as any)
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    await this.logActivity("deleted", "stats", id);
  }

  async reorderCompanyStats(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await (this.supabase.from("stats" as any) as any)
        .update({ sort_order: i + 1 })
        .eq("id", orderedIds[i]);
    }
  }

  async bulkDeleteCompanyStats(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await (this.supabase.from("stat_translations" as any) as any)
      .delete()
      .in("stat_id", ids);

    await (this.supabase.from("stats" as any) as any)
      .delete()
      .in("id", ids);
  }

  async bulkUpdateCompanyStatsStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    if (ids.length === 0) return;
    const dbStatus = status === "active" ? "published" : "draft";
    await (this.supabase.from("stats" as any) as any)
      .update({ status: dbStatus })
      .in("id", ids);
  }

  // ============================================================================
  // TAB 4: FEATURED SERVICES (services)
  // ============================================================================
  async getFeaturedServices(): Promise<FeaturedServiceEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("services" as any) as any)
        .select("*, service_translations(*)")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map(toFeaturedServiceEntity);
      }
    } catch {}
    return [];
  }

  async toggleServiceFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {
    const payload: UpdateTables<"services"> = { is_featured: isFeatured };
    if (sortOrder !== undefined) payload.sort_order = sortOrder;
    await this.supabase.from("services").update(payload).eq("id", id);
  }

  async reorderFeaturedServices(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.supabase.from("services").update({ sort_order: i + 1 }).eq("id", orderedIds[i]);
    }
  }

  // ============================================================================
  // TAB 5: FEATURED PRODUCTS (products)
  // ============================================================================
  async getFeaturedProducts(): Promise<FeaturedProductEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("products" as any) as any)
        .select("*, product_translations(*)")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map(toFeaturedProductEntity);
      }
    } catch {}
    return [];
  }

  async toggleProductFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {
    const payload: UpdateTables<"products"> = { is_featured: isFeatured };
    if (sortOrder !== undefined) payload.sort_order = sortOrder;
    await this.supabase.from("products").update(payload).eq("id", id);
  }

  async reorderFeaturedProducts(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.supabase.from("products").update({ sort_order: i + 1 }).eq("id", orderedIds[i]);
    }
  }

  // ============================================================================
  // TAB 6: FEATURED PROJECTS (projects)
  // ============================================================================
  async getFeaturedProjects(): Promise<FeaturedProjectEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("projects" as any) as any)
        .select("*, project_translations(*), project_images(*)")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map(toFeaturedProjectEntity);
      }
    } catch {}
    return [];
  }

  async toggleProjectFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {
    const payload: UpdateTables<"projects"> = { is_featured: isFeatured };
    if (sortOrder !== undefined) payload.sort_order = sortOrder;
    await this.supabase.from("projects").update(payload).eq("id", id);
  }

  async reorderFeaturedProjects(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.supabase.from("projects").update({ sort_order: i + 1 }).eq("id", orderedIds[i]);
    }
  }

  // ============================================================================
  // TAB 7: CLIENTS & PARTNERS (clients)
  // ============================================================================
  async getClients(): Promise<ClientEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("clients" as any) as any)
        .select("*, client_translations(*)")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map(toClientEntity);
      }

      const { data: rawData, error: rawErr } = await (this.supabase.from("clients" as any) as any)
        .select("*")
        .order("sort_order", { ascending: true });

      if (!rawErr && rawData) {
        return rawData.map(toClientEntity);
      }
    } catch {}
    return [];
  }

  async createClient(client: Omit<ClientEntity, "id" | "createdAt" | "updatedAt">): Promise<ClientEntity> {
    const nameVal = client.nameEn || client.nameAr || "";
    const dbStatus = client.status === "draft" ? "draft" : "published";
    const basePayload: any = {
      logo_url: client.logoUrl || null,
      website_url: client.websiteUrl || null,
      sort_order: client.sortOrder ?? 0,
      status: dbStatus,
    };

    // 1. Insert core record with dbStatus ('published' / 'draft')
    let { data, error } = await (this.supabase.from("clients" as any) as any)
      .insert(basePayload)
      .select()
      .single();

    // Fallback if check constraint 23514 rejects 'published' and expects 'active'
    if (error && error.code === "23514") {
      basePayload.status = client.status ?? "active";
      const res = await (this.supabase.from("clients" as any) as any)
        .insert(basePayload)
        .select()
        .single();
      data = res.data;
      error = res.error;
    }

    // 2. If client creation succeeded, handle translations
    if (!error && data) {
      const clientId = data.id;
      try {
        const transPayload = [
          { client_id: clientId, language_code: "en", name: client.nameEn || nameVal },
          { client_id: clientId, language_code: "ar", name: client.nameAr || nameVal },
        ];
        await (this.supabase.from("client_translations" as any) as any).insert(transPayload);
      } catch {}

      await this.logActivity("created", "clients", nameVal);
      return toClientEntity({
        ...data,
        client_translations: [
          { language_code: "en", name: client.nameEn || nameVal },
          { language_code: "ar", name: client.nameAr || nameVal },
        ],
      });
    }

    // Fallback: If core insert failed with PGRST204, try with name column
    if (error && error.code === "PGRST204") {
      basePayload.name = nameVal;
      const res = await (this.supabase.from("clients" as any) as any)
        .insert(basePayload)
        .select()
        .single();
      data = res.data;
      error = res.error;
    }

    if (error || !data) throw new Error(error?.message ?? "Failed to create client");

    await this.logActivity("created", "clients", nameVal);
    return toClientEntity(data);
  }

  async updateClient(id: string, client: Partial<ClientEntity>): Promise<ClientEntity> {
    const payload: any = {};
    const nameVal = client.nameEn || client.nameAr;
    if (client.logoUrl !== undefined) payload.logo_url = client.logoUrl;
    if (client.websiteUrl !== undefined) payload.website_url = client.websiteUrl;
    if (client.sortOrder !== undefined) payload.sort_order = client.sortOrder;
    if (client.status !== undefined) {
      payload.status = client.status === "draft" ? "draft" : "published";
    }

    let { data, error } = await (this.supabase.from("clients" as any) as any)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error && error.code === "23514" && client.status !== undefined) {
      payload.status = client.status;
      const res = await (this.supabase.from("clients" as any) as any)
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      data = res.data;
      error = res.error;
    }

    if (!error && data) {
      if (nameVal !== undefined) {
        try {
          const transPayload = [
            { client_id: id, language_code: "en", name: client.nameEn || nameVal },
            { client_id: id, language_code: "ar", name: client.nameAr || nameVal },
          ];
          await (this.supabase.from("client_translations" as any) as any)
            .upsert(transPayload, { onConflict: "client_id,language_code" });
        } catch {}
      }
    }

    if (error || !data) throw new Error(error?.message ?? "Failed to update client");

    await this.logActivity("updated", "clients", nameVal || id);
    return toClientEntity(data);
  }

  async deleteClient(id: string): Promise<void> {
    const { error } = await this.supabase.from("clients").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await this.logActivity("deleted", "clients", id);
  }

  async reorderClients(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.supabase.from("clients").update({ sort_order: i + 1 }).eq("id", orderedIds[i]);
    }
  }

  async bulkDeleteClients(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await this.supabase.from("clients").delete().in("id", ids);
  }

  async bulkUpdateClientsStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    if (ids.length === 0) return;
    await this.supabase.from("clients").update({ status }).in("id", ids);
  }

  // ============================================================================
  // TAB 8: CERTIFICATES (certificates)
  // ============================================================================
  async getCertificates(): Promise<CertificateEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from("certificates")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map(toCertificateEntity);
      }
    } catch {}
    return [];
  }

  async createCertificate(cert: Omit<CertificateEntity, "id" | "createdAt" | "updatedAt">): Promise<CertificateEntity> {
    const payload: InsertTables<"certificates"> = {
      title_en: cert.titleEn,
      title_ar: cert.titleAr,
      description_en: null,
      description_ar: null,
      image: cert.image || null,
      issue_date: cert.issueDate || null,
      expiry_date: null,
      organization: null,
      sort_order: cert.sortOrder ?? 0,
      status: cert.status ?? "active",
    };

    const { data, error } = await this.supabase
      .from("certificates")
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create certificate");

    await this.logActivity("created", "certificates", cert.titleEn);
    return toCertificateEntity(data);
  }

  async updateCertificate(id: string, cert: Partial<CertificateEntity>): Promise<CertificateEntity> {
    const payload: UpdateTables<"certificates"> = {};
    if (cert.titleEn !== undefined) payload.title_en = cert.titleEn;
    if (cert.titleAr !== undefined) payload.title_ar = cert.titleAr;
    if (cert.image !== undefined) payload.image = cert.image;
    if (cert.issueDate !== undefined) payload.issue_date = cert.issueDate;
    if (cert.sortOrder !== undefined) payload.sort_order = cert.sortOrder;
    if (cert.status !== undefined) payload.status = cert.status;

    const { data, error } = await this.supabase
      .from("certificates")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update certificate");

    await this.logActivity("updated", "certificates", data.title_en);
    return toCertificateEntity(data);
  }

  async deleteCertificate(id: string): Promise<void> {
    const { error } = await this.supabase.from("certificates").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await this.logActivity("deleted", "certificates", id);
  }

  async reorderCertificates(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.supabase.from("certificates").update({ sort_order: i + 1 }).eq("id", orderedIds[i]);
    }
  }

  async bulkDeleteCertificates(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await this.supabase.from("certificates").delete().in("id", ids);
  }

  async bulkUpdateCertificatesStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    if (ids.length === 0) return;
    await this.supabase.from("certificates").update({ status }).in("id", ids);
  }

  // ============================================================================
  // TAB 9: CONTACT CTA BANNER (homepage_sections & homepage_section_translations)
  // ============================================================================
  async getContactCta(): Promise<ContactCtaEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("homepage_sections" as any) as any)
        .select("*, homepage_section_translations(*)")
        .eq("section_key", "contact_cta")
        .maybeSingle();

      if (!error && data) {
        return toContactCtaEntity(data);
      }
    } catch {}

    return new ContactCtaEntity({
      id: "contact-cta-section",
      headingEn: "Ready to Upgrade Your Industrial Hydraulics?",
      headingAr: "هل أنت جاهز لتطوير أنظمتك الهيدروليكية الصناعية؟",
      headingKu: null,
      descriptionEn: "Contact our technical engineering team for custom quotes and product specifications.",
      descriptionAr: "تواصل مع فريقنا الهندسي للحصول على عروض أسعار ومواصفات مخصصة.",
      descriptionKu: null,
      buttonTextEn: "Request Quotation",
      buttonTextAr: "طلب عرض سعر",
      buttonTextKu: null,
      buttonUrl: "/rfq",
      backgroundImage: "/cta-bg.jpg",
      status: "active",
      updatedAt: new Date(),
    });
  }

  async updateContactCta(data: Partial<ContactCtaEntity>): Promise<ContactCtaEntity> {
    const existing = await this.getContactCta();

    const { data: sectionRow } = await (this.supabase.from("homepage_sections" as any) as any)
      .select("id")
      .eq("section_key", "contact_cta")
      .maybeSingle();

    let sectionId = sectionRow?.id;

    const sectionPayload: UpdateTables<"homepage_sections"> = {};
    if (data.status !== undefined) sectionPayload.is_visible = data.status === "active";

    if (sectionId) {
      if (Object.keys(sectionPayload).length > 0) {
        await (this.supabase.from("homepage_sections" as any) as any)
          .update(sectionPayload)
          .eq("id", sectionId);
      }
    } else {
      const insertSectionPayload: InsertTables<"homepage_sections"> = {
        section_key: "contact_cta",
        is_visible: data.status !== "draft",
        sort_order: 9,
        settings: {},
      };

      const { data: newSection, error: sectionErr } = await (this.supabase.from("homepage_sections" as any) as any)
        .insert(insertSectionPayload)
        .select()
        .single();

      if (sectionErr || !newSection) throw new Error(sectionErr?.message ?? "Failed to create contact_cta section");
      sectionId = newSection.id;
    }

    const bgImage = data.backgroundImage !== undefined ? data.backgroundImage : existing?.backgroundImage ?? null;
    const btnUrl = data.buttonUrl !== undefined ? data.buttonUrl : existing?.buttonUrl ?? null;

    const translationsPayload = [
      {
        section_id: sectionId,
        language_code: "en",
        title: data.headingEn ?? existing?.headingEn ?? "Ready to Upgrade Your Industrial Hydraulics?",
        subtitle: null,
        body: data.descriptionEn !== undefined ? data.descriptionEn : existing?.descriptionEn ?? null,
        image_url: bgImage,
        cta_label: data.buttonTextEn !== undefined ? data.buttonTextEn : existing?.buttonTextEn ?? null,
        cta_url: btnUrl,
      },
      {
        section_id: sectionId,
        language_code: "ar",
        title: data.headingAr ?? existing?.headingAr ?? "هل أنت جاهز لتطوير أنظمتك الهيدروليكية الصناعية؟",
        subtitle: null,
        body: data.descriptionAr !== undefined ? data.descriptionAr : existing?.descriptionAr ?? null,
        image_url: bgImage,
        cta_label: data.buttonTextAr !== undefined ? data.buttonTextAr : existing?.buttonTextAr ?? null,
        cta_url: btnUrl,
      },
      {
        section_id: sectionId,
        language_code: "ku",
        title: data.headingKu !== undefined ? data.headingKu : existing?.headingKu ?? null,
        subtitle: null,
        body: data.descriptionKu !== undefined ? data.descriptionKu : existing?.descriptionKu ?? null,
        image_url: bgImage,
        cta_label: data.buttonTextKu !== undefined ? data.buttonTextKu : existing?.buttonTextKu ?? null,
        cta_url: btnUrl,
      },
    ];

    await (this.supabase.from("homepage_section_translations" as any) as any)
      .upsert(translationsPayload, { onConflict: "section_id,language_code" });

    await this.logActivity("updated", "homepage_sections", "Contact CTA");
    return (await this.getContactCta())!;
  }

  // ============================================================================
  // ACTIVITY LOGGING (activity_log)
  // ============================================================================
  async logActivity(
    action: string,
    entityType: string,
    entityTitle?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      let validAdminId: string | null = null;
      if (userData?.user?.id) {
        const { data: profile } = await (this.supabase.from("admin_profiles" as any) as any)
          .select("id")
          .eq("id", userData.user.id)
          .maybeSingle();
        if (profile) validAdminId = profile.id;
      }

      await (this.supabase.from("activity_log" as any) as any).insert({
        action,
        entity_type: entityType,
        entity_id: null,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: validAdminId,
      });
    } catch {
      // Non-blocking activity log
    }
  }
}

