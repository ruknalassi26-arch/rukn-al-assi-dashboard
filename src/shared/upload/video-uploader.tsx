"use client";
// ==============================================================================
// shared/upload/video-uploader.tsx
// Local Video Uploader component with drag & drop, file picker, upload to Supabase,
// live preview, and URL editing option.
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
} from "lucide-react";
import { Button, Input, Label } from "@shared/ui";
import { createClient } from "@core/lib/supabase/client";
import { UploadService, type UploadBucket } from "@core/services/upload.service";
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
  bucket = "branding",
  folder = "hero-videos",
  label,
  description = "Supports full quality MP4, WebM, QuickTime MOV (HD & 4K allowed)",
  maxSizeMB = 1024,
  disabled = false,
  className = "",
}: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate video mime type or extension
    const isVideoMime = file.type.startsWith("video/");
    const isVideoExt = /\.(mp4|webm|mov|mkv|ogg)$/i.test(file.name);

    if (!isVideoMime && !isVideoExt) {
      toast.error("Please select a valid video file (MP4, WebM, MOV)");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Video file size must not exceed ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const uploadService = new UploadService(supabase);
      const result = await uploadService.uploadFile(file, {
        bucket,
        folder,
      });

      if (result.success && result.file?.publicUrl) {
        onChange(result.file.publicUrl);
        toast.success("Video uploaded successfully from local device!");
      } else {
        toast.error(result.error ?? "Failed to upload video");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload video");
    } finally {
      setIsUploading(false);
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const togglePlay = () => {
    if (!videoPreviewRef.current) return;
    if (videoPreviewRef.current.paused) {
      videoPreviewRef.current.play();
      setIsPlaying(true);
    } else {
      videoPreviewRef.current.pause();
      setIsPlaying(false);
    }
  };

  const fileName = value ? value.split("/").pop() || "Uploaded Video" : "";

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/ogg,video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {value ? (
        /* Video Uploaded Preview State */
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
          {/* Mini video display */}
          <div className="relative aspect-video max-h-[220px] bg-slate-950 flex items-center justify-center group overflow-hidden">
            <video
              ref={videoPreviewRef}
              src={value}
              playsInline
              loop
              muted
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />

            {/* Play/Pause Overlay Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/80 hover:scale-105 transition-all opacity-80 group-hover:opacity-100 shadow-md"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            {/* Top info badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 text-white text-[11px] font-medium backdrop-blur-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Video Loaded</span>
            </div>
          </div>

          {/* Details & Actions Footer */}
          <div className="p-3 bg-muted/30 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 overflow-hidden min-w-0">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <Video className="h-4 w-4" />
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-semibold truncate text-foreground">{fileName}</p>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 truncate"
                >
                  <span className="truncate">{value}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="h-3.5 w-3.5" />
                )}
                Replace Local Video
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowUrlInput(!showUrlInput)}
                title="Edit URL directly"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => onChange(null)}
                disabled={disabled || isUploading}
                title="Remove video"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Optional Direct URL Edit */}
          {showUrlInput && (
            <div className="p-3 border-t bg-muted/50 space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Direct Video URL</Label>
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="font-mono text-xs h-8"
                placeholder="https://..."
              />
            </div>
          )}
        </div>
      ) : (
        /* Empty Dropzone for Local Video Upload */
        <div className="space-y-2">
          <div
            onClick={() => !isUploading && !disabled && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
              isDragging
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[0.99]"
                : "border-muted-foreground/25 hover:border-blue-500/50 bg-muted/20 hover:bg-muted/40"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <div className="h-12 w-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shadow-xs">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              ) : (
                <UploadCloud className="h-6 w-6 text-blue-600" />
              )}
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {isUploading ? "Uploading video from your device..." : "Click to browse or drag & drop video here"}
              </p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>

            {!isUploading && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                className="text-xs pointer-events-none gap-1.5"
              >
                <Video className="h-3.5 w-3.5" />
                Select Local Video File
              </Button>
            )}
          </div>

          {/* Toggle to enter URL manually if needed */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-muted-foreground">Prefer pasting an external URL?</span>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              {showUrlInput ? "Hide URL Input" : "Paste URL Instead"}
            </button>
          </div>

          {showUrlInput && (
            <div className="space-y-1.5 pt-1">
              <Input
                placeholder="https://example.com/videos/hero-background.mp4"
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="font-mono text-xs h-9"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
