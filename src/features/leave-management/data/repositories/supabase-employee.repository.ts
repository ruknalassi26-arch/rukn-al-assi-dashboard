// ==============================================================================
// features/leave-management/data/repositories/supabase-employee.repository.ts
// Supabase implementation of IEmployeeRepository
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type { IEmployeeRepository } from "../../domain/repositories/i-employee.repository";
import type { EmployeeProfileEntity } from "../../domain/entities";
import { toEmployeeProfileEntity } from "../mapper/leave.mapper";
import type { EmployeeProfileDto } from "../dto/leave.dto";

export class SupabaseEmployeeRepository implements IEmployeeRepository {
  private get supabase() {
    return createClient();
  }

  /**
   * Get current authenticated employee ID using get_current_employee_id() RPC
   */
  async getCurrentEmployeeId(): Promise<string | null> {
    try {
      const { data, error } = await (this.supabase.rpc as CallableFunction)("get_current_employee_id");
      if (error || !data) return null;
      return typeof data === "string" ? data : String(data);
    } catch {
      return null;
    }
  }

  /**
   * Get all active employees using get_active_employees() RPC with ZERO parameters
   */
  async getActiveEmployees(): Promise<EmployeeProfileEntity[]> {
    const { data: rpcData, error: rpcError } = await (this.supabase.rpc as CallableFunction)(
      "get_active_employees"
    );

    if (rpcError) {
      throw new Error(rpcError.message || "Failed to load active employees via get_active_employees RPC.");
    }

    const rawList = (typeof rpcData === "string" ? JSON.parse(rpcData) : rpcData) || [];
    const dtos = (Array.isArray(rawList) ? rawList : []) as EmployeeProfileDto[];
    return dtos.map(toEmployeeProfileEntity);
  }

  /**
   * Get current employee profile if exists
   */
  async getCurrentEmployeeProfile(): Promise<EmployeeProfileEntity | null> {
    const { data: userData } = await this.supabase.auth.getUser();
    const authUserId = userData.user?.id;

    if (!authUserId) return null;

    const { data, error } = await (this.supabase.from("employee_profiles" as any) as any)
      .select("*")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (error || !data) return null;
    return toEmployeeProfileEntity(data as EmployeeProfileDto);
  }
}
