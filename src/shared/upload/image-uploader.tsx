"use client";
// ==============================================================================
// shared/upload/image-uploader.tsx
// Reusable image & document uploader component supporting 'branding' bucket,
// progress tracking, size validation, and live preview.
// ==============================================================================
import { useState, useRef } from "react";
import Image from "next/image";
import { X, Loader2, Image as ImageIcon, FileText, UploadCloud, RefreshCw } from "lucide-react";
import { createClient } from "@core/lib/supabase/client";
import {
  UploadService,
  STORAGE_CONFIG,
  type UploadBucket,
} from "@core/services/upload.service";
import { Button } from "@shared/ui";
import { toast } from "@core/utils/toast";
import { useTranslations } from "next-intl";

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket?: UploadBucket;
  folder?: string;
  label?: string;
  className?: string;
  fileType?: "image" | "pdf" | "any";
  accept?: string;
  hintText?: string;
  maxSizeMB?: number;
}

export function ImageUploader({
  value,
  onChange,
  bucket = STORAGE_CONFIG.BRANDING_BUCKET,
  folder = STORAGE_CONFIG.BRANDING_PATHS.HERO_IMAGES,
  label,
  className = "",
  fileType = "image",
  accept,
  hintText,
  maxSizeMB = STORAGE_CONFIG.DEFAULT_MAX_FILE_SIZE_MB,
}: ImageUploaderProps) {
  const t = useTranslations("common.dialogs");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPdf = fileType === "pdf";
  const computedAccept =
    accept ??
    (isPdf
      ? "application/pdf"
      : "image/jpeg,image/png,image/webp,image/avif,image/svg+xml,.jpg,.jpeg,.png,.webp,.avif,.svg");
  const defaultHint = isPdf
    ? `PDF (max ${maxSizeMB}MB)`
    : `JPEG, PNG, WebP, AVIF, SVG (max ${maxSizeMB}MB)`;
  const displayHint = hintText ?? defaultHint;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isPdf) {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        toast.error("Please select a valid PDF file");
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`The selected file exceeds the current ${maxSizeMB} MB upload limit.`);
        return;
      }
    } else if (fileType === "image") {
      const isImageMime =
        STORAGE_CONFIG.ALLOWED_IMAGE_MIME_TYPES.includes(file.type as any) ||
        file.type.startsWith("image/");
      const isImageExt = /\.(jpe?g|png|webp|avif|svg)$/i.test(file.name);

      if (!isImageMime && !isImageExt) {
        toast.error("Please select a valid image (JPEG, PNG, WebP, AVIF, SVG)");
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`The selected file exceeds the current ${maxSizeMB} MB upload limit.`);
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const supabase = createClient();
      const uploadService = new UploadService(supabase);
      const result = await uploadService.uploadFile(file, {
        bucket,
        folder,
        maxSizeMB,
        onProgress: (progress) => setUploadProgress(progress),
      });

      if (result.success && result.file?.publicUrl) {
        onChange(result.file.publicUrl);
        toast.success(isPdf ? "PDF uploaded successfully" : "Image uploaded successfully");
      } else {
        toast.error(result.error ?? "Failed to upload file");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload file";
      toast.error(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}

      <input
        ref={fileInputRef}
        type="file"
        accept={computedAccept}
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />

      {value ? (
        <div className="relative group overflow-hidden rounded-xl border border-border bg-muted/20">
          {isPdf ? (
            <div className="flex items-center gap-3 p-4">
              <FileText className="h-8 w-8 text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{value.split("/").pop()}</p>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary hover:underline"
                >
                  View PDF
                </a>
              </div>
            </div>
          ) : (
            <div className="relative aspect-video w-full max-h-[220px] bg-black/5 dark:bg-black/40 flex items-center justify-center">
              <Image
                src={value}
                alt="Uploaded image"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-contain"
                unoptimized
              />
            </div>
          )}

          {/* Action overlay bar */}
          <div className="p-2 bg-muted/60 border-t border-border flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground truncate font-mono">
              {value.split("/").pop()}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2 gap-1"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCw className="h-3 w-3" />
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-7 w-7 p-0"
                disabled={isUploading}
                onClick={handleRemove}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center cursor-pointer transition-all hover:border-primary/60 hover:bg-muted/30 ${
            isUploading ? "opacity-75 pointer-events-none" : ""
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative flex items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <span className="absolute text-[9px] font-bold text-primary">
                  {uploadProgress !== null ? `${uploadProgress}%` : ""}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Uploading...</span>
              {uploadProgress !== null && (
                <div className="w-36 bg-muted rounded-full h-1 overflow-hidden mt-1">
                  <div
                    className="bg-primary h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                {isPdf ? <FileText className="h-5 w-5" /> : <UploadCloud className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {isPdf ? "Upload PDF Document" : "Click or drag image to upload"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{displayHint}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
