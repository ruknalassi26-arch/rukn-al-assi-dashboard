// ==============================================================================
// features/leave-management/data/repositories/supabase-leave.repository.ts
// Supabase & RPC implementation of ILeaveRepository (Employee Vacation only)
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type {
  ILeaveRepository,
  CreateLeaveRequestInput,
} from "../../domain/repositories/i-leave.repository";
import type {
  LeaveTypeEntity,
  LeavePolicyEntity,
  LeaveRequestEntity,
  LeaveDashboardEntity,
} from "../../domain/entities";
import {
  toLeaveTypeEntity,
  toLeavePolicyEntity,
  toLeaveRequestEntity,
  toLeaveDashboardEntity,
} from "../mapper/leave.mapper";
import type {
  LeaveTypeDto,
  LeavePolicyDto,
  LeaveRequestDto,
  LeaveDashboardRpcDto,
} from "../dto/leave.dto";

export class SupabaseLeaveRepository implements ILeaveRepository {
  private get supabase() {
    return createClient();
  }

  /**
   * Fetch authoritative dashboard data using get_my_leave_dashboard() RPC
   */
  async getMyLeaveDashboard(): Promise<LeaveDashboardEntity> {
    const { data, error } = await (this.supabase.rpc as CallableFunction)("get_my_leave_dashboard");

    if (error) {
      throw new Error(error.message || "Failed to load leave dashboard data.");
    }

    const parsedData = (typeof data === "string" ? JSON.parse(data) : data) as LeaveDashboardRpcDto;
    return toLeaveDashboardEntity(parsedData || {});
  }

  /**
   * Fetch my leave requests history via get_my_leave_dashboard() RPC
   */
  async getMyLeaveHistory(): Promise<LeaveRequestEntity[]> {
    const dashboard = await this.getMyLeaveDashboard();
    return dashboard.recentRequests;
  }

  /**
   * Create a new leave request via create_leave_request() RPC
   */
  async createLeaveRequest(input: CreateLeaveRequestInput): Promise<LeaveRequestEntity> {
    const { data, error } = await (this.supabase.rpc as CallableFunction)(
      "create_leave_request",
      {
        p_leave_type_id: input.leaveTypeId,
        p_alternative_employee_id: input.alternativeEmployeeId || null,
        p_request_unit: input.requestUnit,
        p_requested_days: input.requestedDays !== null && input.requestedDays !== undefined ? Number(input.requestedDays) : null,
        p_requested_hours: input.requestedHours !== null && input.requestedHours !== undefined ? Number(input.requestedHours) : null,
        p_from_date: input.fromDate,
        p_to_date: input.toDate,
        p_return_to_work_date: input.returnToWorkDate,
        p_note: input.note || null,
      }
    );

    if (error) {
      throw new Error(error.message || "Failed to create leave request.");
    }

    const parsed = (typeof data === "string" ? JSON.parse(data) : data) as LeaveRequestDto;
    return parsed?.id ? toLeaveRequestEntity(parsed) : ({} as LeaveRequestEntity);
  }

  /**
   * Cancel pending leave request via cancel_my_leave_request() RPC
   */
  async cancelMyLeaveRequest(requestId: string): Promise<void> {
    const { error } = await (this.supabase.rpc as CallableFunction)(
      "cancel_my_leave_request",
      { p_request_id: requestId }
    );

    if (error) {
      throw new Error(error.message || "Failed to cancel leave request.");
    }
  }

  /**
   * Get active leave types
   */
  async getActiveLeaveTypes(): Promise<LeaveTypeEntity[]> {
    const { data, error } = await (this.supabase.from("leave_types" as any) as any)
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message || "Failed to load leave types.");
    }

    const dtos = (data || []) as LeaveTypeDto[];
    return dtos.map(toLeaveTypeEntity);
  }

  /**
   * Get active leave policies
   */
  async getActiveLeavePolicies(): Promise<LeavePolicyEntity[]> {
    const { data, error } = await (this.supabase.from("leave_policies" as any) as any)
      .select("*, leave_types (*)")
      .eq("is_active", true);

    if (error) {
      throw new Error(error.message || "Failed to load leave policies.");
    }

    const dtos = (data || []) as LeavePolicyDto[];
    return dtos.map(toLeavePolicyEntity);
  }
}
