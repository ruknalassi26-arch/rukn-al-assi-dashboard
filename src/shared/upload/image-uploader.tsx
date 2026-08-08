"use client";
// ==============================================================================
// shared/upload/image-uploader.tsx
// Reusable Image Uploader component using UploadService
// ==============================================================================
import { useState, useRef } from "react";
import Image from "next/image";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@core/lib/supabase/client";
import { UploadService, type UploadBucket } from "@core/services/upload.service";
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
}

export function ImageUploader({
  value,
  onChange,
  bucket = "general",
  folder = "uploads",
  label = "Upload Image",
  className = "",
}: ImageUploaderProps) {
  const t = useTranslations("common.dialogs");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP, SVG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should not exceed 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const uploadService = new UploadService(supabase);
      const result = await uploadService.uploadFile(file, { bucket, folder });

      if (result.success && result.file?.publicUrl) {
        onChange(result.file.publicUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.error ?? "Failed to upload image");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setIsUploading(false);
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
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative group rounded-lg border overflow-hidden bg-muted aspect-video max-h-[180px] flex items-center justify-center">
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            className="object-contain p-2"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors"
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {isUploading ? "Uploading image..." : t("uploadImage")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("imageFormats")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
