// ==============================================================================
// features/contact/domain/entities/branch.entity.ts
// Branch Domain Entity Class
// ==============================================================================

export type BranchStatus = "active" | "draft";

export interface BranchProps {
  id: string;
  nameEn: string;
  nameAr: string;
  nameKu?: string | null;
  addressEn: string | null;
  addressAr: string | null;
  addressKu?: string | null;
  cityEn: string | null;
  cityAr: string | null;
  cityKu?: string | null;
  email: string | null;
  phone: string | null;
  googleMapsUrl: string | null;
  latitude?: number | null;
  longitude?: number | null;
  workingHoursEn: string | null;
  workingHoursAr: string | null;
  workingHoursKu?: string | null;
  isHeadquarters: boolean;
  sortOrder: number;
  status: BranchStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class BranchEntity {
  public readonly id: string;
  public readonly nameEn: string;
  public readonly nameAr: string;
  public readonly nameKu: string | null;
  public readonly addressEn: string | null;
  public readonly addressAr: string | null;
  public readonly addressKu: string | null;
  public readonly cityEn: string | null;
  public readonly cityAr: string | null;
  public readonly cityKu: string | null;
  public readonly email: string | null;
  public readonly phone: string | null;
  public readonly googleMapsUrl: string | null;
  public readonly latitude: number | null;
  public readonly longitude: number | null;
  public readonly workingHoursEn: string | null;
  public readonly workingHoursAr: string | null;
  public readonly workingHoursKu: string | null;
  public readonly isHeadquarters: boolean;
  public readonly sortOrder: number;
  public readonly status: BranchStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: BranchProps) {
    this.id = props.id;
    this.nameEn = props.nameEn;
    this.nameAr = props.nameAr;
    this.nameKu = props.nameKu ?? null;
    this.addressEn = props.addressEn;
    this.addressAr = props.addressAr;
    this.addressKu = props.addressKu ?? null;
    this.cityEn = props.cityEn;
    this.cityAr = props.cityAr;
    this.cityKu = props.cityKu ?? null;
    this.email = props.email;
    this.phone = props.phone;
    this.googleMapsUrl = props.googleMapsUrl;
    this.latitude = props.latitude ?? null;
    this.longitude = props.longitude ?? null;
    this.workingHoursEn = props.workingHoursEn;
    this.workingHoursAr = props.workingHoursAr;
    this.workingHoursKu = props.workingHoursKu ?? null;
    this.isHeadquarters = props.isHeadquarters;
    this.sortOrder = props.sortOrder;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public get isActive(): boolean {
    return this.status === "active";
  }
}
