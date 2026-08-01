// ==============================================================================
// features/global-search/data/repositories/supabase-global-search.repository.ts
// Supabase Implementation of IGlobalSearchRepository
// Performs parallel searches across 8 database tables
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IGlobalSearchRepository,
  GlobalSearchFilters,
  PaginatedSearchResults,
} from "../../domain/repositories/i-global-search.repository";
import { SearchResultItemEntity } from "../../domain/entities/global-search.entity";

export class SupabaseGlobalSearchRepository implements IGlobalSearchRepository {
  private get supabase() {
    return createClient();
  }

  async searchAll(filters: GlobalSearchFilters): Promise<PaginatedSearchResults> {
    const q = filters.query.trim();
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, Math.min(50, filters.pageSize ?? 10));
    const term = `%${q}%`;

    const moduleCounts: Record<string, number> = {
      all: 0,
      products: 0,
      categories: 0,
      services: 0,
      projects: 0,
      certificates: 0,
      team: 0,
      rfq: 0,
      contact: 0,
    };

    const results: SearchResultItemEntity[] = [];

    const [
      productsRes,
      categoriesRes,
      servicesRes,
      projectsRes,
      certificatesRes,
      teamRes,
      rfqRes,
      contactRes,
    ] = await Promise.all([
      this.supabase.from("products").select("id, name_en, short_description_en, created_at").or(`name_en.ilike.${term},name_ar.ilike.${term},description_en.ilike.${term}`).limit(15),
      (this.supabase as any).from("categories").select("id, name_en, description_en, created_at").or(`name_en.ilike.${term},name_ar.ilike.${term}`).limit(15),
      this.supabase.from("services").select("id, title_en, short_description_en, created_at").or(`title_en.ilike.${term},title_ar.ilike.${term}`).limit(15),
      this.supabase.from("projects").select("id, title_en, description_en, created_at").or(`title_en.ilike.${term},title_ar.ilike.${term}`).limit(15),
      this.supabase.from("certificates").select("id, title_en, description_en, created_at").or(`title_en.ilike.${term},title_ar.ilike.${term}`).limit(15),
      (this.supabase as any).from("team_members").select("id, name_en, title_en, created_at").or(`name_en.ilike.${term},name_ar.ilike.${term},title_en.ilike.${term}`).limit(15),
      this.supabase.from("rfq_requests").select("id, contact_name, company_name, email, created_at").or(`contact_name.ilike.${term},company_name.ilike.${term},email.ilike.${term}`).limit(15),
      this.supabase.from("contact_submissions").select("id, name, email, subject, created_at").or(`name.ilike.${term},email.ilike.${term},subject.ilike.${term}`).limit(15),
    ]);

    // 1. Products
    if (productsRes.data) {
      moduleCounts.products = productsRes.data.length;
      productsRes.data.forEach((p: any) => {
        results.push(
          new SearchResultItemEntity({
            id: p.id,
            module: "products",
            title: p.name_en,
            description: p.short_description_en ?? null,
            link: `/admin/products/edit/${p.id}`,
            createdAt: new Date(p.created_at),
          })
        );
      });
    }

    // 2. Categories
    if (categoriesRes.data) {
      moduleCounts.categories = categoriesRes.data.length;
      categoriesRes.data.forEach((c: any) => {
        results.push(
          new SearchResultItemEntity({
            id: c.id,
            module: "categories",
            title: c.name_en,
            description: c.description_en ?? null,
            link: `/admin/categories/edit/${c.id}`,
            createdAt: new Date(c.created_at),
          })
        );
      });
    }

    // 3. Services
    if (servicesRes.data) {
      moduleCounts.services = servicesRes.data.length;
      servicesRes.data.forEach((s: any) => {
        results.push(
          new SearchResultItemEntity({
            id: s.id,
            module: "services",
            title: s.title_en,
            description: s.short_description_en ?? null,
            link: `/admin/services/edit/${s.id}`,
            createdAt: new Date(s.created_at),
          })
        );
      });
    }

    // 4. Projects
    if (projectsRes.data) {
      moduleCounts.projects = projectsRes.data.length;
      projectsRes.data.forEach((pr: any) => {
        results.push(
          new SearchResultItemEntity({
            id: pr.id,
            module: "projects",
            title: pr.title_en,
            description: pr.description_en ?? null,
            link: `/admin/projects`,
            createdAt: new Date(pr.created_at),
          })
        );
      });
    }

    // 5. Certificates
    if (certificatesRes.data) {
      moduleCounts.certificates = certificatesRes.data.length;
      certificatesRes.data.forEach((cert: any) => {
        results.push(
          new SearchResultItemEntity({
            id: cert.id,
            module: "certificates",
            title: cert.title_en,
            description: cert.description_en ?? null,
            link: `/admin/certificates/edit/${cert.id}`,
            createdAt: new Date(cert.created_at),
          })
        );
      });
    }

    // 6. Team Members
    if (teamRes.data) {
      moduleCounts.team = teamRes.data.length;
      teamRes.data.forEach((tm: any) => {
        results.push(
          new SearchResultItemEntity({
            id: tm.id,
            module: "team",
            title: tm.name_en,
            description: tm.title_en ?? null,
            link: `/admin/team/edit/${tm.id}`,
            createdAt: new Date(tm.created_at),
          })
        );
      });
    }

    // 7. RFQ Requests
    if (rfqRes.data) {
      moduleCounts.rfq = rfqRes.data.length;
      rfqRes.data.forEach((rfq: any) => {
        results.push(
          new SearchResultItemEntity({
            id: rfq.id,
            module: "rfq",
            title: `RFQ: ${rfq.contact_name}`,
            description: `${rfq.company_name || rfq.email}`,
            link: `/admin/rfq`,
            createdAt: new Date(rfq.created_at),
          })
        );
      });
    }

    // 8. Contact Messages
    if (contactRes.data) {
      moduleCounts.contact = contactRes.data.length;
      contactRes.data.forEach((msg: any) => {
        results.push(
          new SearchResultItemEntity({
            id: msg.id,
            module: "contact",
            title: `Message: ${msg.name}`,
            description: msg.subject || msg.email,
            link: `/admin/contact-messages`,
            createdAt: new Date(msg.created_at),
          })
        );
      });
    }

    moduleCounts.all = results.length;

    // Filter by module if tab selected
    let filtered = results;
    if (filters.moduleFilter && filters.moduleFilter !== "all") {
      filtered = results.filter((r) => r.module === filters.moduleFilter);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
      moduleCounts,
    };
  }
}
