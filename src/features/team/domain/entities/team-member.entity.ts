// ==============================================================================
// features/team/domain/entities/team-member.entity.ts
// Team Member Domain Entity Class following Clean Architecture
// ==============================================================================

export type TeamMemberStatus = "active" | "draft";

export interface TeamMemberProps {
  id: string;
  photo: string | null;
  fullNameEn: string;
  fullNameAr: string;
  fullNameKu?: string | null;
  positionEn: string | null;
  positionAr: string | null;
  positionKu?: string | null;
  departmentEn?: string | null;
  departmentAr?: string | null;
  departmentKu?: string | null;
  biographyEn: string | null;
  biographyAr: string | null;
  biographyKu?: string | null;
  linkedin: string | null;
  email: string | null;
  phone: string | null;
  sortOrder: number;
  status: TeamMemberStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class TeamMemberEntity {
  public readonly id: string;
  public readonly photo: string | null;
  public readonly fullNameEn: string;
  public readonly fullNameAr: string;
  public readonly fullNameKu: string | null;
  public readonly positionEn: string | null;
  public readonly positionAr: string | null;
  public readonly positionKu: string | null;
  public readonly departmentEn: string | null;
  public readonly departmentAr: string | null;
  public readonly departmentKu: string | null;
  public readonly biographyEn: string | null;
  public readonly biographyAr: string | null;
  public readonly biographyKu: string | null;
  public readonly linkedin: string | null;
  public readonly email: string | null;
  public readonly phone: string | null;
  public readonly sortOrder: number;
  public readonly status: TeamMemberStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: TeamMemberProps) {
    this.id = props.id;
    this.photo = props.photo;
    this.fullNameEn = props.fullNameEn;
    this.fullNameAr = props.fullNameAr;
    this.fullNameKu = props.fullNameKu ?? null;
    this.positionEn = props.positionEn;
    this.positionAr = props.positionAr;
    this.positionKu = props.positionKu ?? null;
    this.departmentEn = props.departmentEn ?? null;
    this.departmentAr = props.departmentAr ?? null;
    this.departmentKu = props.departmentKu ?? null;
    this.biographyEn = props.biographyEn;
    this.biographyAr = props.biographyAr;
    this.biographyKu = props.biographyKu ?? null;
    this.linkedin = props.linkedin;
    this.email = props.email;
    this.phone = props.phone;
    this.sortOrder = props.sortOrder;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public get isActive(): boolean {
    return this.status === "active";
  }
}
