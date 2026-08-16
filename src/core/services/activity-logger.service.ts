// ==============================================================================
// core/services/activity-logger.service.ts
// Centralized Activity Logger Service
// Resolves actor identity strictly from the active Supabase Auth Session (auth.uid())
// ==============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";

export async function logSystemActivity(
  supabase: SupabaseClient,
  action: string,
  entityType: string,
  entityId?: string | null,
  details?: Record<string, unknown> | null
): Promise<void> {
  try {
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : null;

    // 1. Primary: Call create_activity_log RPC which resolves auth.uid() on the server
    const response = await (supabase.rpc as unknown as (
      fn: string,
      args: Record<string, unknown>
    ) => Promise<{ error: { message: string } | null }>)("create_activity_log", {
      p_action: action,
      p_entity_type: entityType,
      p_entity_id: entityId || null,
      p_details: details || null,
      p_user_agent: userAgent,
    });

    if (response.error) {
      // 2. Fallback: Direct insert resolving current user ID directly from active session
      const { data: authUser } = await supabase.auth.getUser();
      const currentAdminUserId = authUser?.user?.id || null;

      await (supabase.from("activity_log" as any) as any).insert({
        admin_user_id: currentAdminUserId,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        details: details || null,
        user_agent: userAgent,
      });
    }
  } catch {
    // Non-blocking activity log operation
  }
}
