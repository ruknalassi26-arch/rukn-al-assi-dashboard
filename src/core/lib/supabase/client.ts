"use client";
// ==============================================================================
// core/lib/supabase/client.ts
// Browser-side Supabase client — use in Client Components
// Includes graceful fallback values if environment variables are missing
// ==============================================================================
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@core/types/database.types";

const FALLBACK_URL = "https://placeholder-project.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDA0ODgwMDAsImV4cCI6MTkxNjA2NDAwMH0.placeholder";

export function createClient() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"] || FALLBACK_URL;
  const key = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] || FALLBACK_KEY;

  return createBrowserClient<Database>(url, key);
}
