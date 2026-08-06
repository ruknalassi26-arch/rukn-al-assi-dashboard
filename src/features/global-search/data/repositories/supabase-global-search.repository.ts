// ==============================================================================
// features/global-search/data/repositories/supabase-global-search.repository.ts
// Supabase Implementation of IGlobalSearchRepository
// Strictly matching official SQL Schema v2
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

    try {
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
        (this.supabase.from("products" as any) as any).select("id, created_at").limit(15),
        (this.supabase.from("product_categories" as any) as any).select("id, created_at").limit(15),
        (this.supabase.from("services" as any) as any).select("id, created_at").limit(15),
        (this.supabase.from("projects" as any) as any).select("id, created_at").limit(15),
        (this.supabase.from("certifications" as any) as any).select("id, created_at").limit(15),
        (this.supabase.from("team_members" as any) as any).select("id, created_at").limit(15),
        (this.supabase.from("rfq_requests" as any) as any).select("id, full_name, company_name, created_at").limit(15),
        (this.supabase.from("contact_messages" as any) as any).select("id, full_name, email, subject, created_at").limit(15),
      ]);

      // 1. Products
      if (productsRes.data) {
        moduleCounts.products = productsRes.data.length;
        productsRes.data.forEach((p: any) => {
          results.push(
            new SearchResultItemEntity({
              id: p.id,
              module: "products",
              title: "Product Item",
              description: null,
              link: `/admin/products/edit/${p.id}`,
              createdAt: p.created_at ? new Date(p.created_at) : new Date(),
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
              title: "Category Item",
              description: null,
              link: `/admin/categories/edit/${c.id}`,
              createdAt: c.created_at ? new Date(c.created_at) : new Date(),
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
              title: "Service Item",
              description: null,
              link: `/admin/services/edit/${s.id}`,
              createdAt: s.created_at ? new Date(s.created_at) : new Date(),
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
              title: "Project Item",
              description: null,
              link: `/admin/projects`,
              createdAt: pr.created_at ? new Date(pr.created_at) : new Date(),
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
              title: "Certificate Item",
              description: null,
              link: `/admin/certificates/edit/${cert.id}`,
              createdAt: cert.created_at ? new Date(cert.created_at) : new Date(),
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
              title: "Team Member",
              description: null,
              link: `/admin/team/edit/${tm.id}`,
              createdAt: tm.created_at ? new Date(tm.created_at) : new Date(),
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
              title: `RFQ: ${rfq.full_name || "Customer"}`,
              description: rfq.company_name || null,
              link: `/admin/rfq`,
              createdAt: rfq.created_at ? new Date(rfq.created_at) : new Date(),
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
              title: `Message: ${msg.full_name || "Customer"}`,
              description: msg.subject || msg.email,
              link: `/admin/contact-messages`,
              createdAt: msg.created_at ? new Date(msg.created_at) : new Date(),
            })
          );
        });
      }
    } catch (e) {
      console.warn("searchAll query warning:", e);
    }

    moduleCounts.all = results.length;

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
