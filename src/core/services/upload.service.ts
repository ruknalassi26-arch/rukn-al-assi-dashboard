// ==============================================================================
// core/services/upload.service.ts
// Reusable Supabase Storage upload service mapped to official Supabase Buckets
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { StorageFile } from "@core/types/api.types";
import type { Database } from "@core/types/database.types";
import { getStoragePublicUrl } from "@core/utils/storage";

export type UploadBucket =
  | "branding"
  | "product-images"
  | "product-datasheets"
  | "service-images"
  | "project-images"
  | "team-photos"
  | "certificates"
  | "rfq-attachments"
  | "career-cvs";

export interface UploadOptions {
  bucket?: UploadBucket | string;
  folder?: string;
  /** Replaces the existing file at the same path */
  upsert?: boolean;
}

export interface UploadResult {
  success: boolean;
  file?: StorageFile;
  error?: string;
}

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * Strictly maps upload targets to exact Supabase Storage Buckets.
 */
export class UploadService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  private resolveBucket(bucket?: string, folder?: string): UploadBucket {
    const b = (bucket ?? "").toLowerCase();
    const f = (folder ?? "").toLowerCase();

    if (b === "product-datasheets" || f.includes("datasheet") || f.includes("pdf")) {
      return "product-datasheets";
    }
    if (b === "product-images" || b === "products" || f.includes("product") || f.includes("category") || f.includes("categories")) {
      return "product-images";
    }
    if (b === "service-images" || b === "services" || f.includes("service")) {
      return "service-images";
    }
    if (b === "project-images" || b === "projects" || f.includes("project")) {
      return "project-images";
    }
    if (b === "team-photos" || b === "team" || f.includes("team")) {
      return "team-photos";
    }
    if (b === "certificates" || f.includes("cert")) {
      return "certificates";
    }
    if (b === "branding" || f.includes("logo") || f.includes("favicon") || f.includes("brand")) {
      return "branding";
    }
    if (b === "rfq-attachments" || b === "rfq" || f.includes("rfq")) {
      return "rfq-attachments";
    }
    if (b === "career-cvs" || f.includes("cv") || f.includes("career")) {
      return "career-cvs";
    }

    return "product-images";
  }

  async uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
    const targetBucket = this.resolveBucket(options.bucket, options.folder);
    const { folder = "", upsert = false } = options;

    // Build a unique file path to avoid collisions
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = folder
      ? `${folder}/${timestamp}-${sanitizedName}`
      : `${timestamp}-${sanitizedName}`;

    const { data, error } = await this.supabase.storage
      .from(targetBucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert,
        contentType: file.type,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const publicUrl = getStoragePublicUrl(targetBucket, data.path);

    return {
      success: true,
      file: {
        id: data.id ?? data.path,
        name: file.name,
        bucket: targetBucket,
        publicUrl,
        size: file.size,
        contentType: file.type,
        createdAt: new Date().toISOString(),
      },
    };
  }

  async deleteFile(bucket: UploadBucket | string, path: string): Promise<{ success: boolean; error?: string }> {
    const targetBucket = this.resolveBucket(bucket);
    const { error } = await this.supabase.storage.from(targetBucket).remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  getPublicUrl(bucket: UploadBucket | string, path: string): string {
    const targetBucket = this.resolveBucket(bucket);
    return getStoragePublicUrl(targetBucket, path);
  }
}
