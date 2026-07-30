// ==============================================================================
// features/products/domain/entities/product.entity.ts
// Pure TypeScript entity — NO React, NO Supabase, NO Next.js
// ==============================================================================
import type { ProductStatus } from "../enums/product.enums";

export interface ProductEntity {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  categoryId: string | null;
  images: string[];
  status: ProductStatus;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSummary {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  thumbnailUrl: string | null;
  status: ProductStatus;
  isFeatured: boolean;
}
