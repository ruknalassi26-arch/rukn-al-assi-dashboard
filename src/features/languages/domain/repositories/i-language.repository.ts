// ==============================================================================
// features/languages/domain/repositories/i-language.repository.ts
// Repository interface contract for Language Management
// ==============================================================================
import type { LanguageEntity } from "../entities/language.entity";

export interface CreateLanguageInput {
  code: string;
  name: string;
  nativeName: string;
  isRtl: boolean;
  isRequired: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateLanguageInput {
  name?: string;
  nativeName?: string;
  isRtl?: boolean;
  isRequired?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

export interface ILanguageRepository {
  getLanguages(): Promise<LanguageEntity[]>;
  getLanguageByCode(code: string): Promise<LanguageEntity | null>;
  createLanguage(input: CreateLanguageInput): Promise<LanguageEntity>;
  updateLanguage(code: string, input: UpdateLanguageInput): Promise<LanguageEntity>;
  deleteLanguage(code: string): Promise<void>;
}
