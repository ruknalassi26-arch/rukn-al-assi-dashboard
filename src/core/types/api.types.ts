// ==============================================================================
// core/types/api.types.ts
// Generic API response and pagination types
// ==============================================================================

/**
 * Standard API response wrapper.
 * All API responses should conform to this shape.
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

/**
 * Standardised API error shape.
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Paginated response wrapper.
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  error: ApiError | null;
}

/**
 * Pagination metadata.
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Generic filter / sort parameters for list queries.
 */
export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  locale?: string;
}

/**
 * Supabase storage file metadata.
 */
export interface StorageFile {
  id: string;
  name: string;
  bucket: string;
  publicUrl: string;
  size: number;
  contentType: string;
  createdAt: string;
}

/**
 * Generic Result type for use-case return values (Railway Oriented Programming).
 */
export type Result<T, E = ApiError> =
  | { success: true; data: T }
  | { success: false; error: E };
