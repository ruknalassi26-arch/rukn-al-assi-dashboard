// ==============================================================================
// features/homepage/data/repository/supabase-homepage.repository.ts
// Concrete Supabase implementation of IHomepageRepository
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@core/types/database.types";
import type { IHomepageRepository } from "../../domain/repositories/i-homepage.repository";
import type {
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
  // HERO SECTION
  // ============================================================================
  async getHeroSlides(): Promise<HeroSlideEntity[]> {
    const { data, error } = await this.supabase
      .from("homepage_hero")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(toHeroSlideEntity);
  }

  async createHeroSlide(slide: Omit<HeroSlideEntity, "id" | "createdAt" | "updatedAt">): Promise<HeroSlideEntity> {
    const payload = {
      title_en: slide.titleEn,
      title_ar: slide.titleAr,
      subtitle_en: slide.subtitleEn,
      subtitle_ar: slide.subtitleAr,
      primary_button_text_en: slide.primaryButtonTextEn,
      primary_button_text_ar: slide.primaryButtonTextAr,
      primary_button_url: slide.primaryButtonUrl,
      secondary_button_text_en: slide.secondaryButtonTextEn,
      secondary_button_text_ar: slide.secondaryButtonTextAr,
      secondary_button_url: slide.secondaryButtonUrl,
      background_image: slide.backgroundImage,
      overlay_opacity: slide.overlayOpacity,
      status: slide.status,
      sort_order: slide.sortOrder,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("homepage_hero") as any)
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create hero slide");
    return toHeroSlideEntity(data);
  }

  async updateHeroSlide(id: string, slide: Partial<HeroSlideEntity>): Promise<HeroSlideEntity> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (slide.titleEn !== undefined) payload.title_en = slide.titleEn;
    if (slide.titleAr !== undefined) payload.title_ar = slide.titleAr;
    if (slide.subtitleEn !== undefined) payload.subtitle_en = slide.subtitleEn;
    if (slide.subtitleAr !== undefined) payload.subtitle_ar = slide.subtitleAr;
    if (slide.primaryButtonTextEn !== undefined) payload.primary_button_text_en = slide.primaryButtonTextEn;
    if (slide.primaryButtonTextAr !== undefined) payload.primary_button_text_ar = slide.primaryButtonTextAr;
    if (slide.primaryButtonUrl !== undefined) payload.primary_button_url = slide.primaryButtonUrl;
    if (slide.secondaryButtonTextEn !== undefined) payload.secondary_button_text_en = slide.secondaryButtonTextEn;
    if (slide.secondaryButtonTextAr !== undefined) payload.secondary_button_text_ar = slide.secondaryButtonTextAr;
    if (slide.secondaryButtonUrl !== undefined) payload.secondary_button_url = slide.secondaryButtonUrl;
    if (slide.backgroundImage !== undefined) payload.background_image = slide.backgroundImage;
    if (slide.overlayOpacity !== undefined) payload.overlay_opacity = slide.overlayOpacity;
    if (slide.status !== undefined) payload.status = slide.status;
    if (slide.sortOrder !== undefined) payload.sort_order = slide.sortOrder;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("homepage_hero") as any)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update hero slide");
    return toHeroSlideEntity(data);
  }

  async deleteHeroSlide(id: string): Promise<void> {
    const { error } = await this.supabase.from("homepage_hero").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderHeroSlides(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.supabase.from("homepage_hero") as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  // ============================================================================
  // ABOUT SECTION
  // ============================================================================
  async getAboutPreview(): Promise<AboutPreviewEntity | null> {
    const { data, error } = await this.supabase.from("homepage_about").select("*").limit(1).single();
    if (error || !data) return null;
    return toAboutPreviewEntity(data);
  }

  async updateAboutPreview(data: Partial<AboutPreviewEntity>): Promise<AboutPreviewEntity> {
    const existing = await this.getAboutPreview();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.titleEn !== undefined) payload.title_en = data.titleEn;
    if (data.titleAr !== undefined) payload.title_ar = data.titleAr;
    if (data.descriptionEn !== undefined) payload.description_en = data.descriptionEn;
    if (data.descriptionAr !== undefined) payload.description_ar = data.descriptionAr;
    if (data.imageUrl !== undefined) payload.image_url = data.imageUrl;
    if (data.buttonTextEn !== undefined) payload.button_text_en = data.buttonTextEn;
    if (data.buttonTextAr !== undefined) payload.button_text_ar = data.buttonTextAr;
    if (data.buttonUrl !== undefined) payload.button_url = data.buttonUrl;
    if (data.highlightsEn !== undefined) payload.highlights_en = data.highlightsEn;
    if (data.highlightsAr !== undefined) payload.highlights_ar = data.highlightsAr;
    if (data.status !== undefined) payload.status = data.status;

    let resData: unknown;
    let resError: unknown;

    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (this.supabase.from("homepage_about") as any)
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      resData = res.data;
      resError = res.error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (this.supabase.from("homepage_about") as any)
        .insert({
          title_en: data.titleEn ?? "About Us",
          title_ar: data.titleAr ?? "عن الشركة",
          ...payload,
        })
        .select()
        .single();
      resData = res.data;
      resError = res.error;
    }

    if (resError || !resData) throw new Error((resError as { message?: string })?.message ?? "Failed to save about section");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toAboutPreviewEntity(resData as any);
  }

  // ============================================================================
  // COMPANY STATISTICS
  // ============================================================================
  async getCompanyStats(): Promise<CompanyStatEntity[]> {
    const { data, error } = await this.supabase
      .from("company_statistics")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(toCompanyStatEntity);
  }

  async createCompanyStat(stat: Omit<CompanyStatEntity, "id" | "createdAt" | "updatedAt">): Promise<CompanyStatEntity> {
    const payload = {
      title_en: stat.titleEn,
      title_ar: stat.titleAr,
      value: stat.value,
      icon: stat.icon,
      sort_order: stat.sortOrder,
      status: stat.status,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("company_statistics") as any)
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create statistic");
    return toCompanyStatEntity(data);
  }

  async updateCompanyStat(id: string, stat: Partial<CompanyStatEntity>): Promise<CompanyStatEntity> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (stat.titleEn !== undefined) payload.title_en = stat.titleEn;
    if (stat.titleAr !== undefined) payload.title_ar = stat.titleAr;
    if (stat.value !== undefined) payload.value = stat.value;
    if (stat.icon !== undefined) payload.icon = stat.icon;
    if (stat.sortOrder !== undefined) payload.sort_order = stat.sortOrder;
    if (stat.status !== undefined) payload.status = stat.status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("company_statistics") as any)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update statistic");
    return toCompanyStatEntity(data);
  }

  async deleteCompanyStat(id: string): Promise<void> {
    const { error } = await this.supabase.from("company_statistics").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderCompanyStats(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.supabase.from("company_statistics") as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteCompanyStats(ids: string[]): Promise<void> {
    const { error } = await this.supabase.from("company_statistics").delete().in("id", ids);
    if (error) throw new Error(error.message);
  }

  async bulkUpdateCompanyStatsStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (this.supabase.from("company_statistics") as any)
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
  }

  // ============================================================================
  // FEATURED SERVICES
  // ============================================================================
  async getFeaturedServices(): Promise<FeaturedServiceEntity[]> {
    const { data, error } = await this.supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(toFeaturedServiceEntity);
  }

  async toggleServiceFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {
    const payload: Record<string, unknown> = {
      is_featured: isFeatured,
      updated_at: new Date().toISOString(),
    };
    if (sortOrder !== undefined) payload.sort_order = sortOrder;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (this.supabase.from("services") as any).update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderFeaturedServices(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.supabase.from("services") as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  // ============================================================================
  // FEATURED PRODUCTS
  // ============================================================================
  async getFeaturedProducts(): Promise<FeaturedProductEntity[]> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(toFeaturedProductEntity);
  }

  async toggleProductFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {
    const payload: Record<string, unknown> = {
      is_featured: isFeatured,
      updated_at: new Date().toISOString(),
    };
    if (sortOrder !== undefined) payload.sort_order = sortOrder;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (this.supabase.from("products") as any).update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderFeaturedProducts(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.supabase.from("products") as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  // ============================================================================
  // FEATURED PROJECTS
  // ============================================================================
  async getFeaturedProjects(): Promise<FeaturedProjectEntity[]> {
    const { data, error } = await this.supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(toFeaturedProjectEntity);
  }

  async toggleProjectFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void> {
    const payload: Record<string, unknown> = {
      is_featured: isFeatured,
      updated_at: new Date().toISOString(),
    };
    if (sortOrder !== undefined) payload.sort_order = sortOrder;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (this.supabase.from("projects") as any).update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderFeaturedProjects(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.supabase.from("projects") as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  // ============================================================================
  // CLIENTS
  // ============================================================================
  async getClients(): Promise<ClientEntity[]> {
    const { data, error } = await this.supabase
      .from("clients")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(toClientEntity);
  }

  async createClient(client: Omit<ClientEntity, "id" | "createdAt" | "updatedAt">): Promise<ClientEntity> {
    const payload = {
      name_en: client.nameEn,
      name_ar: client.nameAr,
      logo_url: client.logoUrl,
      website_url: client.websiteUrl,
      sort_order: client.sortOrder,
      status: client.status,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("clients") as any)
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create client");
    return toClientEntity(data);
  }

  async updateClient(id: string, client: Partial<ClientEntity>): Promise<ClientEntity> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (client.nameEn !== undefined) payload.name_en = client.nameEn;
    if (client.nameAr !== undefined) payload.name_ar = client.nameAr;
    if (client.logoUrl !== undefined) payload.logo_url = client.logoUrl;
    if (client.websiteUrl !== undefined) payload.website_url = client.websiteUrl;
    if (client.sortOrder !== undefined) payload.sort_order = client.sortOrder;
    if (client.status !== undefined) payload.status = client.status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("clients") as any)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update client");
    return toClientEntity(data);
  }

  async deleteClient(id: string): Promise<void> {
    const { error } = await this.supabase.from("clients").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderClients(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.supabase.from("clients") as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteClients(ids: string[]): Promise<void> {
    const { error } = await this.supabase.from("clients").delete().in("id", ids);
    if (error) throw new Error(error.message);
  }

  async bulkUpdateClientsStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (this.supabase.from("clients") as any)
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
  }

  // ============================================================================
  // CERTIFICATES
  // ============================================================================
  async getCertificates(): Promise<CertificateEntity[]> {
    const { data, error } = await this.supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(toCertificateEntity);
  }

  async createCertificate(certificate: Omit<CertificateEntity, "id" | "createdAt" | "updatedAt">): Promise<CertificateEntity> {
    const payload = {
      title_en: certificate.titleEn,
      title_ar: certificate.titleAr,
      image: certificate.image,
      issue_date: certificate.issueDate,
      sort_order: certificate.sortOrder,
      status: certificate.status,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("certificates") as any)
      .insert(payload)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to create certificate");
    return toCertificateEntity(data);
  }

  async updateCertificate(id: string, certificate: Partial<CertificateEntity>): Promise<CertificateEntity> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (certificate.titleEn !== undefined) payload.title_en = certificate.titleEn;
    if (certificate.titleAr !== undefined) payload.title_ar = certificate.titleAr;
    if (certificate.image !== undefined) payload.image = certificate.image;
    if (certificate.issueDate !== undefined) payload.issue_date = certificate.issueDate;
    if (certificate.sortOrder !== undefined) payload.sort_order = certificate.sortOrder;
    if (certificate.status !== undefined) payload.status = certificate.status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (this.supabase.from("certificates") as any)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? "Failed to update certificate");
    return toCertificateEntity(data);
  }

  async deleteCertificate(id: string): Promise<void> {
    const { error } = await this.supabase.from("certificates").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async reorderCertificates(orderedIds: string[]): Promise<void> {
    const updates = orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.supabase.from("certificates") as any).update({ sort_order: index + 1 }).eq("id", id)
    );
    await Promise.all(updates);
  }

  async bulkDeleteCertificates(ids: string[]): Promise<void> {
    const { error } = await this.supabase.from("certificates").delete().in("id", ids);
    if (error) throw new Error(error.message);
  }

  async bulkUpdateCertificatesStatus(ids: string[], status: "active" | "draft"): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (this.supabase.from("certificates") as any)
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw new Error(error.message);
  }

  // ============================================================================
  // CONTACT CTA
  // ============================================================================
  async getContactCta(): Promise<ContactCtaEntity | null> {
    const { data, error } = await this.supabase.from("homepage_contact_cta").select("*").limit(1).single();
    if (error || !data) return null;
    return toContactCtaEntity(data);
  }

  async updateContactCta(data: Partial<ContactCtaEntity>): Promise<ContactCtaEntity> {
    const existing = await this.getContactCta();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.headingEn !== undefined) payload.heading_en = data.headingEn;
    if (data.headingAr !== undefined) payload.heading_ar = data.headingAr;
    if (data.descriptionEn !== undefined) payload.description_en = data.descriptionEn;
    if (data.descriptionAr !== undefined) payload.description_ar = data.descriptionAr;
    if (data.buttonTextEn !== undefined) payload.button_text_en = data.buttonTextEn;
    if (data.buttonTextAr !== undefined) payload.button_text_ar = data.buttonTextAr;
    if (data.buttonUrl !== undefined) payload.button_url = data.buttonUrl;
    if (data.backgroundImage !== undefined) payload.background_image = data.backgroundImage;

    let resData: unknown;
    let resError: unknown;

    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (this.supabase.from("homepage_contact_cta") as any)
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      resData = res.data;
      resError = res.error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (this.supabase.from("homepage_contact_cta") as any)
        .insert({
          heading_en: data.headingEn ?? "Contact Us",
          heading_ar: data.headingAr ?? "تواصل معنا",
          ...payload,
        })
        .select()
        .single();
      resData = res.data;
      resError = res.error;
    }

    if (resError || !resData) throw new Error((resError as { message?: string })?.message ?? "Failed to save contact CTA");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toContactCtaEntity(resData as any);
  }

  // ============================================================================
  // ACTIVITY LOGGING
  // ============================================================================
  async logActivity(
    action: string,
    entityType: string,
    entityTitle?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const user = (await this.supabase.auth.getUser()).data.user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (this.supabase.from("activity_logs") as any).insert({
        action: action as any,
        entity_type: entityType as any,
        entity_title: entityTitle ?? null,
        user_id: user?.id ?? null,
        user_email: user?.email ?? null,
        metadata: metadata ?? null,
      });
    } catch {
      // Activity log insertion is non-blocking
    }
  }
}
