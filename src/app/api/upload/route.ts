// ==============================================================================
// src/app/api/upload/route.ts
// Server-side file upload Route Handler using UploadService
// ==============================================================================
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@core/lib/supabase/server";
import { UploadService, type UploadBucket } from "@core/services/upload.service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as UploadBucket) || "general";
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

    return NextResponse.json({ success: true, url: result.file?.publicUrl, file: result.file });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
