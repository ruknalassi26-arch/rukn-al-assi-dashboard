// ==============================================================================
// core/utils/storage.ts
// Supabase Storage Public URL helper using NEXT_PUBLIC_SUPABASE_STORAGE_URL
// ==============================================================================

/**
 * Returns full public image URL using NEXT_PUBLIC_SUPABASE_STORAGE_URL from env.local
 */
export function getStoragePublicUrl(bucket: string, path: string): string {
  if (!path) return "";
  // Return early if path is already a full URL or blob
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  const storageBaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL ||
    `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pgslnuvcpwkhqcfiflpi.supabase.co"}/storage/v1/object/public`;

  const cleanBase = storageBaseUrl.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  return `${cleanBase}/${bucket}/${cleanPath}`;
}
