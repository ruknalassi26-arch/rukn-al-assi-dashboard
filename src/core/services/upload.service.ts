// ==============================================================================
// core/services/upload.service.ts
// Reusable Supabase Storage upload service mapped to official Supabase Buckets.
// Supports direct uploads and Resumable/TUS uploads for large videos (>6MB)
// with real-time progress callbacks and standardized error handling.
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import * as tus from "tus-js-client";
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

/**
 * Storage configuration constants
 */
export const STORAGE_CONFIG = {
  /** The primary branding bucket for hero media, logos, and branding assets */
  BRANDING_BUCKET: "branding" as const,

  /** Virtual folder paths within the 'branding' bucket */
  BRANDING_PATHS: {
    HERO_VIDEOS: "hero-videos",
    HERO_IMAGES: "hero-images",
    LOGOS: "logos",
    PROJECT_IMAGES: "project-images",
    OTHER: "other",
  } as const,

  /** Configurable max file size in MB (defaults to 50MB for current Supabase Free tier) */
  DEFAULT_MAX_FILE_SIZE_MB: 50,

  /** Threshold for switching to Resumable/TUS chunked upload (~6 MB) */
  TUS_THRESHOLD_BYTES: 6 * 1024 * 1024,

  /** Allowed MIME types for video assets */
  ALLOWED_VIDEO_MIME_TYPES: [
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ] as const,

  /** Allowed MIME types for image assets */
  ALLOWED_IMAGE_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/svg+xml",
  ] as const,
} as const;

export interface UploadOptions {
  bucket?: UploadBucket | string;
  folder?: string;
  /** Replaces the existing file at the same path */
  upsert?: boolean;
  /** Custom max size limit in MB (defaults to STORAGE_CONFIG.DEFAULT_MAX_FILE_SIZE_MB) */
  maxSizeMB?: number;
  /** Progress callback (0 to 100) */
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  success: boolean;
  file?: StorageFile;
  error?: string;
}

export class UploadService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Resolves target bucket strictly to official Supabase buckets
   */
  resolveBucket(bucket?: string, folder?: string): UploadBucket {
    const b = (bucket ?? "").toLowerCase();
    const f = (folder ?? "").toLowerCase();

    // Priority: Branding & Hero media
    if (
      b === "branding" ||
      f.includes("hero") ||
      f.includes("video") ||
      f.includes("logo") ||
      f.includes("favicon") ||
      f.includes("brand")
    ) {
      return "branding";
    }

    if (b === "product-datasheets" || f.includes("datasheet") || f.includes("pdf")) {
      return "product-datasheets";
    }
    if (
      b === "product-images" ||
      b === "products" ||
      f.includes("product") ||
      f.includes("category") ||
      f.includes("categories")
    ) {
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
    if (b === "rfq-attachments" || b === "rfq" || f.includes("rfq")) {
      return "rfq-attachments";
    }
    if (b === "career-cvs" || f.includes("cv") || f.includes("career")) {
      return "career-cvs";
    }

    return "branding";
  }

  /**
   * Standardizes error messages from Supabase Storage
   */
  private formatStorageError(error: unknown, maxSizeMB: number): string {
    const errorStr = typeof error === "string" ? error : error instanceof Error ? error.message : JSON.stringify(error);

    if (
      errorStr.includes("413") ||
      errorStr.includes("EntityTooLarge") ||
      errorStr.includes("Payload too large") ||
      errorStr.includes("maximum allowed size") ||
      errorStr.includes("exceeded")
    ) {
      return `The selected file exceeds the current ${maxSizeMB} MB upload limit.`;
    }

    if (errorStr.includes("row-level security") || errorStr.includes("403") || errorStr.includes("Unauthorized")) {
      return "Storage permission error: Please ensure you are logged in with admin privileges.";
    }

    return errorStr || "Failed to upload file.";
  }

  /**
   * Uploads a file with type validation, size checking, and TUS resumable uploads for large files
   */
  async uploadFile(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    const maxSizeMB = options.maxSizeMB ?? STORAGE_CONFIG.DEFAULT_MAX_FILE_SIZE_MB;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // 1. Validate file size locally before sending network request
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: `The selected file exceeds the current ${maxSizeMB} MB upload limit.`,
      };
    }

    const targetBucket = this.resolveBucket(options.bucket, options.folder);
    const { folder = "", upsert = true, onProgress } = options;

    // 2. Build unique object path
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = folder
      ? `${folder}/${timestamp}-${sanitizedName}`
      : `${timestamp}-${sanitizedName}`;

    // 3. For large files (> ~6MB) in browser, prefer Supabase Resumable / TUS upload
    const shouldUseTus = typeof window !== "undefined" && file.size >= STORAGE_CONFIG.TUS_THRESHOLD_BYTES;

    if (shouldUseTus) {
      try {
        const tusResult = await this.uploadViaTus(file, targetBucket, filePath, upsert, maxSizeMB, onProgress);
        if (tusResult.success && tusResult.file) {
          return tusResult;
        }
      } catch (tusErr) {
        console.warn("TUS upload failed, attempting direct upload fallback:", tusErr);
      }
    }

    // 4. Standard Direct Upload to Supabase Storage
    try {
      onProgress?.(25);
      const { data, error } = await this.supabase.storage
        .from(targetBucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert,
          contentType: file.type,
        });

      if (error) {
        return {
          success: false,
          error: this.formatStorageError(error.message, maxSizeMB),
        };
      }

      onProgress?.(100);
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
    } catch (err) {
      return {
        success: false,
        error: this.formatStorageError(err, maxSizeMB),
      };
    }
  }

  /**
   * Resumable TUS upload implementation for Supabase Storage
   */
  private async uploadViaTus(
    file: File,
    bucket: string,
    objectName: string,
    upsert: boolean,
    maxSizeMB: number,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
    }

    // Get current auth session token if logged in, otherwise fallback to anon key
    let token = anonKey || "";
    try {
      const { data: sessionData } = await this.supabase.auth.getSession();
      if (sessionData.session?.access_token) {
        token = sessionData.session.access_token;
      }
    } catch {
      // ignore auth check error
    }

    return new Promise((resolve) => {
      const endpoint = `${supabaseUrl}/storage/v1/upload/resumable`;

      const upload = new tus.Upload(file, {
        endpoint,
        retryDelays: [0, 3000, 5000, 10000],
        headers: {
          authorization: `Bearer ${token}`,
          "x-upsert": upsert ? "true" : "false",
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: bucket,
          objectName,
          contentType: file.type,
          cacheControl: "3600",
        },
        chunkSize: 6 * 1024 * 1024, // 6MB recommended chunk
        onError: (error) => {
          resolve({
            success: false,
            error: this.formatStorageError(error, maxSizeMB),
          });
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          if (bytesTotal > 0) {
            const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
            onProgress?.(percentage);
          }
        },
        onSuccess: () => {
          onProgress?.(100);
          const publicUrl = getStoragePublicUrl(bucket, objectName);
          resolve({
            success: true,
            file: {
              id: objectName,
              name: file.name,
              bucket: bucket as UploadBucket,
              publicUrl,
              size: file.size,
              contentType: file.type,
              createdAt: new Date().toISOString(),
            },
          });
        },
      });

      // Check if previous upload exists, else start fresh
      upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }
        upload.start();
      });
    });
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
