// ==============================================================================
// features/global-search/data/dto/search.dto.ts
// Explicit Data Transfer Objects for Database Search Queries
// Strictly matching production database columns — ZERO invented columns.
// ==============================================================================

export interface ProductSearchDTO {
  id: string;
  status: string;
  product_translations?: Array<{
    language_code: string;
    name: string;
    short_description: string | null;
  }>;
}

export interface CategorySearchDTO {
  id: string;
  status: string;
  product_category_translations?: Array<{
    language_code: string;
    name: string;
    description: string | null;
  }>;
}

export interface ServiceSearchDTO {
  id: string;
  status: string;
  service_translations?: Array<{
    language_code: string;
    name: string;
    description: string | null;
    applications: string | null;
  }>;
}

export interface ProjectSearchDTO {
  id: string;
  client_name: string | null;
  location: string | null;
  status: string;
  created_at: string;
  project_translations?: Array<{
    language_code: string;
    title: string;
    description: string | null;
  }>;
}

export interface CertificationSearchDTO {
  id: string;
  status: string;
  sort_order: number;
  certification_translations?: Array<{
    language_code: string;
    title: string;
    description: string | null;
  }>;
}

export interface TeamMemberSearchDTO {
  id: string;
  status: string;
  team_member_translations?: Array<{
    language_code: string;
    name: string | null;
    position: string | null;
    bio: string | null;
  }>;
}

export interface RFQSearchDTO {
  id: string;
  full_name: string;
  company_name: string | null;
  phone: string;
  address: string;
  notes: string | null;
  status: string;
  created_at: string;
}

export interface ContactMessageSearchDTO {
  id: string;
  full_name: string;
  email: string;
  subject: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export interface JobPostingSearchDTO {
  id: string;
  department: string | null;
  location: string | null;
  status: string;
  created_at: string;
  job_posting_translations?: Array<{
    language_code: string;
    title: string;
    description: string | null;
    requirements: string | null;
  }>;
}

export interface BranchSearchDTO {
  id: string;
  phone: string | null;
  email: string | null;
  status: string;
  branch_translations?: Array<{
    language_code: string;
    name: string;
    address: string | null;
  }>;
}

export interface ClientSearchDTO {
  id: string;
  website_url: string | null;
  status: string;
  client_translations?: Array<{
    language_code: string;
    name: string;
  }>;
}
