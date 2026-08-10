// ==============================================================================
// features/about/data/mapper/about.mapper.ts
// Maps between Supabase DTOs and Domain Entity Classes for About Us Management
// ==============================================================================
import {
  CompanyInfoEntity,
  CoreValueEntity,
  TimelineEntity,
  TeamMemberEntity,
  AboutCertificateEntity,
} from "../../domain/entities/about.entity";

export function toCompanyInfoEntity(data: any): CompanyInfoEntity {
  const transList: any[] = data.company_profile_translations || [];
  const translations: Record<string, { history: string; mission: string; vision: string }> = {};

  for (const t of transList) {
    if (t.language_code) {
      translations[t.language_code] = {
        history: t.history || "",
        mission: t.mission || "",
        vision: t.vision || "",
      };
    }
  }

  return new CompanyInfoEntity({
    id: String(data.id || 1),
    translations,
    updatedAt: new Date(data.updated_at || Date.now()),
  });
}
