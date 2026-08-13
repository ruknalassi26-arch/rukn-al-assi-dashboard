// ==============================================================================
// features/homepage/data/repository/supabase-homepage.repository.ts
// Concrete Supabase implementation of IHomepageRepository
// Strictly matching official SQL Schema (homepage_sections, homepage_section_translations, etc.)
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, InsertTables, UpdateTables } from "@core/types/database.types";
import type { IHomepageRepository } from "../../domain/repositories/i-homepage.repository";
import {
  HeroSlideEntity,
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
  toHeroSlideEntity,
  toAboutPreviewEntity,
  toCompanyStatEntity,
  toFeaturedServiceEntity,
  toFeaturedProductEntity,
  toFeaturedProjectEntity,
  toClientEntity,
  toCertificateEntity,
  toContactCtaEntity,
} from "../mapper/homepage.mapper";

export class SupabaseHomepageRepository implements IHomepageRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // ============================================================================
  // TAB 1: HERO SECTION (homepage_hero_slides & homepage_hero_slide_translations)
  // ============================================================================
  // ============================================================================
  // TAB 1: HERO SECTION (homepage_hero_slides & homepage_hero_slide_translations)
  // ============================================================================
  async getHeroSlides(): Promise<HeroSlideEntity[]> {
    // 1. Try querying homepage_hero_slides
    try {
      const { data, error } = await (this.supabase.from("homepage_hero_slides" as any) as any)
        .select("*, homepage_hero_slide_translations(*)")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(toHeroSlideEntity);
      }
    } catch {}

    // 2. Fallback to homepage_sections (section_key = 'hero') if homepage_hero_slides table does not exist
    try {
      const { data: heroSection } = await (this.supabase.from("homepage_sections" as any) as any)
        .select("*, homepage_section_translations(*)")
        .eq("section_key", "hero")
        .maybeSingle();

      if (heroSection) {
        const settings = heroSection.settings || {};

        // If settings.slides array exists, map all items in settings.slides
        if (Array.isArray(settings.slides) && settings.slides.length > 0) {
          return settings.slides
            .map((s: any) => new HeroSlideEntity({
              id: s.id || heroSection.id,
              titleEn: s.title_en || "",
              titleAr: s.title_ar || "",
              titleKu: s.title_ku || null,
              subtitleEn: s.subtitle_en || null,
              subtitleAr: s.subtitle_ar || null,
              subtitleKu: s.subtitle_ku || null,
              bodyEn: s.body_en || null,
              bodyAr: s.body_ar || null,
              bodyKu: s.body_ku || null,
              primaryButtonTextEn: s.primary_button_text_en || "Explore Products",
              primaryButtonTextAr: s.primary_button_text_ar || "استكشف المنتجات",
              primaryButtonTextKu: s.primary_button_text_ku || null,
              primaryButtonUrl: s.primary_button_url || "/products",
              secondaryButtonTextEn: s.secondary_button_text_en || "Contact Us",
              secondaryButtonTextAr: s.secondary_button_text_ar || "اتصل بنا",
              secondaryButtonUrl: s.secondary_button_url || "/contact",
              backgroundImage: s.background_image || "/hero-banner.jpg",
              overlayOpacity: s.overlay_opacity ?? 40,
              status: s.is_active !== false ? "active" : "draft",
              sortOrder: s.sort_order ?? 1,
              createdAt: new Date(s.created_at || heroSection.updated_at || Date.now()),
              updatedAt: new Date(s.updated_at || heroSection.updated_at || Date.now()),
            }))
            .sort((a: HeroSlideEntity, b: HeroSlideEntity) => a.sortOrder - b.sortOrder);
        }

        // Fallback for single section row when settings.slides does not exist yet
        const transList = heroSection.homepage_section_translations || [];
        const en = transList.find((t: any) => t.language_code === "en") || {};
        const ar = transList.find((t: any) => t.language_code === "ar") || {};
        const ku = transList.find((t: any) => t.language_code === "ku") || {};

        return [
          new HeroSlideEntity({
            id: heroSection.id,
            titleEn: en.title || "Engineering & Industrial Hydraulic Solutions",
            titleAr: ar.title || "حلول الهيدروليك والهندسة الصناعية",
            titleKu: ku.title || null,
            subtitleEn: en.subtitle || null,
            subtitleAr: ar.subtitle || null,
            subtitleKu: ku.subtitle || null,
            bodyEn: en.body || null,
            bodyAr: ar.body || null,
            bodyKu: ku.body || null,
            primaryButtonTextEn: en.cta_label || settings.primary_button_text_en || "Explore Products",
            primaryButtonTextAr: ar.cta_label || settings.primary_button_text_ar || "استكشف المنتجات",
            primaryButtonTextKu: ku.cta_label || null,
            primaryButtonUrl: en.cta_url || ar.cta_url || ku.cta_url || settings.primary_button_url || "/products",
            secondaryButtonTextEn: settings.secondary_button_text_en || "Contact Us",
            secondaryButtonTextAr: settings.secondary_button_text_ar || "اتصل بنا",
            secondaryButtonUrl: settings.secondary_button_url || "/contact",
            backgroundImage: en.image_url || ar.image_url || ku.image_url || settings.background_image || "/hero-banner.jpg",
            overlayOpacity: settings.overlay_opacity ?? 40,
            status: heroSection.is_visible ? "active" : "draft",
            sortOrder: heroSection.sort_order ?? 1,
            createdAt: new Date(heroSection.updated_at || Date.now()),
            updatedAt: new Date(heroSection.updated_at || Date.now()),
          }),
        ];
      }
    } catch {}

    // 3. Fallback mock if database table is completely empty
    return [
      new HeroSlideEntity({
        id: "hero-1",
        titleEn: "Engineering & Industrial Hydraulic Solutions",
        titleAr: "حلول الهيدروليك والهندسة الصناعية",
        subtitleEn: "Leading provider of high-pressure hydraulic equipment and spare parts across Iraq.",
        subtitleAr: "المزود الرائد لمعدات الهيدروليك وقطع الغيار في العراق.",
        primaryButtonTextEn: "Explore Products",
        primaryButtonTextAr: "استكشف المنتجات",
        primaryButtonUrl: "/products",
        secondaryButtonTextEn: "Contact Us",
        secondaryButtonTextAr: "اتصل بنا",
        secondaryButtonUrl: "/contact",
        backgroundImage: "/hero-banner.jpg",
        overlayOpacity: 50,
        status: "active",
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];
  }

  async getHeroSlideById(id: string): Promise<HeroSlideEntity | null> {
    try {
      const { data, error } = await (this.supabase.from("homepage_hero_slides" as any) as any)
        .select("*, homepage_hero_slide_translations(*)")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return toHeroSlideEntity(data);
      }
    } catch {}

    const slides = await this.getHeroSlides();
    return slides.find((s) => s.id === id) || null;
  }

  async createHeroSlide(slide: Omit<HeroSlideEntity, "id" | "createdAt" | "updatedAt">): Promise<HeroSlideEntity> {
    // 1. Try inserting into homepage_hero_slides
    try {
      const slidePayload: InsertTables<"homepage_hero_slides"> = {
        is_active: slide.status === "active",
        sort_order: slide.sortOrder ?? 0,
        overlay_opacity: slide.overlayOpacity ?? 40,
      };

      const { data: row, error } = await (this.supabase.from("homepage_hero_slides" as any) as any)
        .insert(slidePayload)
        .select()
        .single();

      if (!error && row) {
        const translationsPayload = [
          {
            slide_id: row.id,
            language_code: "en",
            title: slide.titleEn,
            subtitle: slide.subtitleEn || null,
            body: slide.bodyEn || null,
            image_url: slide.backgroundImage || null,
            cta_label: slide.primaryButtonTextEn || null,
            cta_url: slide.primaryButtonUrl || null,
          },
          {
            slide_id: row.id,
            language_code: "ar",
            title: slide.titleAr,
            subtitle: slide.subtitleAr || null,
            body: slide.bodyAr || null,
            image_url: slide.backgroundImage || null,
            cta_label: slide.primaryButtonTextAr || null,
            cta_url: slide.primaryButtonUrl || null,
          },
          {
            slide_id: row.id,
            language_code: "ku",
            title: slide.titleKu || null,
            subtitle: slide.subtitleKu || null,
            body: slide.bodyKu || null,
            image_url: slide.backgroundImage || null,
            cta_label: slide.primaryButtonTextKu || null,
            cta_url: slide.primaryButtonUrl || null,
          },
        ];

        await (this.supabase.from("homepage_hero_slide_translations" as any) as any).insert(translationsPayload);
        await this.logActivity("created", "homepage_hero_slides", slide.titleEn);
        const slides = await this.getHeroSlides();
        return slides.find((s) => s.id === row.id) || slides[0];
      }

      if (error && error.code !== "PGRST205" && error.code !== "42P01" && !error.message?.includes("homepage_hero_slides")) {
        throw new Error(error.message);
      }
    } catch (e: any) {
      if (e?.message && !e.message.includes("homepage_hero_slides")) {
        throw e;
      }
    }

    // 2. Fallback to homepage_sections (store multiple slides in settings.slides array)
    const existingSlides = await this.getHeroSlides();
    const newSlideId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `hero-slide-${Date.now()}`;

    const newSlideObj = {
      id: newSlideId,
      title_en: slide.titleEn,
      title_ar: slide.titleAr,
      title_ku: slide.titleKu || null,
      subtitle_en: slide.subtitleEn || null,
      subtitle_ar: slide.subtitleAr || null,
      subtitle_ku: slide.subtitleKu || null,
      body_en: slide.bodyEn || null,
      body_ar: slide.bodyAr || null,
      body_ku: slide.bodyKu || null,
      primary_button_text_en: slide.primaryButtonTextEn || null,
      primary_button_text_ar: slide.primaryButtonTextAr || null,
      primary_button_text_ku: slide.primaryButtonTextKu || null,
      primary_button_url: slide.primaryButtonUrl || null,
      secondary_button_text_en: slide.secondaryButtonTextEn || null,
      secondary_button_text_ar: slide.secondaryButtonTextAr || null,
      secondary_button_text_ku: slide.secondaryButtonTextKu || null,
      secondary_button_url: slide.secondaryButtonUrl || null,
      background_image: slide.backgroundImage || null,
      overlay_opacity: slide.overlayOpacity ?? 40,
      is_active: slide.status === "active",
      sort_order: slide.sortOrder ?? (existingSlides.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const existingSlideObjects = existingSlides.map((s) => ({
      id: s.id,
      title_en: s.titleEn,
      title_ar: s.titleAr,
      title_ku: s.titleKu || null,
      subtitle_en: s.subtitleEn || null,
      subtitle_ar: s.subtitleAr || null,
      subtitle_ku: s.subtitleKu || null,
      body_en: s.bodyEn || null,
      body_ar: s.bodyAr || null,
      body_ku: s.bodyKu || null,
      primary_button_text_en: s.primaryButtonTextEn || null,
      primary_button_text_ar: s.primaryButtonTextAr || null,
      primary_button_text_ku: s.primaryButtonTextKu || null,
      primary_button_url: s.primaryButtonUrl || null,
      secondary_button_text_en: s.secondaryButtonTextEn || null,
      secondary_button_text_ar: s.secondaryButtonTextAr || null,
      secondary_button_text_ku: s.secondaryButtonTextKu || null,
      secondary_button_url: s.secondaryButtonUrl || null,
      background_image: s.backgroundImage || null,
      overlay_opacity: s.overlayOpacity ?? 40,
      is_active: s.status === "active",
      sort_order: s.sortOrder ?? 1,
      created_at: s.createdAt?.toISOString() || new Date().toISOString(),
      updated_at: s.updatedAt?.toISOString() || new Date().toISOString(),
    }));

    const allSlideObjects = [...existingSlideObjects, newSlideObj];

    const { data: existingHeroSection } = await (this.supabase.from("homepage_sections" as any) as any)
      .select("*")
      .eq("section_key", "hero")
      .maybeSingle();

    let sectionId: string;
    const currentSettings = existingHeroSection?.settings || {};
    const updatedSettings = { ...currentSettings, slides: allSlideObjects };

    if (existingHeroSection?.id) {
      sectionId = existingHeroSection.id;
      await (this.supabase.from("homepage_sections" as any) as any)
        .update({
          settings: updatedSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sectionId);
    } else {
      const sectionPayload: InsertTables<"homepage_sections"> = {
        section_key: "hero",
        is_visible: true,
        sort_order: 0,
        settings: updatedSettings as any,
      };

      const { data: sectionRow, error: sectionErr } = await (this.supabase.from("homepage_sections" as any) as any)
        .insert(sectionPayload)
        .select()
        .single();

      if (sectionErr || !sectionRow) {
        throw new Error(sectionErr?.message ?? "Failed to create hero slide");
      }
      sectionId = sectionRow.id;
    }

    await this.logActivity("created", "homepage_sections", slide.titleEn);
    const updatedSlidesList = await this.getHeroSlides();
    return updatedSlidesList.find((s) => s.id === newSlideId) || updatedSlidesList[updatedSlidesList.length - 1];
  }

  async updateHeroSlide(id: string, slide: Partial<HeroSlideEntity>): Promise<HeroSlideEntity> {
    const slides = await this.getHeroSlides();
    const existing = slides.find((s) => s.id === id);

    const imageUrl = (slide.backgroundImage !== undefined && slide.backgroundImage !== "")
      ? slide.backgroundImage
      : (existing?.backgroundImage || null);

    const ctaUrl = slide.primaryButtonUrl ?? existing?.primaryButtonUrl ?? null;

    try {
      const updatePayload: UpdateTables<"homepage_hero_slides"> = {};
      if (slide.sortOrder !== undefined) updatePayload.sort_order = slide.sortOrder;
      if (slide.status !== undefined) updatePayload.is_active = slide.status === "active";
      if (slide.overlayOpacity !== undefined) updatePayload.overlay_opacity = slide.overlayOpacity;

      let slideErr: any = null;
      if (Object.keys(updatePayload).length > 0) {
        const { error } = await (this.supabase.from("homepage_hero_slides" as any) as any)
          .update(updatePayload)
          .eq("id", id);
        slideErr = error;
      }

      if (!slideErr || (slideErr.code !== "PGRST205" && slideErr.code !== "42P01")) {
        const transPayload: any[] = [
          {
            slide_id: id,
            language_code: "en",
            title: slide.titleEn ?? existing?.titleEn ?? "",
            subtitle: slide.subtitleEn ?? existing?.subtitleEn ?? null,
            body: slide.bodyEn ?? existing?.bodyEn ?? null,
            image_url: imageUrl,
            cta_label: slide.primaryButtonTextEn ?? existing?.primaryButtonTextEn ?? null,
            cta_url: ctaUrl,
          },
          {
            slide_id: id,
            language_code: "ar",
            title: slide.titleAr ?? existing?.titleAr ?? "",
            subtitle: slide.subtitleAr ?? existing?.subtitleAr ?? null,
            body: slide.bodyAr ?? existing?.bodyAr ?? null,
            image_url: imageUrl,
            cta_label: slide.primaryButtonTextAr ?? existing?.primaryButtonTextAr ?? null,
            cta_url: ctaUrl,
          },
          {
            slide_id: id,
            language_code: "ku",
            title: slide.titleKu ?? existing?.titleKu ?? null,
            subtitle: slide.subtitleKu ?? existing?.subtitleKu ?? null,
            body: slide.bodyKu ?? existing?.bodyKu ?? null,
            image_url: imageUrl,
            cta_label: slide.primaryButtonTextKu ?? existing?.primaryButtonTextKu ?? null,
            cta_url: ctaUrl,
          },
        ];

        const { error: transErr } = await (this.supabase.from("homepage_hero_slide_translations" as any) as any)
          .upsert(transPayload, { onConflict: "slide_id,language_code" });

        if (!transErr) {
          await this.logActivity("updated", "homepage_hero_slides", slide.titleEn ?? existing?.titleEn);
          const updatedList = await this.getHeroSlides();
          return updatedList.find((s) => s.id === id) || updatedList[0];
        }
      }
    } catch {}

    // Fallback to homepage_sections (update selected slide inside settings.slides array)
    const existingSlidesList = await this.getHeroSlides();
    const updatedSlideObjects = existingSlidesList.map((s) => {
      if (s.id !== id) {
        return {
          id: s.id,
          title_en: s.titleEn,
          title_ar: s.titleAr,
          title_ku: s.titleKu || null,
          subtitle_en: s.subtitleEn || null,
          subtitle_ar: s.subtitleAr || null,
          subtitle_ku: s.subtitleKu || null,
          body_en: s.bodyEn || null,
          body_ar: s.bodyAr || null,
          body_ku: s.bodyKu || null,
          primary_button_text_en: s.primaryButtonTextEn || null,
          primary_button_text_ar: s.primaryButtonTextAr || null,
          primary_button_text_ku: s.primaryButtonTextKu || null,
          primary_button_url: s.primaryButtonUrl || null,
          secondary_button_text_en: s.secondaryButtonTextEn || null,
          secondary_button_text_ar: s.secondaryButtonTextAr || null,
          secondary_button_text_ku: s.secondaryButtonTextKu || null,
          secondary_button_url: s.secondaryButtonUrl || null,
          background_image: s.backgroundImage || null,
          overlay_opacity: s.overlayOpacity ?? 40,
          is_active: s.status === "active",
          sort_order: s.sortOrder ?? 1,
          created_at: s.createdAt?.toISOString() || new Date().toISOString(),
          updated_at: s.updatedAt?.toISOString() || new Date().toISOString(),
        };
      }

      return {
        id: s.id,
        title_en: slide.titleEn ?? s.titleEn,
        title_ar: slide.titleAr ?? s.titleAr,
        title_ku: slide.titleKu !== undefined ? slide.titleKu : (s.titleKu || null),
        subtitle_en: slide.subtitleEn !== undefined ? slide.subtitleEn : (s.subtitleEn || null),
        subtitle_ar: slide.subtitleAr !== undefined ? slide.subtitleAr : (s.subtitleAr || null),
        subtitle_ku: slide.subtitleKu !== undefined ? slide.subtitleKu : (s.subtitleKu || null),
        body_en: slide.bodyEn !== undefined ? slide.bodyEn : (s.bodyEn || null),
        body_ar: slide.bodyAr !== undefined ? slide.bodyAr : (s.bodyAr || null),
        body_ku: slide.bodyKu !== undefined ? slide.bodyKu : (s.bodyKu || null),
        primary_button_text_en: slide.primaryButtonTextEn ?? s.primaryButtonTextEn ?? null,
        primary_button_text_ar: slide.primaryButtonTextAr ?? s.primaryButtonTextAr ?? null,
        primary_button_text_ku: slide.primaryButtonTextKu !== undefined ? slide.primaryButtonTextKu : (s.primaryButtonTextKu || null),
        primary_button_url: ctaUrl,
        secondary_button_text_en: slide.secondaryButtonTextEn ?? s.secondaryButtonTextEn ?? null,
        secondary_button_text_ar: slide.secondaryButtonTextAr ?? s.secondaryButtonTextAr ?? null,
        secondary_button_text_ku: slide.secondaryButtonTextKu !== undefined ? slide.secondaryButtonTextKu : (s.secondaryButtonTextKu || null),
        secondary_button_url: slide.secondaryButtonUrl ?? s.secondaryButtonUrl ?? null,
        background_image: imageUrl,
        overlay_opacity: slide.overlayOpacity ?? s.overlayOpacity ?? 40,
        is_active: slide.status !== undefined ? slide.status === "active" : s.status === "active",
        sort_order: slide.sortOrder ?? s.sortOrder ?? 1,
        created_at: s.createdAt?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    const { data: existingHeroSection } = await (this.supabase.from("homepage_sections" as any) as any)
      .select("id, settings")
      .eq("section_key", "hero")
      .maybeSingle();

    if (existingHeroSection?.id) {
      const currentSettings = existingHeroSection.settings || {};
      await (this.supabase.from("homepage_sections" as any) as any)
        .update({
          settings: { ...currentSettings, slides: updatedSlideObjects },
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingHeroSection.id);
    }

    await this.logActivity("updated", "homepage_sections", slide.titleEn ?? existing?.titleEn);
    const updatedList = await this.getHeroSlides();
    return updatedList.find((s) => s.id === id) || updatedList[0];
  }

  async deleteHeroSlide(id: string): Promise<void> {
    try {
      const { error } = await (this.supabase.from("homepage_hero_slides" as any) as any)
        .delete()
        .eq("id", id);
      if (!error) {
        await this.logActivity("deleted", "homepage_hero_slides", id);
        return;
      }
    } catch {}

    const existingSlidesList = await this.getHeroSlides();
    const remainingSlideObjects = existingSlidesList
      .filter((s) => s.id !== id)
      .map((s) => ({
        id: s.id,
        title_en: s.titleEn,
        title_ar: s.titleAr,
        title_ku: s.titleKu || null,
        subtitle_en: s.subtitleEn || null,
        subtitle_ar: s.subtitleAr || null,
        subtitle_ku: s.subtitleKu || null,
        body_en: s.bodyEn || null,
        body_ar: s.bodyAr || null,
        body_ku: s.bodyKu || null,
        primary_button_text_en: s.primaryButtonTextEn || null,
        primary_button_text_ar: s.primaryButtonTextAr || null,
        primary_button_text_ku: s.primaryButtonTextKu || null,
        primary_button_url: s.primaryButtonUrl || null,
        secondary_button_text_en: s.secondaryButtonTextEn || null,
        secondary_button_text_ar: s.secondaryButtonTextAr || null,
        secondary_button_text_ku: s.secondaryButtonTextKu || null,
        secondary_button_url: s.secondaryButtonUrl || null,
        background_image: s.backgroundImage || null,
        overlay_opacity: s.overlayOpacity ?? 40,
        is_active: s.status === "active",
        sort_order: s.sortOrder ?? 1,
        created_at: s.createdAt?.toISOString() || new Date().toISOString(),
        updated_at: s.updatedAt?.toISOString() || new Date().toISOString(),
      }));

    const { data: existingHeroSection } = await (this.supabase.from("homepage_sections" as any) as any)
      .select("id, settings")
      .eq("section_key", "hero")
      .maybeSingle();

    if (existingHeroSection?.id) {
      const currentSettings = existingHeroSection.settings || {};
      await (this.supabase.from("homepage_sections" as any) as any)
        .update({
          settings: { ...currentSettings, slides: remainingSlideObjects },
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingHeroSection.id);
    }

    await this.logActivity("deleted", "homepage_sections", id);
  }

  async reorderHeroSlides(orderedIds: string[]): Promise<void> {
    try {
      let isHeroSlidesTable = true;
      for (let i = 0; i < orderedIds.length; i++) {
        const { error } = await (this.supabase.from("homepage_hero_slides" as any) as any)
          .update({ sort_order: i + 1 })
          .eq("id", orderedIds[i]);
        if (error) {
          isHeroSlidesTable = false;
          break;
        }
      }
      if (isHeroSlidesTable) return;
    } catch {}

    const existingSlidesList = await this.getHeroSlides();
    const idToOrder = new Map(orderedIds.map((id, index) => [id, index + 1]));

    const reorderedSlideObjects = existingSlidesList.map((s) => ({
      id: s.id,
      title_en: s.titleEn,
      title_ar: s.titleAr,
      title_ku: s.titleKu || null,
      subtitle_en: s.subtitleEn || null,
      subtitle_ar: s.subtitleAr || null,
      subtitle_ku: s.subtitleKu || null,
      body_en: s.bodyEn || null,
      body_ar: s.bodyAr || null,
      body_ku: s.bodyKu || null,
      primary_button_text_en: s.primaryButtonTextEn || null,
      primary_button_text_ar: s.primaryButtonTextAr || null,
      primary_button_text_ku: s.primaryButtonTextKu || null,
      primary_button_url: s.primaryButtonUrl || null,
      secondary_button_text_en: s.secondaryButtonTextEn || null,
      secondary_button_text_ar: s.secondaryButtonTextAr || null,
      secondary_button_text_ku: s.secondaryButtonTextKu || null,
      secondary_button_url: s.secondaryButtonUrl || null,
      background_image: s.backgroundImage || null,
      overlay_opacity: s.overlayOpacity ?? 40,
      is_active: s.status === "active",
      sort_order: idToOrder.get(s.id) ?? s.sortOrder ?? 1,
      created_at: s.createdAt?.toISOString() || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })).sort((a, b) => a.sort_order - b.sort_order);

    const { data: existingHeroSection } = await (this.supabase.from("homepage_sections" as any) as any)
      .select("id, settings")
      .eq("section_key", "hero")
      .maybeSingle();

    if (existingHeroSection?.id) {
      const currentSettings = existingHeroSection.settings || {};
      await (this.supabase.from("homepage_sections" as any) as any)
        .update({
          settings: { ...currentSettings, slides: reorderedSlideObjects },
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingHeroSection.id);
    }
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
  // TAB 3: COMPANY STATS (company_statistics)
  // ============================================================================
  async getCompanyStats(): Promise<CompanyStatEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from("company_statistics")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(toCompanyStatEntity);
      }
    } catch {}

    return [
      new CompanyStatEntity({ id: "stat-1", titleEn: "Projects Delivered", titleAr: "مشروع منجز", value: "250+", icon: "check-circle", sortOrder: 1, status: "active", createdAt: new Date(), updatedAt: new Date() }),
      new CompanyStatEntity({ id: "stat-2", titleEn: "Happy Clients", titleAr: "عميل سعيد", value: "180+", icon: "users", sortOrder: 2, status: "active", createdAt: new Date(), updatedAt: new Date() }),
    ];
  }

  async createCompanyStat(stat: Omit<CompanyStatEntity, "id" | "createdAt" | "updatedAt">): Promise<CompanyStatEntity> {
    const payload: InsertTables<"company_statistics"> = {
      title_en: stat.titleEn,
      title_ar: stat.titleAr,
      value: stat.value,
      icon: stat.icon || null,
      sort_order: stat.sortOrder ?? 0,
      status: stat.status ?? "active",
    };

    const { data, error } = await this.supabase
      .from("company_statistics")
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create company statistic");

    await this.logActivity("created", "company_statistics", stat.titleEn);
    return toCompanyStatEntity(data);
  }

  async updateCompanyStat(id: string, stat: Partial<CompanyStatEntity>): Promise<CompanyStatEntity> {
    const payload: UpdateTables<"company_statistics"> = {};
    if (stat.titleEn !== undefined) payload.title_en = stat.titleEn;
    if (stat.titleAr !== undefined) payload.title_ar = stat.titleAr;
    if (stat.value !== undefined) payload.value = stat.value;
    if (stat.icon !== undefined) payload.icon = stat.icon;
    if (stat.sortOrder !== undefined) payload.sort_order = stat.sortOrder;
    if (stat.status !== undefined) payload.status = stat.status;

    const { data, error } = await this.supabase
      .from("company_statistics")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update company statistic");

    await this.logActivity("updated", "company_statistics", data.title_en);
    return toCompanyStatEntity(data);
  }

  async deleteCompanyStat(id: string): Promise<void> {
    const { error } = await this.supabase.from("company_statistics").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await this.logActivity("deleted", "company_statistics", id);
  }

  async reorderCompanyStats(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.supabase.from("company_statistics").update({ sort_order: i + 1 }).eq("id", orderedIds[i]);
    }
  }

  async bulkDeleteCompanyStats(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await this.supabase.from("company_statistics").delete().in("id", ids);
  }

  async bulkUpdateCompanyStatsStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    if (ids.length === 0) return;
    await this.supabase.from("company_statistics").update({ status }).in("id", ids);
  }

  // ============================================================================
  // TAB 4: FEATURED SERVICES (services)
  // ============================================================================
  async getFeaturedServices(): Promise<FeaturedServiceEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from("services")
        .select("*")
        .eq("is_featured", true)
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
      const { data, error } = await this.supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
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
      const { data, error } = await this.supabase
        .from("projects")
        .select("*")
        .eq("is_featured", true)
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
      const { data, error } = await this.supabase
        .from("clients")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map(toClientEntity);
      }
    } catch {}
    return [];
  }

  async createClient(client: Omit<ClientEntity, "id" | "createdAt" | "updatedAt">): Promise<ClientEntity> {
    const payload: InsertTables<"clients"> = {
      name_en: client.nameEn,
      name_ar: client.nameAr,
      logo_url: client.logoUrl || null,
      website_url: client.websiteUrl || null,
      sort_order: client.sortOrder ?? 0,
      status: client.status ?? "active",
    };

    const { data, error } = await this.supabase
      .from("clients")
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create client");

    await this.logActivity("created", "clients", client.nameEn);
    return toClientEntity(data);
  }

  async updateClient(id: string, client: Partial<ClientEntity>): Promise<ClientEntity> {
    const payload: UpdateTables<"clients"> = {};
    if (client.nameEn !== undefined) payload.name_en = client.nameEn;
    if (client.nameAr !== undefined) payload.name_ar = client.nameAr;
    if (client.logoUrl !== undefined) payload.logo_url = client.logoUrl;
    if (client.websiteUrl !== undefined) payload.website_url = client.websiteUrl;
    if (client.sortOrder !== undefined) payload.sort_order = client.sortOrder;
    if (client.status !== undefined) payload.status = client.status;

    const { data, error } = await this.supabase
      .from("clients")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update client");

    await this.logActivity("updated", "clients", data.name_en);
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
  // TAB 9: CONTACT CTA BANNER (homepage_contact_cta)
  // ============================================================================
  async getContactCta(): Promise<ContactCtaEntity | null> {
    try {
      const { data, error } = await this.supabase.from("homepage_contact_cta").select("*").limit(1).maybeSingle();
      if (!error && data) {
        return toContactCtaEntity(data);
      }
    } catch {}

    return new ContactCtaEntity({
      id: "cta-1",
      headingEn: "Ready to Upgrade Your Industrial Hydraulics?",
      headingAr: "هل أنت جاهز لتطوير أنظمتك الهيدروليكية الصناعية؟",
      descriptionEn: "Contact our technical engineering team for custom quotes and product specifications.",
      descriptionAr: "تواصل مع فريقنا الهندسي للحصول على عروض أسعار ومواصفات مخصصة.",
      buttonTextEn: "Request Quotation",
      buttonTextAr: "طلب عرض سعر",
      buttonUrl: "/rfq",
      backgroundImage: "/cta-bg.jpg",
      updatedAt: new Date(),
    });
  }

  async updateContactCta(data: Partial<ContactCtaEntity>): Promise<ContactCtaEntity> {
    const existing = await this.getContactCta();
    const payload: UpdateTables<"homepage_contact_cta"> = {};
    if (data.headingEn !== undefined) payload.heading_en = data.headingEn;
    if (data.headingAr !== undefined) payload.heading_ar = data.headingAr;
    if (data.descriptionEn !== undefined) payload.description_en = data.descriptionEn;
    if (data.descriptionAr !== undefined) payload.description_ar = data.descriptionAr;
    if (data.buttonTextEn !== undefined) payload.button_text_en = data.buttonTextEn;
    if (data.buttonTextAr !== undefined) payload.button_text_ar = data.buttonTextAr;
    if (data.buttonUrl !== undefined) payload.button_url = data.buttonUrl;
    if (data.backgroundImage !== undefined) payload.background_image = data.backgroundImage;

    if (existing?.id && existing.id !== "cta-1") {
      const { data: updated, error } = await this.supabase
        .from("homepage_contact_cta")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      if (!error && updated) {
        await this.logActivity("updated", "homepage_contact_cta", updated.heading_en);
        return toContactCtaEntity(updated);
      }
    } else {
      const insertPayload: InsertTables<"homepage_contact_cta"> = {
        heading_en: data.headingEn || "Ready to Upgrade Your Industrial Hydraulics?",
        heading_ar: data.headingAr || "هل أنت جاهز لتطوير أنظمتك الهيدروليكية الصناعية؟",
        description_en: data.descriptionEn || null,
        description_ar: data.descriptionAr || null,
        button_text_en: data.buttonTextEn || null,
        button_text_ar: data.buttonTextAr || null,
        button_url: data.buttonUrl || null,
        background_image: data.backgroundImage || null,
      };

      const { data: inserted, error } = await this.supabase
        .from("homepage_contact_cta")
        .insert(insertPayload)
        .select()
        .single();
      if (!error && inserted) {
        await this.logActivity("created", "homepage_contact_cta", inserted.heading_en);
        return toContactCtaEntity(inserted);
      }
    }

    return (await this.getContactCta())!;
  }

  // ============================================================================
  // ACTIVITY LOGGING (activity_logs)
  // ============================================================================
  async logActivity(action: string, entityType: string, entityTitle?: string, metadata?: Record<string, unknown>): Promise<void> {
    try {
      const user = (await this.supabase.auth.getUser()).data.user;
      await (this.supabase.from("activity_logs" as any) as any).insert({
        action: action as any,
        entity_type: "homepage",
        entity_id: null,
        entity_title: entityTitle || null,
        user_id: user?.id ?? null,
        user_email: user?.email ?? null,
        metadata: metadata || null,
      });
    } catch {}
  }
}
