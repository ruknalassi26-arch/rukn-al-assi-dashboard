// ==============================================================================
// core/lib/supabase/server.ts
// Server-side Supabase client — use in Server Components, Route Handlers, Actions
// Includes graceful fallback values if environment variables are missing
// ==============================================================================
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@core/types/database.types";

const FALLBACK_URL = "https://placeholder-project.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDA0ODgwMDAsImV4cCI6MTkxNjA2NDAwMH0.placeholder";

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"] || FALLBACK_URL;
  const key = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] || FALLBACK_KEY;

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Safe to ignore if middleware handles session refresh.
        }
      },
    },
  });
}
