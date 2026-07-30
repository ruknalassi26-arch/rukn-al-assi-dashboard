// ==============================================================================
// features/homepage/domain/repositories/i-homepage.repository.ts
// Repository CONTRACT (interface) for Homepage Management
// ==============================================================================
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
} from "../entities/homepage.entity";

export interface IHomepageRepository {
  // ---------- Hero Section ----------
  getHeroSlides(): Promise<HeroSlideEntity[]>;
  createHeroSlide(slide: Omit<HeroSlideEntity, "id" | "createdAt" | "updatedAt">): Promise<HeroSlideEntity>;
  updateHeroSlide(id: string, slide: Partial<HeroSlideEntity>): Promise<HeroSlideEntity>;
  deleteHeroSlide(id: string): Promise<void>;
  reorderHeroSlides(orderedIds: string[]): Promise<void>;

  // ---------- About Section ----------
  getAboutPreview(): Promise<AboutPreviewEntity | null>;
  updateAboutPreview(data: Partial<AboutPreviewEntity>): Promise<AboutPreviewEntity>;

  // ---------- Company Statistics ----------
  getCompanyStats(): Promise<CompanyStatEntity[]>;
  createCompanyStat(stat: Omit<CompanyStatEntity, "id" | "createdAt" | "updatedAt">): Promise<CompanyStatEntity>;
  updateCompanyStat(id: string, stat: Partial<CompanyStatEntity>): Promise<CompanyStatEntity>;
  deleteCompanyStat(id: string): Promise<void>;
  reorderCompanyStats(orderedIds: string[]): Promise<void>;
  bulkDeleteCompanyStats(ids: string[]): Promise<void>;
  bulkUpdateCompanyStatsStatus(ids: string[], status: "active" | "draft"): Promise<void>;

  // ---------- Featured Services ----------
  getFeaturedServices(): Promise<FeaturedServiceEntity[]>;
  toggleServiceFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void>;
  reorderFeaturedServices(orderedIds: string[]): Promise<void>;

  // ---------- Featured Products ----------
  getFeaturedProducts(): Promise<FeaturedProductEntity[]>;
  toggleProductFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void>;
  reorderFeaturedProducts(orderedIds: string[]): Promise<void>;

  // ---------- Featured Projects ----------
  getFeaturedProjects(): Promise<FeaturedProjectEntity[]>;
  toggleProjectFeatured(id: string, isFeatured: boolean, sortOrder?: number): Promise<void>;
  reorderFeaturedProjects(orderedIds: string[]): Promise<void>;

  // ---------- Clients ----------
  getClients(): Promise<ClientEntity[]>;
  createClient(client: Omit<ClientEntity, "id" | "createdAt" | "updatedAt">): Promise<ClientEntity>;
  updateClient(id: string, client: Partial<ClientEntity>): Promise<ClientEntity>;
  deleteClient(id: string): Promise<void>;
  reorderClients(orderedIds: string[]): Promise<void>;
  bulkDeleteClients(ids: string[]): Promise<void>;
  bulkUpdateClientsStatus(ids: string[], status: "active" | "draft"): Promise<void>;

  // ---------- Certificates ----------
  getCertificates(): Promise<CertificateEntity[]>;
  createCertificate(certificate: Omit<CertificateEntity, "id" | "createdAt" | "updatedAt">): Promise<CertificateEntity>;
  updateCertificate(id: string, certificate: Partial<CertificateEntity>): Promise<CertificateEntity>;
  deleteCertificate(id: string): Promise<void>;
  reorderCertificates(orderedIds: string[]): Promise<void>;
  bulkDeleteCertificates(ids: string[]): Promise<void>;
  bulkUpdateCertificatesStatus(ids: string[], status: "active" | "draft"): Promise<void>;

  // ---------- Contact CTA ----------
  getContactCta(): Promise<ContactCtaEntity | null>;
  updateContactCta(data: Partial<ContactCtaEntity>): Promise<ContactCtaEntity>;

  // ---------- Activity Logging ----------
  logActivity(action: string, entityType: string, entityTitle?: string, metadata?: Record<string, unknown>): Promise<void>;
}
