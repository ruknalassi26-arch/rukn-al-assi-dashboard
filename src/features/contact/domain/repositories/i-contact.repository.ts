// ==============================================================================
// features/contact/domain/repositories/i-contact.repository.ts
// IContactRepository Contract Interface
// ==============================================================================
import type { ContactInfoEntity } from "../entities/contact-info.entity";
import type { BranchEntity, BranchStatus } from "../entities/branch.entity";

export interface BranchFilterParams {
  search?: string;
  status?: BranchStatus | "all";
  page?: number;
  limit?: number;
  sortBy?: "name_en" | "sort_order" | "created_at";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedBranches {
  items: BranchEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateContactInfoInput {
  companyNameEn: string;
  companyNameAr: string;
  companyNameKu?: string | null;
  email?: string | null;
  phone?: string | null;
  phoneSecondary?: string | null;
  addressEn?: string | null;
  addressAr?: string | null;
  addressKu?: string | null;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  workingHoursEn?: string | null;
  workingHoursAr?: string | null;
  workingHoursKu?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  whatsappNumber?: string | null;
  seoTitleEn?: string | null;
  seoTitleAr?: string | null;
  seoTitleKu?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionAr?: string | null;
  seoDescriptionKu?: string | null;
}

export interface CreateBranchInput {
  nameEn: string;
  nameAr: string;
  nameKu?: string | null;
  addressEn?: string | null;
  addressAr?: string | null;
  addressKu?: string | null;
  cityEn?: string | null;
  cityAr?: string | null;
  cityKu?: string | null;
  email?: string | null;
  phone?: string | null;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  workingHoursEn?: string | null;
  workingHoursAr?: string | null;
  workingHoursKu?: string | null;
  isHeadquarters?: boolean;
  sortOrder?: number;
  status?: BranchStatus;
}

export interface UpdateBranchInput extends Partial<CreateBranchInput> {
  id: string;
}

export interface IContactRepository {
  getContactInfo(): Promise<ContactInfoEntity | null>;
  updateContactInfo(input: UpdateContactInfoInput): Promise<ContactInfoEntity>;

  getBranches(params?: BranchFilterParams): Promise<PaginatedBranches>;
  getBranchById(id: string): Promise<BranchEntity | null>;
  createBranch(input: CreateBranchInput): Promise<BranchEntity>;
  updateBranch(input: UpdateBranchInput): Promise<BranchEntity>;
  deleteBranch(id: string): Promise<void>;
  bulkDeleteBranches(ids: string[]): Promise<void>;
  bulkUpdateBranchStatus(ids: string[], status: BranchStatus): Promise<void>;
}
