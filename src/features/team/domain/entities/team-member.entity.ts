// ==============================================================================
// features/team/domain/entities/team-member.entity.ts
// Team Member Domain Entity Class strictly matching Supabase SQL Schema
// ==============================================================================

export type TeamMemberStatus = "active" | "draft";

export interface TeamMemberProps {
  id: string;
  photo?: string | null;
  fullNameEn: string;
  fullNameAr?: string | null;
  fullNameKu?: string | null;
  positionEn?: string | null;
  positionAr?: string | null;
  positionKu?: string | null;
  biographyEn?: string | null;
  biographyAr?: string | null;
  biographyKu?: string | null;
  sortOrder?: number;
  status?: TeamMemberStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TeamMemberEntity {
  public readonly id: string;
  public readonly photo: string | null;
  public readonly fullNameEn: string;
  public readonly fullNameAr: string | null;
  public readonly fullNameKu: string | null;
  public readonly positionEn: string | null;
  public readonly positionAr: string | null;
  public readonly positionKu: string | null;
  public readonly biographyEn: string | null;
  public readonly biographyAr: string | null;
  public readonly biographyKu: string | null;
  public readonly sortOrder: number;
  public readonly status: TeamMemberStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: TeamMemberProps) {
    this.id = props.id;
    this.photo = props.photo ?? null;
    this.fullNameEn = props.fullNameEn;
    this.fullNameAr = props.fullNameAr ?? null;
    this.fullNameKu = props.fullNameKu ?? null;
    this.positionEn = props.positionEn ?? null;
    this.positionAr = props.positionAr ?? null;
    this.positionKu = props.positionKu ?? null;
    this.biographyEn = props.biographyEn ?? null;
    this.biographyAr = props.biographyAr ?? null;
    this.biographyKu = props.biographyKu ?? null;
    this.sortOrder = props.sortOrder ?? 0;
    this.status = props.status ?? "active";
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public get isActive(): boolean {
    return this.status === "active";
  }
}
