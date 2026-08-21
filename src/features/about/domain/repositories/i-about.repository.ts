// ==============================================================================
// features/about/domain/repositories/i-about.repository.ts
// Repository CONTRACT (interface) for About Us Management
// Strictly matching Supabase DB Schema
// ==============================================================================
import type {
  CompanyInfoEntity,
  CoreValueEntity,
  TimelineEntity,
  TeamMemberEntity,
  AboutCertificateEntity,
  SectionStatus,
} from "../entities/about.entity";

export interface UpdateCompanyInfoTranslationInput {
  language_code: string;
  history: string;
  mission: string;
  vision: string;
}

export interface SaveCoreValueInput {
  id?: string;
  icon?: string | null;
  sortOrder?: number;
  status?: SectionStatus;
  translations: Record<string, { title: string; description: string }>;
}

export interface SaveTimelineInput {
  id?: string;
  eventYear: string | number;
  sortOrder?: number;
  status?: SectionStatus;
  translations: Record<string, { title: string; description: string }>;
}

export interface SaveTeamMemberInput {
  id?: string;
  photoUrl?: string | null;
  sortOrder?: number;
  status?: SectionStatus;
  translations: Record<string, { name: string; position: string; bio: string }>;
}

export interface SaveCertificateInput {
  id?: string;
  imageUrl?: string | null;
  issuedBy?: string | null;
  issuedDate?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  featuredOrder?: number | null;
  status?: SectionStatus;
  translations: Record<string, { title: string; description: string }>;
}

export interface IAboutRepository {
  // ---------- Company Info ----------
  getCompanyInfo(): Promise<CompanyInfoEntity | null>;
  updateCompanyInfoTranslation(input: UpdateCompanyInfoTranslationInput): Promise<CompanyInfoEntity>;
  updateCompanyInfoTranslationsBatch(inputs: UpdateCompanyInfoTranslationInput[]): Promise<CompanyInfoEntity>;

  // ---------- Core Values ----------
  getCoreValues(): Promise<CoreValueEntity[]>;
  createCoreValue(input: SaveCoreValueInput): Promise<CoreValueEntity>;
  updateCoreValue(id: string, input: SaveCoreValueInput): Promise<CoreValueEntity>;
  deleteCoreValue(id: string): Promise<void>;
  reorderCoreValues(orderedIds: string[]): Promise<void>;
  bulkDeleteCoreValues(ids: string[]): Promise<void>;
  bulkUpdateCoreValuesStatus(ids: string[], status: SectionStatus): Promise<void>;

  // ---------- Timeline ----------
  getTimeline(): Promise<TimelineEntity[]>;
  createTimeline(input: SaveTimelineInput): Promise<TimelineEntity>;
  updateTimeline(id: string, input: SaveTimelineInput): Promise<TimelineEntity>;
  deleteTimeline(id: string): Promise<void>;
  reorderTimeline(orderedIds: string[]): Promise<void>;
  bulkDeleteTimeline(ids: string[]): Promise<void>;
  bulkUpdateTimelineStatus(ids: string[], status: SectionStatus): Promise<void>;

  // ---------- Management Team ----------
  getTeamMembers(): Promise<TeamMemberEntity[]>;
  createTeamMember(input: SaveTeamMemberInput): Promise<TeamMemberEntity>;
  updateTeamMember(id: string, input: SaveTeamMemberInput): Promise<TeamMemberEntity>;
  deleteTeamMember(id: string): Promise<void>;
  reorderTeamMembers(orderedIds: string[]): Promise<void>;
  bulkDeleteTeamMembers(ids: string[]): Promise<void>;
  bulkUpdateTeamMembersStatus(ids: string[], status: SectionStatus): Promise<void>;

  // ---------- Certificates ----------
  getCertificates(): Promise<AboutCertificateEntity[]>;
  createCertificate(input: SaveCertificateInput): Promise<AboutCertificateEntity>;
  updateCertificate(id: string, input: SaveCertificateInput): Promise<AboutCertificateEntity>;
  deleteCertificate(id: string): Promise<void>;
  reorderCertificates(orderedIds: string[]): Promise<void>;
  bulkDeleteCertificates(ids: string[]): Promise<void>;
  bulkUpdateCertificatesStatus(ids: string[], status: SectionStatus): Promise<void>;

  // ---------- Activity Logging ----------
  logActivity(action: string, entityType: string, entityTitle?: string, metadata?: Record<string, unknown>): Promise<void>;
}
