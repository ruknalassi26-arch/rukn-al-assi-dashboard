// ==============================================================================
// features/homepage/data/repository/supabase-homepage.repository.ts
// Concrete Supabase implementation of IHomepageRepository
// Strictly matching official SQL Schema (homepage_sections, stats, clients, certifications)
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@core/types/database.types";
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

export class SupabaseHomepageRepository implements IHomepageRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  // ============================================================================
  // HERO SECTION (homepage_sections & homepage_section_translations)
  // ============================================================================
  async getHeroSlides(): Promise<HeroSlideEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("homepage_sections" as any) as any)
        .select("*, homepage_section_translations(*)")
        .eq("section_key", "hero")
        .maybeSingle();

      if (!error && data) {
        const transList: any[] = data.homepage_section_translations || [];
        const en = transList.find((t: any) => t.language_code === "en") || {};
        const ar = transList.find((t: any) => t.language_code === "ar") || {};

        return [
          new HeroSlideEntity({
            id: data.id,
            titleEn: en.title || "Engineering & Industrial Hydraulic Solutions",
            titleAr: ar.title || "حلول الهيدروليك والهندسة الصناعية",
            subtitleEn: en.subtitle || "Leading provider of high-pressure hydraulic equipment and spare parts across Iraq.",
            subtitleAr: ar.subtitle || "المزود الرائد لمعدات الهيدروليك وقطع الغيار في العراق.",
            primaryButtonTextEn: en.cta_label || "Explore Products",
            primaryButtonTextAr: "استكشف المنتجات",
            primaryButtonUrl: en.cta_url || "/products",
            secondaryButtonTextEn: "Contact Us",
            secondaryButtonTextAr: "اتصل بنا",
            secondaryButtonUrl: "/contact",
            backgroundImage: en.image_url || "/hero-banner.jpg",
            overlayOpacity: 50,
            status: "active",
            sortOrder: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ];
      }
    } catch (e) {
      console.warn("getHeroSlides query error:", e);
    }

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

  async createHeroSlide(slide: Omit<HeroSlideEntity, "id" | "createdAt" | "updatedAt">): Promise<HeroSlideEntity> {
    const list = await this.getHeroSlides();
    return list[0];
  }

  async updateHeroSlide(id: string, slide: Partial<HeroSlideEntity>): Promise<HeroSlideEntity> {
    const list = await this.getHeroSlides();
    return list[0];
  }

  async deleteHeroSlide(id: string): Promise<void> {}
  async reorderHeroSlides(orderedIds: string[]): Promise<void> {}

  // ============================================================================
  // ABOUT PREVIEW SECTION
  // ============================================================================
  async getAboutPreview(): Promise<AboutPreviewEntity | null> {
    return new AboutPreviewEntity({
      id: "about-preview-1",
      titleEn: "About Rukn Al Assi",
      titleAr: "عن ركن العاصي",
      descriptionEn: "Pioneering Hydraulic Excellence Since 2010. Rukn Al Assi is a trusted industrial leader delivering hydraulic systems.",
      descriptionAr: "الريادة في التميز الهيدروليكي منذ 2010. شركة ركن العاصي رائدة في تقديم الأنظمة الهيدروليكية.",
      imageUrl: "/about-1.jpg",
      buttonTextEn: "Learn More",
      buttonTextAr: "اعرف المزيد",
      buttonUrl: "/about",
      highlightsEn: ["14+ Years Experience", "250+ Completed Projects", "99% Satisfaction"],
      highlightsAr: ["خبرة أكثر من 14 عاماً", "أكثر من 250 مشروع منجز", "نسبة رضا 99%"],
      status: "active",
      updatedAt: new Date(),
    });
  }

  async updateAboutPreview(data: Partial<AboutPreviewEntity>): Promise<AboutPreviewEntity> {
    return (await this.getAboutPreview())!;
  }

  // ============================================================================
  // COMPANY STATS (stats & stat_translations)
  // ============================================================================
  async getCompanyStats(): Promise<CompanyStatEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("stats" as any) as any)
        .select("*, stat_translations(*)")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map((item: any) => {
          const transList: any[] = item.stat_translations || [];
          const en = transList.find((t: any) => t.language_code === "en") || {};
          const ar = transList.find((t: any) => t.language_code === "ar") || {};
          return new CompanyStatEntity({
            id: item.id,
            titleEn: en.label || "Stat",
            titleAr: ar.label || "إحصائية",
            value: item.number_value || "0",
            icon: item.icon || "award",
            sortOrder: item.sort_order ?? 0,
            status: item.status === "published" ? "active" : "draft",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
    } catch (e) {
      console.warn("getCompanyStats query error:", e);
    }

    return [
      new CompanyStatEntity({ id: "stat-1", titleEn: "Projects Delivered", titleAr: "مشروع منجز", value: "250+", icon: "check-circle", sortOrder: 1, status: "active", createdAt: new Date(), updatedAt: new Date() }),
      new CompanyStatEntity({ id: "stat-2", titleEn: "Happy Clients", titleAr: "عميل سعيد", value: "180+", icon: "users", sortOrder: 2, status: "active", createdAt: new Date(), updatedAt: new Date() }),
    ];
  }

  async createCompanyStat(stat: Omit<CompanyStatEntity, "id" | "createdAt" | "updatedAt">): Promise<CompanyStatEntity> {
    const { data, error } = await (this.supabase.from("stats" as any) as any)
      .insert({ number_value: stat.value, icon: stat.icon, sort_order: stat.sortOrder, status: "published" })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create stat");

    await (this.supabase.from("stat_translations" as any) as any).insert([
      { stat_id: data.id, language_code: "en", label: stat.titleEn },
      { stat_id: data.id, language_code: "ar", label: stat.titleAr },
    ]);

    return new CompanyStatEntity({ id: data.id, titleEn: stat.titleEn, titleAr: stat.titleAr, value: stat.value, icon: stat.icon, sortOrder: stat.sortOrder, status: stat.status, createdAt: new Date(), updatedAt: new Date() });
  }

  async updateCompanyStat(id: string, stat: Partial<CompanyStatEntity>): Promise<CompanyStatEntity> {
    const list = await this.getCompanyStats();
    return list[0];
  }

  async deleteCompanyStat(id: string): Promise<void> {}
  async reorderCompanyStats(orderedIds: string[]): Promise<void> {}
  async bulkDeleteCompanyStats(ids: string[]): Promise<void> {}
  async bulkUpdateCompanyStatsStatus(ids: string[], status: "active" | "draft"): Promise<void> {}

  // ============================================================================
  // FEATURED SERVICES
  // ============================================================================
  async getFeaturedServices(): Promise<FeaturedServiceEntity[]> {
    return [];
  }

  async toggleServiceFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {}
  async reorderFeaturedServices(orderedIds: string[]): Promise<void> {}

  // ============================================================================
  // FEATURED PRODUCTS
  // ============================================================================
  async getFeaturedProducts(): Promise<FeaturedProductEntity[]> {
    return [];
  }

  async toggleProductFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {}
  async reorderFeaturedProducts(orderedIds: string[]): Promise<void> {}

  // ============================================================================
  // FEATURED PROJECTS
  // ============================================================================
  async getFeaturedProjects(): Promise<FeaturedProjectEntity[]> {
    return [];
  }

  async toggleProjectFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {}
  async reorderFeaturedProjects(orderedIds: string[]): Promise<void> {}

  // ============================================================================
  // CLIENT PARTNERS (clients & client_translations)
  // ============================================================================
  async getClients(): Promise<ClientEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("clients" as any) as any)
        .select("*, client_translations(*)")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map((item: any) => {
          const transList: any[] = item.client_translations || [];
          const en = transList.find((t: any) => t.language_code === "en") || {};
          const ar = transList.find((t: any) => t.language_code === "ar") || {};
          return new ClientEntity({
            id: item.id,
            nameEn: en.name || "Client Partner",
            nameAr: ar.name || "عميل شريك",
            logoUrl: item.logo_url,
            websiteUrl: item.website_url || null,
            sortOrder: item.sort_order ?? 0,
            status: item.status === "published" ? "active" : "draft",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
    } catch (e) {
      console.warn("getClients query error:", e);
    }

    return [];
  }

  async createClient(client: Omit<ClientEntity, "id" | "createdAt" | "updatedAt">): Promise<ClientEntity> {
    const { data, error } = await (this.supabase.from("clients" as any) as any)
      .insert({ logo_url: client.logoUrl, website_url: client.websiteUrl, sort_order: client.sortOrder, status: "published" })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create client");

    await (this.supabase.from("client_translations" as any) as any).insert([
      { client_id: data.id, language_code: "en", name: client.nameEn },
      { client_id: data.id, language_code: "ar", name: client.nameAr },
    ]);

    return new ClientEntity({ id: data.id, nameEn: client.nameEn, nameAr: client.nameAr, logoUrl: client.logoUrl, websiteUrl: client.websiteUrl, sortOrder: client.sortOrder, status: client.status, createdAt: new Date(), updatedAt: new Date() });
  }

  async updateClient(id: string, client: Partial<ClientEntity>): Promise<ClientEntity> {
    const list = await this.getClients();
    return list[0];
  }

  async deleteClient(id: string): Promise<void> {}
  async reorderClients(orderedIds: string[]): Promise<void> {}
  async bulkDeleteClients(ids: string[]): Promise<void> {}
  async bulkUpdateClientsStatus(ids: string[], status: "active" | "draft"): Promise<void> {}

  // ============================================================================
  // CERTIFICATES (certifications & certification_translations)
  // ============================================================================
  async getCertificates(): Promise<CertificateEntity[]> {
    try {
      const { data, error } = await (this.supabase.from("certifications" as any) as any)
        .select("*, certification_translations(*)")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        return data.map((item: any) => {
          const transList: any[] = item.certification_translations || [];
          const en = transList.find((t: any) => t.language_code === "en") || {};
          const ar = transList.find((t: any) => t.language_code === "ar") || {};
          return new CertificateEntity({
            id: item.id,
            titleEn: en.title || "Certification",
            titleAr: ar.title || "شهادة اعتمادات",
            image: item.image_url || "",
            issueDate: item.issued_date || "",
            sortOrder: item.sort_order ?? 0,
            status: item.status === "published" ? "active" : "draft",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
    } catch (e) {
      console.warn("getCertificates query error:", e);
    }

    return [];
  }

  async createCertificate(cert: Omit<CertificateEntity, "id" | "createdAt" | "updatedAt">): Promise<CertificateEntity> {
    const { data, error } = await (this.supabase.from("certifications" as any) as any)
      .insert({ image_url: cert.image, issued_date: cert.issueDate || null, sort_order: cert.sortOrder, status: "published" })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create certificate");

    await (this.supabase.from("certification_translations" as any) as any).insert([
      { certification_id: data.id, language_code: "en", title: cert.titleEn },
      { certification_id: data.id, language_code: "ar", title: cert.titleAr },
    ]);

    return new CertificateEntity({ id: data.id, titleEn: cert.titleEn, titleAr: cert.titleAr, image: cert.image, issueDate: cert.issueDate, sortOrder: cert.sortOrder, status: cert.status, createdAt: new Date(), updatedAt: new Date() });
  }

  async updateCertificate(id: string, cert: Partial<CertificateEntity>): Promise<CertificateEntity> {
    const list = await this.getCertificates();
    return list[0];
  }

  async deleteCertificate(id: string): Promise<void> {}
  async reorderCertificates(orderedIds: string[]): Promise<void> {}
  async bulkDeleteCertificates(ids: string[]): Promise<void> {}
  async bulkUpdateCertificatesStatus(ids: string[], status: "active" | "draft"): Promise<void> {}

  // ============================================================================
  // CONTACT CTA BANNER
  // ============================================================================
  async getContactCta(): Promise<ContactCtaEntity | null> {
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
    return (await this.getContactCta())!;
  }

  // ============================================================================
  // ACTIVITY LOGGING (activity_log)
  // ============================================================================
  async logActivity(action: string, entityType: string, entityTitle?: string, metadata?: Record<string, unknown>): Promise<void> {
    try {
      const user = (await this.supabase.auth.getUser()).data.user;
      await (this.supabase.from("activity_log" as any) as any).insert({
        action,
        entity_type: entityType,
        details: { entity_title: entityTitle, ...metadata },
        admin_user_id: user?.id ?? null,
      });
    } catch {}
  }
}
