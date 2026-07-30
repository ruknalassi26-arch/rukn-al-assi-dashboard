// ==============================================================================
// features/about/domain/repositories/i-about.repository.ts
// Repository CONTRACT (interface) for About Us Management
// ==============================================================================
import type {
  CompanyInfoEntity,
  MissionEntity,
  VisionEntity,
  CoreValueEntity,
  TimelineEntity,
  TeamMemberEntity,
  AboutCertificateEntity,
} from "../entities/about.entity";

export interface IAboutRepository {
  // ---------- Company Info ----------
  getCompanyInfo(): Promise<CompanyInfoEntity | null>;
  updateCompanyInfo(data: Partial<CompanyInfoEntity>): Promise<CompanyInfoEntity>;

  // ---------- Mission ----------
  getMission(): Promise<MissionEntity | null>;
  updateMission(data: Partial<MissionEntity>): Promise<MissionEntity>;

  // ---------- Vision ----------
  getVision(): Promise<VisionEntity | null>;
  updateVision(data: Partial<VisionEntity>): Promise<VisionEntity>;

  // ---------- Core Values ----------
  getCoreValues(): Promise<CoreValueEntity[]>;
  createCoreValue(value: Omit<CoreValueEntity, "id" | "createdAt" | "updatedAt">): Promise<CoreValueEntity>;
  updateCoreValue(id: string, value: Partial<CoreValueEntity>): Promise<CoreValueEntity>;
  deleteCoreValue(id: string): Promise<void>;
  reorderCoreValues(orderedIds: string[]): Promise<void>;
  bulkDeleteCoreValues(ids: string[]): Promise<void>;
  bulkUpdateCoreValuesStatus(ids: string[], status: "active" | "draft"): Promise<void>;

  // ---------- Timeline ----------
  getTimeline(): Promise<TimelineEntity[]>;
  createTimeline(item: Omit<TimelineEntity, "id" | "createdAt" | "updatedAt">): Promise<TimelineEntity>;
  updateTimeline(id: string, item: Partial<TimelineEntity>): Promise<TimelineEntity>;
  deleteTimeline(id: string): Promise<void>;
  reorderTimeline(orderedIds: string[]): Promise<void>;
  bulkDeleteTimeline(ids: string[]): Promise<void>;
  bulkUpdateTimelineStatus(ids: string[], status: "active" | "draft"): Promise<void>;

  // ---------- Management Team ----------
  getTeamMembers(): Promise<TeamMemberEntity[]>;
  createTeamMember(member: Omit<TeamMemberEntity, "id" | "createdAt" | "updatedAt">): Promise<TeamMemberEntity>;
  updateTeamMember(id: string, member: Partial<TeamMemberEntity>): Promise<TeamMemberEntity>;
  deleteTeamMember(id: string): Promise<void>;
  reorderTeamMembers(orderedIds: string[]): Promise<void>;
  bulkDeleteTeamMembers(ids: string[]): Promise<void>;
  bulkUpdateTeamMembersStatus(ids: string[], status: "active" | "draft"): Promise<void>;

  // ---------- Certificates ----------
  getCertificates(): Promise<AboutCertificateEntity[]>;
  createCertificate(cert: Omit<AboutCertificateEntity, "id" | "createdAt" | "updatedAt">): Promise<AboutCertificateEntity>;
  updateCertificate(id: string, cert: Partial<AboutCertificateEntity>): Promise<AboutCertificateEntity>;
  deleteCertificate(id: string): Promise<void>;
  reorderCertificates(orderedIds: string[]): Promise<void>;
  bulkDeleteCertificates(ids: string[]): Promise<void>;
  bulkUpdateCertificatesStatus(ids: string[], status: "active" | "draft"): Promise<void>;

  // ---------- Activity Logging ----------
  logActivity(action: string, entityType: string, entityTitle?: string, metadata?: Record<string, unknown>): Promise<void>;
}
