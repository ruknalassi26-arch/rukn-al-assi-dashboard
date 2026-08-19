// ==============================================================================
// src/app/api/upload/route.ts
// Server-side file upload Route Handler using UploadService & Signed URLs
// ==============================================================================
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@core/lib/supabase/server";
import {
  UploadService,
  STORAGE_CONFIG,
  type UploadBucket,
} from "@core/services/upload.service";
import { getStoragePublicUrl } from "@core/utils/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // 1. JSON Request for Signed Upload URL (Fast & avoids Node FormData buffer limits)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const {
        fileName,
        bucket = STORAGE_CONFIG.BRANDING_BUCKET,
        folder = STORAGE_CONFIG.BRANDING_PATHS.HERO_VIDEOS,
      } = body;

      if (!fileName) {
        return NextResponse.json(
          { success: false, error: "fileName is required" },
          { status: 400 }
        );
      }

      const supabase = await createClient();
      const timestamp = Date.now();
      const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = folder
        ? `${folder}/${timestamp}-${sanitizedName}`
        : `${timestamp}-${sanitizedName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(filePath, { upsert: true });

      if (error || !data?.signedUrl) {
        return NextResponse.json(
          { success: false, error: error?.message || "Failed to create signed upload URL" },
          { status: 500 }
        );
      }

      const publicUrl = getStoragePublicUrl(bucket, filePath);

      return NextResponse.json({
        success: true,
        signedUrl: data.signedUrl,
        token: data.token,
        path: filePath,
        publicUrl,
        bucket,
      });
    }

    // 2. Direct FormData fallback for small documents/files
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as UploadBucket) || STORAGE_CONFIG.BRANDING_BUCKET;
    const folder = (formData.get("folder") as string) || "";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const supabase = await createClient();
    const uploadService = new UploadService(supabase);
    const result = await uploadService.uploadFile(file, { bucket, folder });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: result.file?.publicUrl,
      file: result.file,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
