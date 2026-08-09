// ==============================================================================
// core/lib/supabase/server.ts
// Server-side Supabase client — use in Server Components, Route Handlers, Actions
// Uses process.env values directly from environment configuration
// ==============================================================================
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@core/types/database.types";

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables");
  }

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
