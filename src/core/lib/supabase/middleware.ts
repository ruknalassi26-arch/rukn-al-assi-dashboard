// ==============================================================================
// core/lib/supabase/middleware.ts
// Supabase client for use inside Next.js middleware
// Includes graceful fallback values if environment variables are missing
// ==============================================================================
import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { Database } from "@core/types/database.types";

const FALLBACK_URL = "https://placeholder-project.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDA0ODgwMDAsImV4cCI6MTkxNjA2NDAwMH0.placeholder";

export function createMiddlewareClient(request: NextRequest, response: NextResponse) {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"] || FALLBACK_URL;
  const key = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] || FALLBACK_KEY;

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  return { supabase, response };
}
