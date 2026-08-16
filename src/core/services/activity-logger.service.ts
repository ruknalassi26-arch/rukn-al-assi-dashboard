// ==============================================================================
// core/services/activity-logger.service.ts
// Centralized Activity Logger Service using create_activity_log RPC
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

    await (supabase.rpc as unknown as (
      fn: string,
      args: Record<string, unknown>
    ) => Promise<{ error: { message: string } | null }>)("create_activity_log", {
      p_action: action,
      p_entity_type: entityType,
      p_entity_id: entityId || null,
      p_details: details || null,
      p_user_agent: userAgent,
    });
  } catch {
    // Non-blocking activity log operation
  }
}
