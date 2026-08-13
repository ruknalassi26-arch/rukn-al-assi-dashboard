// ==============================================================================
// features/global-search/data/repositories/supabase-global-search.repository.ts
// Supabase Implementation of IGlobalSearchRepository
// Real database search querying actual PostgREST translation & entity tables
// Strictly using columns that actually exist in the production database schema
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type {
  IGlobalSearchRepository,
  GlobalSearchFilters,
  PaginatedSearchResults,
} from "../../domain/repositories/i-global-search.repository";
import { SearchResultItemEntity } from "../../domain/entities/global-search.entity";

function dedupeResults(items: SearchResultItemEntity[]): SearchResultItemEntity[] {
  const seen = new Set<string>();
  const res: SearchResultItemEntity[] = [];
  for (const item of items) {
    const key = `${item.module}-${item.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      res.push(item);
    }
  }
  return res;
}

export class SupabaseGlobalSearchRepository implements IGlobalSearchRepository {
  private get supabase() {
    return createClient();
  }

  async searchAll(filters: GlobalSearchFilters): Promise<PaginatedSearchResults> {
    const q = filters.query.trim();
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

    // 1. Products Query (via product_translations)
    const fetchProducts = (activeModule === "all" || activeModule === "products")
      ? (this.supabase.from("product_translations" as any) as any)
          .select("product_id, name, short_description, language_code, products!inner(id, created_at, status, deleted_at)")
          .or(`name.ilike.%${q}%,short_description.ilike.%${q}%`)
          .is("products.deleted_at", null)
          .limit(25)
      : Promise.resolve({ data: null, error: null });

    // 2. Categories Query (via product_category_translations)
    const fetchCategories = (activeModule === "all" || activeModule === "categories")
      ? (this.supabase.from("product_category_translations" as any) as any)
          .select("category_id, name, description, language_code, product_categories!inner(id, created_at, status, deleted_at)")
          .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
          .is("product_categories.deleted_at", null)
          .limit(25)
      : Promise.resolve({ data: null, error: null });

    // 3. Services Query (via service_translations)
    const fetchServices = (activeModule === "all" || activeModule === "services")
      ? (this.supabase.from("service_translations" as any) as any)
          .select("service_id, name, short_description, description, language_code, services!inner(id, created_at, status, deleted_at)")
          .or(`name.ilike.%${q}%,short_description.ilike.%${q}%,description.ilike.%${q}%`)
          .is("services.deleted_at", null)
          .limit(25)
      : Promise.resolve({ data: null, error: null });

    // 4. Projects Query (via project_translations)
    const fetchProjects = (activeModule === "all" || activeModule === "projects")
      ? (this.supabase.from("project_translations" as any) as any)
          .select("project_id, title, description, language_code, projects!inner(id, client_name, location, created_at, status, deleted_at)")
          .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
          .is("projects.deleted_at", null)
          .limit(25)
      : Promise.resolve({ data: null, error: null });

    // 5. Certifications Query (via certification_translations)
    const fetchCertificates = (activeModule === "all" || activeModule === "certificates")
      ? (this.supabase.from("certification_translations" as any) as any)
          .select("certification_id, title, description, language_code, certifications!inner(id, issued_by, created_at, status, deleted_at)")
          .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
          .is("certifications.deleted_at", null)
          .limit(25)
      : Promise.resolve({ data: null, error: null });

    // 6. Management Team Query (via team_member_translations)
    const fetchTeam = (activeModule === "all" || activeModule === "team")
      ? (this.supabase.from("team_member_translations" as any) as any)
          .select("team_member_id, name, position, bio, language_code, team_members!inner(id, created_at, status, deleted_at)")
          .or(`name.ilike.%${q}%,position.ilike.%${q}%,bio.ilike.%${q}%`)
          .is("team_members.deleted_at", null)
          .limit(25)
      : Promise.resolve({ data: null, error: null });

    // 7. RFQ Requests Query (direct table)
    const fetchRFQ = (activeModule === "all" || activeModule === "rfq")
      ? (this.supabase.from("rfq_requests" as any) as any)
          .select("id, full_name, company_name, phone, status, created_at")
          .or(`full_name.ilike.%${q}%,company_name.ilike.%${q}%,phone.ilike.%${q}%,address.ilike.%${q}%,notes.ilike.%${q}%`)
          .limit(25)
      : Promise.resolve({ data: null, error: null });

    // 8. Contact Submissions Query (direct table)
    const fetchContact = (activeModule === "all" || activeModule === "contact")
      ? (this.supabase.from("contact_messages" as any) as any)
          .select("id, full_name, email, subject, status, created_at")
          .or(`full_name.ilike.%${q}%,email.ilike.%${q}%,subject.ilike.%${q}%,message.ilike.%${q}%`)
          .limit(25)
      : Promise.resolve({ data: null, error: null });

    // 9. Careers / Job Postings Query (via job_posting_translations)
    const fetchCareers = (activeModule === "all" || activeModule === "careers")
      ? (this.supabase.from("job_posting_translations" as any) as any)
          .select("job_posting_id, title, description, language_code, job_postings!inner(id, department, location, status, deleted_at)")
          .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
          .is("job_postings.deleted_at", null)
          .limit(25)
      : Promise.resolve({ data: null, error: null });

    // 10. Branches Query (via branch_translations)
    const fetchBranches = (activeModule === "all" || activeModule === "branches")
      ? (this.supabase.from("branch_translations" as any) as any)
          .select("branch_id, name, address, language_code, branches!inner(id, phone, email, status, deleted_at)")
          .or(`name.ilike.%${q}%,address.ilike.%${q}%`)
          .is("branches.deleted_at", null)
          .limit(25)
      : Promise.resolve({ data: null, error: null });

    // 11. Clients / Partners Query (direct table)
    const fetchClients = (activeModule === "all" || activeModule === "clients")
      ? (this.supabase.from("clients" as any) as any)
          .select("id, name, name_en, name_ar, website_url, created_at")
          .or(`name.ilike.%${q}%,name_en.ilike.%${q}%,name_ar.ilike.%${q}%`)
          .limit(25)
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

    const rawItems: SearchResultItemEntity[] = [];
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
        rawItems.push(
          new SearchResultItemEntity({
            id: p.product_id,
            module: "products",
            title: p.name || "Untitled Product",
            description: p.short_description || "Product Item",
            link: `/admin/products/edit/${p.product_id}`,
            createdAt: p.products?.created_at ? new Date(p.products.created_at) : new Date(),
          })
        );
      });
    }

    // 2. Categories
    if (categoriesRes.data) {
      categoriesRes.data.forEach((c: any) => {
        rawItems.push(
          new SearchResultItemEntity({
            id: c.category_id,
            module: "categories",
            title: c.name || "Untitled Category",
            description: c.description || "Product Category",
            link: `/admin/categories/edit/${c.category_id}`,
            createdAt: c.product_categories?.created_at ? new Date(c.product_categories.created_at) : new Date(),
          })
        );
      });
    }

    // 3. Services
    if (servicesRes.data) {
      servicesRes.data.forEach((s: any) => {
        rawItems.push(
          new SearchResultItemEntity({
            id: s.service_id,
            module: "services",
            title: s.name || "Untitled Service",
            description: s.short_description || s.description || "Industrial Service",
            link: `/admin/services/edit/${s.service_id}`,
            createdAt: s.services?.created_at ? new Date(s.services.created_at) : new Date(),
          })
        );
      });
    }

    // 4. Projects
    if (projectsRes.data) {
      projectsRes.data.forEach((pr: any) => {
        const clientText = pr.projects?.client_name ? `Client: ${pr.projects.client_name}` : null;
        rawItems.push(
          new SearchResultItemEntity({
            id: pr.project_id,
            module: "projects",
            title: pr.title || "Untitled Project",
            description: clientText || pr.description || "Project",
            link: `/admin/projects/edit/${pr.project_id}`,
            createdAt: pr.projects?.created_at ? new Date(pr.projects.created_at) : new Date(),
          })
        );
      });
    }

    // 5. Certifications / Certificates
    if (certificatesRes.data) {
      certificatesRes.data.forEach((cert: any) => {
        const issuerText = cert.certifications?.issued_by ? `Issuer: ${cert.certifications.issued_by}` : null;
        rawItems.push(
          new SearchResultItemEntity({
            id: cert.certification_id,
            module: "certificates",
            title: cert.title || "Certification",
            description: issuerText || cert.description || "Quality Certificate",
            link: `/admin/certificates/edit/${cert.certification_id}`,
            createdAt: cert.certifications?.created_at ? new Date(cert.certifications.created_at) : new Date(),
          })
        );
      });
    }

    // 6. Management Team Members
    if (teamRes.data) {
      teamRes.data.forEach((tm: any) => {
        rawItems.push(
          new SearchResultItemEntity({
            id: tm.team_member_id,
            module: "team",
            title: tm.name || "Team Member",
            description: tm.position || "Management & Staff",
            link: `/admin/team/edit/${tm.team_member_id}`,
            createdAt: tm.team_members?.created_at ? new Date(tm.team_members.created_at) : new Date(),
          })
        );
      });
    }

    // 7. RFQ Requests
    if (rfqRes.data) {
      rfqRes.data.forEach((r: any) => {
        const realTitle = r.company_name ? `${r.full_name} (${r.company_name})` : r.full_name;
        const realDesc = `RFQ Status: ${String(r.status ?? "new").toUpperCase()} • ${r.phone ?? ""}`;
        rawItems.push(
          new SearchResultItemEntity({
            id: r.id,
            module: "rfq",
            title: realTitle || "RFQ Request",
            description: realDesc,
            link: `/admin/rfq`,
            createdAt: r.created_at ? new Date(r.created_at) : new Date(),
          })
        );
      });
    }

    // 8. Contact Messages / Submissions
    if (contactRes.data) {
      contactRes.data.forEach((cnt: any) => {
        const realTitle = cnt.subject || `Message from ${cnt.full_name}`;
        const realDesc = `From: ${cnt.full_name} (${cnt.email})`;
        rawItems.push(
          new SearchResultItemEntity({
            id: cnt.id,
            module: "contact",
            title: realTitle || "Contact Message",
            description: realDesc,
            link: `/admin/contact-messages`,
            createdAt: cnt.created_at ? new Date(cnt.created_at) : new Date(),
          })
        );
      });
    }

    // 9. Careers / Job Postings
    if (careersRes.data) {
      careersRes.data.forEach((j: any) => {
        const deptText = j.job_postings?.department ? `${j.job_postings.department} • ${j.job_postings.location || ""}` : null;
        rawItems.push(
          new SearchResultItemEntity({
            id: j.job_posting_id,
            module: "careers",
            title: j.title || "Job Posting",
            description: deptText || (j.description ? String(j.description).slice(0, 100) : "Career Opportunity"),
            link: `/admin/careers/postings/${j.job_posting_id}/edit`,
            createdAt: j.job_postings?.created_at ? new Date(j.job_postings.created_at) : new Date(),
          })
        );
      });
    }

    // 10. Branches
    if (branchesRes.data) {
      branchesRes.data.forEach((b: any) => {
        rawItems.push(
          new SearchResultItemEntity({
            id: b.branch_id,
            module: "branches",
            title: b.name || "Branch Location",
            description: b.address || b.branches?.email || "Company Branch",
            link: `/admin/branches`,
            createdAt: new Date(),
          })
        );
      });
    }

    // 11. Clients / Partners
    if (clientsRes.data) {
      clientsRes.data.forEach((cl: any) => {
        const realTitle = cl.name || cl.name_en || cl.name_ar || "Client Partner";
        rawItems.push(
          new SearchResultItemEntity({
            id: cl.id,
            module: "clients",
            title: realTitle,
            description: cl.website_url || "Client Partner",
            link: `/admin/homepage`,
            createdAt: cl.created_at ? new Date(cl.created_at) : new Date(),
          })
        );
      });
    }

    // Deduplicate items that match across multiple translations
    const dedupedItems = dedupeResults(rawItems);

    // Compute module counts
    dedupedItems.forEach((item) => {
      if (moduleCounts[item.module] !== undefined) {
        moduleCounts[item.module]++;
      }
    });
    moduleCounts.all = dedupedItems.length;

    const filteredItems = activeModule === "all"
      ? dedupedItems
      : dedupedItems.filter((item) => item.module === activeModule);

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
