"use client";
// ==============================================================================
// shared/upload/video-uploader.tsx
// Local Video Uploader component using Supabase 'branding/hero-videos/' bucket
// Features: Drag & Drop, Type Validation, Size Limits, Upload Progress Bar,
// Resumable/TUS support via UploadService, Live Preview, Replace, and Remove.
// ==============================================================================
import { useState, useRef } from "react";
import {
  UploadCloud,
  Video,
  X,
  Loader2,
  CheckCircle2,
  Play,
  Pause,
  ExternalLink,
  Edit3,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button, Input, Label } from "@shared/ui";
import { createClient } from "@core/lib/supabase/client";
import {
  UploadService,
  STORAGE_CONFIG,
  type UploadBucket,
} from "@core/services/upload.service";
import { toast } from "@core/utils/toast";

interface VideoUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket?: UploadBucket;
  folder?: string;
  label?: string;
  description?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
}

export function VideoUploader({
  value,
  onChange,
  bucket = STORAGE_CONFIG.BRANDING_BUCKET,
  folder = STORAGE_CONFIG.BRANDING_PATHS.HERO_VIDEOS,
  label,
  description = `Supports MP4, WebM, QuickTime MOV (Max ${STORAGE_CONFIG.DEFAULT_MAX_FILE_SIZE_MB}MB)`,
  maxSizeMB = STORAGE_CONFIG.DEFAULT_MAX_FILE_SIZE_MB,
  disabled = false,
  className = "",
}: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // 1. Validate MIME type / extension
    const isVideoMime =
      STORAGE_CONFIG.ALLOWED_VIDEO_MIME_TYPES.includes(file.type as any) ||
      file.type.startsWith("video/");
    const isVideoExt = /\.(mp4|webm|mov)$/i.test(file.name);

    if (!isVideoMime && !isVideoExt) {
      toast.error("Invalid file type. Allowed formats: MP4, WebM, QuickTime (MOV).");
      return;
    }

    // 2. Validate max size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`The selected file exceeds the current ${maxSizeMB} MB upload limit.`);
      return;
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
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
      });

      if (result.success && result.file?.publicUrl) {
        onChange(result.file.publicUrl);
        toast.success("Video uploaded successfully to branding storage!");
      } else {
        toast.error(result.error ?? "Failed to upload video");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload video";
      toast.error(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const togglePlay = () => {
    if (!videoPreviewRef.current) return;
    if (isPlaying) {
      videoPreviewRef.current.pause();
      setIsPlaying(false);
    } else {
      videoPreviewRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setIsPlaying(false);
    setShowUrlInput(false);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5 text-primary" />
            {label}
          </Label>
          {value && (
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Attached
            </span>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />

      {/* When Video is Uploaded / Selected */}
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all group">
          <div className="relative aspect-video w-full max-h-[220px] bg-black/95 flex items-center justify-center">
            <video
              ref={videoPreviewRef}
              src={value}
              className="h-full w-full object-contain"
              playsInline
              onEnded={() => setIsPlaying(false)}
            />

            {/* Video Play/Pause Overlay Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110 shadow-lg"
              title={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
              <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
                <Video className="h-3 w-3 text-primary" />
                Video Active
              </span>
            </div>

            {/* Quick Actions at Top Right */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/10"
                title="Open video in new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="h-7 w-7 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-rose-400/20"
                title="Remove video"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Controls bar */}
          <div className="p-3 bg-muted/30 border-t border-border/60 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate" title={value}>
                {value.split("/").pop() || "Uploaded Video"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                Storage: <span className="font-mono text-primary">{bucket}/{folder}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs px-2.5 gap-1"
                disabled={disabled || isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCw className="h-3 w-3" />
                Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground"
                onClick={() => setShowUrlInput(!showUrlInput)}
              >
                <Edit3 className="h-3 w-3" />
                URL
              </Button>
            </div>
          </div>

          {/* Collapsible Manual URL editor */}
          {showUrlInput && (
            <div className="p-3 bg-background border-t border-border/80 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://..."
                className="h-8 text-xs font-mono"
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-8 text-xs"
                onClick={() => setShowUrlInput(false)}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Upload Drag & Drop Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !isUploading) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled && !isUploading) fileInputRef.current?.click();
          }}
          className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer p-6 flex flex-col items-center justify-center text-center group ${
            isDragging
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border hover:border-primary/60 hover:bg-muted/30"
          } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <div className="relative flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="absolute text-[10px] font-bold text-primary">
                  {uploadProgress !== null ? `${uploadProgress}%` : ""}
                </span>
              </div>
              <div className="w-full space-y-1 text-center">
                <p className="text-xs font-semibold text-foreground">Uploading Video...</p>
                <p className="text-[10px] text-muted-foreground">Streaming to {bucket}/{folder}</p>
                {uploadProgress !== null && (
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mt-2">
                    <div
                      className="bg-primary h-full transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-foreground mb-1">
                Click to upload or drag & drop video
              </p>
              <p className="text-[11px] text-muted-foreground mb-3 max-w-xs">
                {description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                  MP4, WebM, MOV
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                  Max {maxSizeMB}MB
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Manual URL Input Option for Empty State */}
      {!value && !isUploading && (
        <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-primary hover:underline flex items-center gap-1"
          >
            <Edit3 className="h-3 w-3" />
            {showUrlInput ? "Hide Direct URL input" : "Or enter direct video URL"}
          </button>
        </div>
      )}

      {!value && showUrlInput && !isUploading && (
        <div className="flex items-center gap-2 pt-1 animate-in fade-in">
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/videos/hero-background.mp4"
            className="h-8 text-xs font-mono"
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-8 text-xs"
            onClick={() => setShowUrlInput(false)}
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
