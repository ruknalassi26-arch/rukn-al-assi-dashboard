"use client";
// ==============================================================================
// features/profile/presentation/components/avatar-uploader.tsx
// Interactive Avatar Image Uploader with Supabase Storage
// ==============================================================================
import { useState, useRef } from "react";
import { Camera, Loader2, User as UserIcon, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@shared/ui";
import { useUploadAvatarMutation, useUpdateProfileMutation } from "@shared/hooks/profile/use-profile-hooks";
import type { UserProfileEntity } from "@features/authentication/domain/entities/user-profile.entity";

interface AvatarUploaderProps {
  user: UserProfileEntity;
}

export function AvatarUploader({ user }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatarUrl);

  const uploadAvatarMutation = useUploadAvatarMutation();
  const updateProfileMutation = useUpdateProfileMutation();

  const isUploading = uploadAvatarMutation.isPending || updateProfileMutation.isPending;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    // Local preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      // Upload to Supabase Storage
      const uploadedUrl = await uploadAvatarMutation.mutateAsync(file);

      // Update user profile record with new avatar URL
      await updateProfileMutation.mutateAsync({
        fullName: user.fullName,
        phone: user.phone,
        avatarUrl: uploadedUrl,
      });

      setPreviewUrl(uploadedUrl);
    } catch {
      setPreviewUrl(user.avatarUrl);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        fullName: user.fullName,
        phone: user.phone,
        avatarUrl: null,
      });
      setPreviewUrl(null);
    } catch {
      // Revert
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-card border rounded-xl shadow-sm">
      <div className="relative group">
        <Avatar className="h-28 w-28 border-2 border-primary/20 shadow-md">
          <AvatarImage src={previewUrl ?? undefined} alt={user.fullName} className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
            {user.initials || <UserIcon className="h-10 w-10" />}
          </AvatarFallback>
        </Avatar>

        {isUploading && (
          <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 end-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50"
          aria-label="Upload Avatar Picture"
        >
          <Camera className="h-4 w-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex-1 text-center sm:text-start space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{user.fullName}</h3>
        <p className="text-xs text-muted-foreground">
          Allowed formats: JPEG, PNG, WebP or GIF. Max file size: 5MB.
        </p>

        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2 text-xs"
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
            Change Photo
          </Button>

          {previewUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={isUploading}
              className="gap-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove Photo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
