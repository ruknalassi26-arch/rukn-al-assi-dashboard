// ==============================================================================
// core/services/upload.service.ts
// Reusable Supabase Storage upload service
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";

import type { StorageFile } from "@core/types/api.types";
import type { Database } from "@core/types/database.types";

export type UploadBucket = "products" | "services" | "projects" | "rfq" | "certificates" | "team" | "branding" | "seo" | "general";

export interface UploadOptions {
  bucket: UploadBucket;
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
 * Supports images, PDFs, and documents.
 */
export class UploadService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
    const { bucket, folder = "", upsert = false } = options;

    // Build a unique file path to avoid collisions
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = folder
      ? `${folder}/${timestamp}-${sanitizedName}`
      : `${timestamp}-${sanitizedName}`;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert,
        contentType: file.type,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      file: {
        id: data.id ?? data.path,
        name: file.name,
        bucket,
        publicUrl: urlData.publicUrl,
        size: file.size,
        contentType: file.type,
        createdAt: new Date().toISOString(),
      },
    };
  }

  async deleteFile(bucket: UploadBucket, path: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  getPublicUrl(bucket: UploadBucket, path: string): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
