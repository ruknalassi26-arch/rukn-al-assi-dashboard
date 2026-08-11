"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Loader2, Image as ImageIcon, FileText } from "lucide-react";
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
  fileType?: "image" | "pdf" | "any";
  accept?: string;
  hintText?: string;
}

export function ImageUploader({
  value,
  onChange,
  bucket = "product-images",
  folder = "uploads",
  label,
  className = "",
  fileType = "image",
  accept,
  hintText,
}: ImageUploaderProps) {
  const t = useTranslations("common.dialogs");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPdf = fileType === "pdf";
  const computedAccept = accept ?? (isPdf ? "application/pdf" : "image/*");
  const defaultHint = isPdf ? "PDF (max 10MB)" : t("imageFormats");
  const displayHint = hintText ?? defaultHint;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isPdf) {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        toast.error("Please select a valid PDF file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("PDF file size should not exceed 10MB");
        return;
      }
    } else if (fileType === "image") {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file (JPEG, PNG, WebP, SVG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size should not exceed 5MB");
        return;
      }
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const uploadService = new UploadService(supabase);
      const result = await uploadService.uploadFile(file, { bucket, folder });

      if (result.success && result.file?.publicUrl) {
        onChange(result.file.publicUrl);
        toast.success(isPdf ? "PDF uploaded successfully" : "Image uploaded successfully");
      } else {
        toast.error(result.error ?? "Failed to upload file");
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
        accept={computedAccept}
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        isPdf ? (
          <div className="relative group rounded-lg border p-4 bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileText className="h-8 w-8 text-primary shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate text-foreground">
                  {value.split("/").pop() || "Document.pdf"}
                </p>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-primary hover:underline"
                >
                  View PDF
                </a>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
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
        )
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors"
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : isPdf ? (
            <FileText className="h-8 w-8 text-muted-foreground" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {isUploading
                ? isPdf
                  ? "Uploading PDF..."
                  : "Uploading image..."
                : isPdf
                ? "Upload Technical PDF Datasheet"
                : t("uploadImage")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{displayHint}</p>
          </div>
        </div>
      )}
    </div>
  );
}
