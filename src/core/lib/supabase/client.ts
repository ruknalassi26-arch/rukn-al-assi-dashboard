"use client";
// ==============================================================================
// core/lib/supabase/client.ts
// Browser-side Supabase client — use in Client Components
// Uses process.env values directly from environment configuration
// ==============================================================================
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@core/types/database.types";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables");
  }

  return createBrowserClient<Database>(url, key);
}
