// ==============================================================================
// core/lib/supabase/index.ts — barrel export
// ==============================================================================
export { createClient as createBrowserClient } from "./client";
export { createClient as createServerSupabaseClient } from "./server";
export { createMiddlewareClient } from "./middleware";
