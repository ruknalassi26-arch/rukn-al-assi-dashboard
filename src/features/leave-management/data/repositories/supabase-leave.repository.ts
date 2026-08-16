// ==============================================================================
// features/leave-management/data/repositories/supabase-leave.repository.ts
// Supabase & RPC implementation of ILeaveRepository
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type {
  ILeaveRepository,
  CreateLeaveRequestInput,
  AdminReviewLeaveRequestInput,
  GetAdminLeaveRequestsFilter,
} from "../../domain/repositories/i-leave.repository";
import type {
  LeaveTypeEntity,
  LeavePolicyEntity,
  LeaveBalanceEntity,
  LeaveRequestEntity,
  LeaveDashboardEntity,
} from "../../domain/entities";
import {
  toLeaveTypeEntity,
  toLeavePolicyEntity,
  toLeaveBalanceEntity,
  toLeaveRequestEntity,
  toLeaveDashboardEntity,
} from "../mapper/leave.mapper";
import type {
  LeaveTypeDto,
  LeavePolicyDto,
  LeaveBalanceDto,
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

  /**
   * Admin: Get all leave requests across the company using admin_get_leave_requests() RPC
   * Strictly calls the secure RPC without fallback to direct table queries.
   */
  async adminGetLeaveRequests(filter?: GetAdminLeaveRequestsFilter): Promise<LeaveRequestEntity[]> {
    const { data: rpcData, error: rpcError } = await (this.supabase.rpc as CallableFunction)(
      "admin_get_leave_requests"
    );

    if (rpcError) {
      throw new Error(rpcError.message || "Failed to load admin leave requests via admin_get_leave_requests RPC.");
    }

    const rawList = (typeof rpcData === "string" ? JSON.parse(rpcData) : rpcData) || [];
    const dtos = (Array.isArray(rawList) ? rawList : []) as LeaveRequestDto[];
    let entities = dtos.map(toLeaveRequestEntity);

    // Apply client-side filters on the returned dataset
    if (filter) {
      if (filter.status && filter.status !== "all") {
        entities = entities.filter((r) => r.status === filter.status);
      }
      if (filter.leaveTypeId && filter.leaveTypeId !== "all") {
        entities = entities.filter((r) => r.leaveTypeId === filter.leaveTypeId);
      }
      if (filter.search && filter.search.trim()) {
        const q = filter.search.toLowerCase().trim();
        entities = entities.filter(
          (r) =>
            r.employee?.fullName.toLowerCase().includes(q) ||
            r.employee?.email.toLowerCase().includes(q) ||
            r.leaveType?.name.toLowerCase().includes(q) ||
            (r.note && r.note.toLowerCase().includes(q))
        );
      }
    }

    return entities;
  }

  /**
   * Admin: Review (Approve / Reject) a leave request via admin_review_leave_request() RPC
   */
  async adminReviewLeaveRequest(input: AdminReviewLeaveRequestInput): Promise<void> {
    const { error } = await (this.supabase.rpc as CallableFunction)(
      "admin_review_leave_request",
      {
        p_request_id: input.requestId,
        p_decision: input.decision,
        p_reviewer_note: input.reviewerNote || null,
      }
    );

    if (error) {
      throw new Error(error.message || `Failed to ${input.decision} leave request.`);
    }
  }

  /**
   * Admin: Get all leave balances
   */
  async adminGetLeaveBalances(): Promise<LeaveBalanceEntity[]> {
    const { data, error } = await (this.supabase.from("leave_balances" as any) as any)
      .select(`
        *,
        leave_types (*),
        employee_profiles (*)
      `)
      .order("period_end", { ascending: false });

    if (error) {
      throw new Error(error.message || "Failed to load leave balances.");
    }

    const dtos = (data || []) as LeaveBalanceDto[];
    return dtos.map(toLeaveBalanceEntity);
  }
}
