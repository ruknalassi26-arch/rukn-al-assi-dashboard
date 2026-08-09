// ==============================================================================
// features/languages/data/mapper/language.mapper.ts
// Data Mapper transforming Supabase languages row DTO to Domain Entity
// ==============================================================================
import { LanguageEntity } from "../../domain/entities/language.entity";
import type { Tables } from "@core/types/database.types";

export class LanguageMapper {
  static toDomain(dto: Tables<"languages">): LanguageEntity {
    return new LanguageEntity({
      code: dto.code,
      name: dto.name,
      nativeName: dto.native_name,
      isRtl: Boolean(dto.is_rtl),
      isRequired: Boolean(dto.is_required),
      isActive: dto.is_active ?? true,
      sortOrder: dto.sort_order ?? 0,
      createdAt: dto.created_at ?? null,
    });
  }
}
