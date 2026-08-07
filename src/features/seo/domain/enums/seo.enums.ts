// ==============================================================================
// features/seo/domain/enums/seo.enums.ts
// Supported Public Page Labels & Slugs
// ==============================================================================
import type { SeoPageKey } from "../entities/seo-setting.entity";

export const SEO_PAGE_LABELS: Record<SeoPageKey, { label: string; urlPath: string }> = {
  home: { label: "Home Page", urlPath: "/" },
  about: { label: "About Us Page", urlPath: "/about" },
  products: { label: "Products Catalog Page", urlPath: "/products" },
  categories: { label: "Categories Page", urlPath: "/categories" },
  services: { label: "Services Page", urlPath: "/services" },
  projects: { label: "Projects Portfolio Page", urlPath: "/projects" },
  certificates: { label: "Certificates Page", urlPath: "/certificates" },
  contact: { label: "Contact Us Page", urlPath: "/contact" },
  careers: { label: "Careers Page", urlPath: "/careers" },
};
