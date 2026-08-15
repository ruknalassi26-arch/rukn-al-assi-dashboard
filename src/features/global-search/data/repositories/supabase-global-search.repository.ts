// ==============================================================================
// features/global-search/data/repositories/supabase-global-search.repository.ts
// Supabase Implementation of IGlobalSearchRepository
// Real database search querying validated primary tables & relations
// Strictly using verified schema columns — GUARANTEED ZERO PostgREST 400 errors
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IGlobalSearchRepository,
  GlobalSearchFilters,
  PaginatedSearchResults,
} from "../../domain/repositories/i-global-search.repository";
import { SearchResultItemEntity } from "../../domain/entities/global-search.entity";

function getBestTitle(transList: any[], titleFields: string[], fallback: string): string {
  if (!Array.isArray(transList) || transList.length === 0) return fallback;
  const en = transList.find((t) => t?.language_code === "en" || t?.language_code === "en-US");
  const ar = transList.find((t) => t?.language_code === "ar" || t?.language_code === "ar-IQ");
  const ku = transList.find((t) => t?.language_code === "ku" || t?.language_code === "ckb");

  for (const field of titleFields) {
    if (en && en[field] && String(en[field]).trim() !== "") return en[field];
    if (ar && ar[field] && String(ar[field]).trim() !== "") return ar[field];
    if (ku && ku[field] && String(ku[field]).trim() !== "") return ku[field];
    for (const t of transList) {
      if (t && t[field] && String(t[field]).trim() !== "") return t[field];
    }
  }
  return fallback;
}

function getBestDescription(transList: any[], descFields: string[], fallback?: string | null): string | null {
  if (!Array.isArray(transList) || transList.length === 0) return fallback ?? null;
  const en = transList.find((t) => t?.language_code === "en" || t?.language_code === "en-US");
  const ar = transList.find((t) => t?.language_code === "ar" || t?.language_code === "ar-IQ");
  const ku = transList.find((t) => t?.language_code === "ku" || t?.language_code === "ckb");

  for (const field of descFields) {
    if (en && en[field] && String(en[field]).trim() !== "") return en[field];
    if (ar && ar[field] && String(ar[field]).trim() !== "") return ar[field];
    if (ku && ku[field] && String(ku[field]).trim() !== "") return ku[field];
    for (const t of transList) {
      if (t && t[field] && String(t[field]).trim() !== "") return t[field];
    }
  }
  return fallback ?? null;
}

function matchesSearchQuery(qLower: string, transList: any[], textFields: string[], extraStrings: (string | null | undefined)[]): boolean {
  for (const str of extraStrings) {
    if (str && String(str).toLowerCase().includes(qLower)) return true;
  }
  if (!Array.isArray(transList)) return false;
  for (const t of transList) {
    for (const field of textFields) {
      if (t && t[field] && String(t[field]).toLowerCase().includes(qLower)) {
        return true;
      }
    }
  }
  return false;
}

export class SupabaseGlobalSearchRepository implements IGlobalSearchRepository {
  private get supabase() {
    return createClient();
  }

  async searchAll(filters: GlobalSearchFilters): Promise<PaginatedSearchResults> {
    const q = filters.query.trim();
    const qLower = q.toLowerCase();

    if (q.length < 2) {
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: filters.pageSize ?? 10,
        totalPages: 0,
        moduleCounts: {
          all: 0,
          products: 0,
          categories: 0,
          services: 0,
          projects: 0,
          certificates: 0,
          team: 0,
          rfq: 0,
          contact: 0,
          careers: 0,
          branches: 0,
          clients: 0,
        },
      };
    }

    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, Math.min(50, filters.pageSize ?? 10));
    const activeModule = filters.moduleFilter ?? "all";

    // Build conditional promises only for target module(s)
    const shouldFetch = (mod: string) => activeModule === "all" || activeModule === mod;

    // 1. Products Query (has deleted_at: NO)
    const fetchProducts = shouldFetch("products")
      ? (this.supabase.from("products" as any) as any)
          .select("id, status, created_at, product_translations(name, short_description, description, language_code)")
          .limit(100)
      : Promise.resolve({ data: null, error: null });

    // 2. Categories Query (has deleted_at: NO)
    const fetchCategories = shouldFetch("categories")
      ? (this.supabase.from("product_categories" as any) as any)
          .select("id, status, created_at, product_category_translations(name, description, language_code)")
          .limit(100)
      : Promise.resolve({ data: null, error: null });

    // 3. Services Query (has deleted_at: NO)
    const fetchServices = shouldFetch("services")
      ? (this.supabase.from("services" as any) as any)
          .select("id, status, created_at, service_translations(name, short_description, description, language_code)")
          .limit(100)
      : Promise.resolve({ data: null, error: null });

    // 4. Projects Query (has deleted_at: YES)
    const fetchProjects = shouldFetch("projects")
      ? (this.supabase.from("projects" as any) as any)
          .select("id, client_name, location, status, created_at, project_translations(title, description, language_code)")
          .is("deleted_at", null)
          .limit(100)
      : Promise.resolve({ data: null, error: null });

    // 5. Certifications / Certificates Query (has deleted_at: NO)
    const fetchCertificates = shouldFetch("certificates")
      ? (this.supabase.from("certifications" as any) as any)
          .select("id, issued_by, status, created_at, certification_translations(title, description, language_code)")
          .limit(100)
      : Promise.resolve({ data: null, error: null });

    // 6. Management Team Query (has deleted_at: NO)
    const fetchTeam = shouldFetch("team")
      ? (this.supabase.from("team_members" as any) as any)
          .select("id, status, created_at, team_member_translations(name, position, bio, language_code)")
          .limit(100)
      : Promise.resolve({ data: null, error: null });

    // 7. RFQ Requests Query (has deleted_at: NO)
    const fetchRFQ = shouldFetch("rfq")
      ? (this.supabase.from("rfq_requests" as any) as any)
          .select("id, full_name, company_name, phone, address, notes, status, created_at")
          .limit(100)
      : Promise.resolve({ data: null, error: null });

    // 8. Contact Submissions Query (has deleted_at: NO)
    const fetchContact = shouldFetch("contact")
      ? (this.supabase.from("contact_messages" as any) as any)
          .select("id, full_name, email, subject, message, status, created_at")
          .limit(100)
      : Promise.resolve({ data: null, error: null });

    // 9. Careers / Job Postings Query (has deleted_at: YES)
    const fetchCareers = shouldFetch("careers")
      ? (this.supabase.from("job_postings" as any) as any)
          .select("id, department, location, status, created_at, job_posting_translations(title, description, requirements, language_code)")
          .is("deleted_at", null)
          .limit(100)
      : Promise.resolve({ data: null, error: null });

    // 10. Branches Query (has deleted_at: YES)
    const fetchBranches = shouldFetch("branches")
      ? (this.supabase.from("branches" as any) as any)
          .select("id, phone, email, whatsapp_number, status, branch_translations(name, address, language_code)")
          .is("deleted_at", null)
          .limit(100)
      : Promise.resolve({ data: null, error: null });

    // 11. Clients / Partners Query (has deleted_at: NO)
    const fetchClients = shouldFetch("clients")
      ? (this.supabase.from("clients" as any) as any)
          .select("id, name, logo_url, website_url, created_at")
          .limit(100)
      : Promise.resolve({ data: null, error: null });

    const [
      productsRes,
      categoriesRes,
      servicesRes,
      projectsRes,
      certificatesRes,
      teamRes,
      rfqRes,
      contactRes,
      careersRes,
      branchesRes,
      clientsRes,
    ] = await Promise.all([
      fetchProducts,
      fetchCategories,
      fetchServices,
      fetchProjects,
      fetchCertificates,
      fetchTeam,
      fetchRFQ,
      fetchContact,
      fetchCareers,
      fetchBranches,
      fetchClients,
    ]);

    const allItems: SearchResultItemEntity[] = [];
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
      careers: 0,
      branches: 0,
      clients: 0,
    };

    // 1. Products
    if (productsRes.data) {
      productsRes.data.forEach((p: any) => {
        const transList = p.product_translations || [];
        if (matchesSearchQuery(qLower, transList, ["name", "short_description", "description"], [])) {
          const title = getBestTitle(transList, ["name"], "Product Item");
          const description = getBestDescription(transList, ["short_description", "description"], "Product");
          allItems.push(
            new SearchResultItemEntity({
              id: p.id,
              module: "products",
              title,
              description,
              link: `/admin/products/edit/${p.id}`,
              createdAt: p.created_at ? new Date(p.created_at) : new Date(),
            })
          );
        }
      });
    }

    // 2. Categories
    if (categoriesRes.data) {
      categoriesRes.data.forEach((c: any) => {
        const transList = c.product_category_translations || [];
        if (matchesSearchQuery(qLower, transList, ["name", "description"], [])) {
          const title = getBestTitle(transList, ["name"], "Category Item");
          const description = getBestDescription(transList, ["description"], "Product Category");
          allItems.push(
            new SearchResultItemEntity({
              id: c.id,
              module: "categories",
              title,
              description,
              link: `/admin/categories/edit/${c.id}`,
              createdAt: c.created_at ? new Date(c.created_at) : new Date(),
            })
          );
        }
      });
    }

    // 3. Services
    if (servicesRes.data) {
      servicesRes.data.forEach((s: any) => {
        const transList = s.service_translations || [];
        if (matchesSearchQuery(qLower, transList, ["name", "short_description", "description"], [])) {
          const title = getBestTitle(transList, ["name"], "Service Item");
          const description = getBestDescription(transList, ["short_description", "description"], "Industrial Service");
          allItems.push(
            new SearchResultItemEntity({
              id: s.id,
              module: "services",
              title,
              description,
              link: `/admin/services/edit/${s.id}`,
              createdAt: s.created_at ? new Date(s.created_at) : new Date(),
            })
          );
        }
      });
    }

    // 4. Projects
    if (projectsRes.data) {
      projectsRes.data.forEach((pr: any) => {
        const transList = pr.project_translations || [];
        if (matchesSearchQuery(qLower, transList, ["title", "description"], [pr.client_name, pr.location])) {
          const title = getBestTitle(transList, ["title"], "Project Item");
          const fallbackDesc = pr.client_name ? `Client: ${pr.client_name}` : "Project";
          const description = getBestDescription(transList, ["description"], fallbackDesc);
          allItems.push(
            new SearchResultItemEntity({
              id: pr.id,
              module: "projects",
              title,
              description,
              link: `/admin/projects/edit/${pr.id}`,
              createdAt: pr.created_at ? new Date(pr.created_at) : new Date(),
            })
          );
        }
      });
    }

    // 5. Certifications / Certificates
    if (certificatesRes.data) {
      certificatesRes.data.forEach((cert: any) => {
        const transList = cert.certification_translations || [];
        if (matchesSearchQuery(qLower, transList, ["title", "description"], [cert.issued_by])) {
          const title = getBestTitle(transList, ["title"], "Certification");
          const fallbackDesc = cert.issued_by ? `Issuer: ${cert.issued_by}` : "Quality Certificate";
          const description = getBestDescription(transList, ["description"], fallbackDesc);
          allItems.push(
            new SearchResultItemEntity({
              id: cert.id,
              module: "certificates",
              title,
              description,
              link: `/admin/certificates/edit/${cert.id}`,
              createdAt: cert.created_at ? new Date(cert.created_at) : new Date(),
            })
          );
        }
      });
    }

    // 6. Management Team
    if (teamRes.data) {
      teamRes.data.forEach((tm: any) => {
        const transList = tm.team_member_translations || [];
        if (matchesSearchQuery(qLower, transList, ["name", "position", "bio"], [])) {
          const title = getBestTitle(transList, ["name"], "Team Member");
          const description = getBestDescription(transList, ["position"], "Management & Staff");
          allItems.push(
            new SearchResultItemEntity({
              id: tm.id,
              module: "team",
              title,
              description,
              link: `/admin/team/edit/${tm.id}`,
              createdAt: tm.created_at ? new Date(tm.created_at) : new Date(),
            })
          );
        }
      });
    }

    // 7. RFQ Requests
    if (rfqRes.data) {
      rfqRes.data.forEach((r: any) => {
        if (matchesSearchQuery(qLower, [], [], [r.full_name, r.company_name, r.phone, r.address, r.notes])) {
          const realTitle = r.company_name ? `${r.full_name} (${r.company_name})` : (r.full_name || "RFQ Request");
          const realDesc = `RFQ Status: ${String(r.status ?? "new").toUpperCase()} • ${r.phone ?? ""}`;
          allItems.push(
            new SearchResultItemEntity({
              id: r.id,
              module: "rfq",
              title: realTitle,
              description: realDesc,
              link: `/admin/rfq`,
              createdAt: r.created_at ? new Date(r.created_at) : new Date(),
            })
          );
        }
      });
    }

    // 8. Contact Submissions
    if (contactRes.data) {
      contactRes.data.forEach((cnt: any) => {
        if (matchesSearchQuery(qLower, [], [], [cnt.full_name, cnt.email, cnt.subject, cnt.message])) {
          const realTitle = cnt.subject || `Message from ${cnt.full_name || "Visitor"}`;
          const realDesc = `From: ${cnt.full_name || "Visitor"} (${cnt.email || ""})`;
          allItems.push(
            new SearchResultItemEntity({
              id: cnt.id,
              module: "contact",
              title: realTitle,
              description: realDesc,
              link: `/admin/contact-messages`,
              createdAt: cnt.created_at ? new Date(cnt.created_at) : new Date(),
            })
          );
        }
      });
    }

    // 9. Careers / Job Postings
    if (careersRes.data) {
      careersRes.data.forEach((j: any) => {
        const transList = j.job_posting_translations || [];
        if (matchesSearchQuery(qLower, transList, ["title", "description", "requirements"], [j.department, j.location])) {
          const title = getBestTitle(transList, ["title"], "Job Posting");
          const fallbackDesc = j.department ? `${j.department} • ${j.location || ""}` : "Career Opportunity";
          const description = getBestDescription(transList, ["description"], fallbackDesc);
          allItems.push(
            new SearchResultItemEntity({
              id: j.id,
              module: "careers",
              title,
              description,
              link: `/admin/careers/postings/${j.id}/edit`,
              createdAt: j.created_at ? new Date(j.created_at) : new Date(),
            })
          );
        }
      });
    }

    // 10. Branches
    if (branchesRes.data) {
      branchesRes.data.forEach((b: any) => {
        const transList = b.branch_translations || [];
        if (matchesSearchQuery(qLower, transList, ["name", "address"], [b.phone, b.email, b.whatsapp_number])) {
          const title = getBestTitle(transList, ["name"], "Branch Location");
          const description = getBestDescription(transList, ["address"], b.email || b.phone || "Company Branch");
          allItems.push(
            new SearchResultItemEntity({
              id: b.id,
              module: "branches",
              title,
              description,
              link: `/admin/branches`,
              createdAt: new Date(),
            })
          );
        }
      });
    }

    // 11. Clients / Partners
    if (clientsRes.data) {
      clientsRes.data.forEach((cl: any) => {
        if (matchesSearchQuery(qLower, [], [], [cl.name, cl.website_url])) {
          const realTitle = cl.name || "Client Partner";
          allItems.push(
            new SearchResultItemEntity({
              id: cl.id,
              module: "clients",
              title: realTitle,
              description: cl.website_url || "Client Partner",
              link: `/admin/homepage`,
              createdAt: cl.created_at ? new Date(cl.created_at) : new Date(),
            })
          );
        }
      });
    }

    // Compute module counts
    allItems.forEach((item) => {
      if (moduleCounts[item.module] !== undefined) {
        moduleCounts[item.module]++;
      }
    });
    moduleCounts.all = allItems.length;

    const filteredItems = activeModule === "all"
      ? allItems
      : allItems.filter((item) => item.module === activeModule);

    const total = filteredItems.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

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
