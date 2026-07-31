// ==============================================================================
// core/constants/query-keys.ts
// TanStack Query key factory — centralised, type-safe, tree-shakeable
// ==============================================================================

/**
 * Query key factory following the @lukemorales/query-key-factory pattern.
 * Keys are structured as arrays to allow for precise invalidation.
 *
 * Usage:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
 *   queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(slug) })
 */
export const queryKeys = {
  // ---------- Products ----------
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.products.details(), slug] as const,
  },

  // ---------- Categories ----------
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  // ---------- Services ----------
  services: {
    all: ["services"] as const,
    lists: () => [...queryKeys.services.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
  },

  // ---------- Projects ----------
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    detail: (slug: string) => [...queryKeys.projects.all, "detail", slug] as const,
  },

  // ---------- RFQ ----------
  rfq: {
    all: ["rfq"] as const,
    lists: () => [...queryKeys.rfq.all, "list"] as const,
    detail: (id: string) => [...queryKeys.rfq.all, "detail", id] as const,
  },

  // ---------- Contact Info ----------
  contact: {
    all: ["contact"] as const,
    info: () => [...queryKeys.contact.all, "info"] as const,
    branches: () => [...queryKeys.contact.all, "branches"] as const,
    branchList: (filters: Record<string, unknown>) =>
      [...queryKeys.contact.branches(), filters] as const,
    branchDetail: (id: string) => [...queryKeys.contact.branches(), id] as const,
  },

  // ---------- Contact Messages (Inbox) ----------
  contactMessages: {
    all: ["contact-messages"] as const,
    lists: () => [...queryKeys.contactMessages.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.contactMessages.lists(), filters] as const,
    details: () => [...queryKeys.contactMessages.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.contactMessages.details(), id] as const,
  },

  // ---------- Dashboard ----------
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    charts: (months?: number) => [...queryKeys.dashboard.all, "charts", { months }] as const,
    latestRfqs: (limit?: number) => [...queryKeys.dashboard.all, "latest-rfqs", { limit }] as const,
    latestContacts: (limit?: number) => [...queryKeys.dashboard.all, "latest-contacts", { limit }] as const,
    recentActivity: (limit?: number) => [...queryKeys.dashboard.all, "recent-activity", { limit }] as const,
  },

  // ---------- Homepage ----------
  homepage: {
    all: ["homepage"] as const,
    hero: () => [...queryKeys.homepage.all, "hero"] as const,
    about: () => [...queryKeys.homepage.all, "about"] as const,
    statistics: () => [...queryKeys.homepage.all, "statistics"] as const,
    featuredServices: () => [...queryKeys.homepage.all, "featured-services"] as const,
    featuredProducts: () => [...queryKeys.homepage.all, "featured-products"] as const,
    featuredProjects: () => [...queryKeys.homepage.all, "featured-projects"] as const,
    clients: () => [...queryKeys.homepage.all, "clients"] as const,
    certificates: () => [...queryKeys.homepage.all, "certificates"] as const,
    contactCta: () => [...queryKeys.homepage.all, "contact-cta"] as const,
  },

  // ---------- About ----------
  about: {
    all: ["about"] as const,
    companyInfo: () => [...queryKeys.about.all, "company-info"] as const,
    mission: () => [...queryKeys.about.all, "mission"] as const,
    vision: () => [...queryKeys.about.all, "vision"] as const,
    coreValues: () => [...queryKeys.about.all, "core-values"] as const,
    timeline: () => [...queryKeys.about.all, "timeline"] as const,
    team: () => [...queryKeys.about.all, "team"] as const,
    certificates: () => [...queryKeys.about.all, "certificates"] as const,
  },

  // ---------- Certificates ----------
  certificates: {
    all: ["certificates"] as const,
    lists: () => [...queryKeys.certificates.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.certificates.lists(), filters] as const,
    details: () => [...queryKeys.certificates.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.certificates.details(), id] as const,
  },

  // ---------- Team Members ----------
  team: {
    all: ["team"] as const,
    lists: () => [...queryKeys.team.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.team.lists(), filters] as const,
    details: () => [...queryKeys.team.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.team.details(), id] as const,
  },

  // ---------- SEO ----------
  seo: {
    all: ["seo"] as const,
    pages: () => [...queryKeys.seo.all, "pages"] as const,
    byPage: (pageKey: string) => [...queryKeys.seo.pages(), pageKey] as const,
  },

  // ---------- Website Settings ----------
  settings: {
    all: ["settings"] as const,
    website: () => [...queryKeys.settings.all, "website"] as const,
    branding: () => [...queryKeys.settings.all, "branding"] as const,
  },

  // ---------- Auth ----------
  auth: {
    session: ["auth", "session"] as const,
    user: ["auth", "user"] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
