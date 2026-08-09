// ==============================================================================
// features/languages/domain/entities/language.entity.ts
// Domain Entity for System Languages Management
// ==============================================================================

export interface LanguageProps {
  code: string;
  name: string;
  nativeName: string;
  isRtl: boolean;
  isRequired: boolean;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string | null;
}

export class LanguageEntity {
  public readonly code: string;
  public readonly name: string;
  public readonly nativeName: string;
  public readonly isRtl: boolean;
  public readonly isRequired: boolean;
  public readonly isActive: boolean;
  public readonly sortOrder: number;
  public readonly createdAt: string | null;

  constructor(props: LanguageProps) {
    this.code = props.code;
    this.name = props.name;
    this.nativeName = props.nativeName;
    this.isRtl = props.isRtl;
    this.isRequired = props.isRequired;
    this.isActive = props.isActive ?? true;
    this.sortOrder = props.sortOrder ?? 0;
    this.createdAt = props.createdAt ?? null;
  }
}
