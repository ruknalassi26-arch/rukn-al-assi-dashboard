// ==============================================================================
// features/vacation/data/repositories/supabase-vacation.repository.ts
// Supabase Implementation of IVacationRepository
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type {
  IVacationRepository,
  CreateVacationRequestInput,
  AdminCreateVacationRequestInput,
} from "../../domain/repositories/i-vacation.repository";
import type {
  MyVacationDashboardEntity,
  VacationRequestEntity,
  VacationTypeEntity,
} from "../../domain/entities/vacation.entity";
import type { EmployeeProfileEntity } from "../../domain/entities/employee.entity";
import type {
  MyVacationDashboardDto,
  VacationRequestDto,
  VacationTypeDto,
} from "../dto/vacation.dto";
import type { EmployeeProfileDto } from "../dto/employee.dto";
import {
  toMyVacationDashboardEntity,
  toVacationRequestEntity,
  toVacationTypeEntity,
} from "../mapper/vacation.mapper";
import { toEmployeeProfileEntity } from "../mapper/employee.mapper";

export class SupabaseVacationRepository implements IVacationRepository {
  private get supabase() {
    return createClient();
  }

  async getMyVacationDashboard(): Promise<MyVacationDashboardEntity> {
    const { data, error } = await (this.supabase.rpc as CallableFunction)(
      "get_my_vacation_dashboard"
    );

    if (error) {
      throw new Error(error.message || "Failed to fetch employee vacation dashboard");
    }

    const parsed = (typeof data === "string" ? JSON.parse(data) : data) as MyVacationDashboardDto;
    return toMyVacationDashboardEntity(parsed);
  }

  async getActiveColleagues(): Promise<EmployeeProfileEntity[]> {
    const { data, error } = await (this.supabase.rpc as CallableFunction)(
      "get_active_employees"
    );

    if (error) {
      throw new Error(error.message || "Failed to load colleagues list");
    }

    const list = (typeof data === "string" ? JSON.parse(data) : data) as EmployeeProfileDto[];
    return (Array.isArray(list) ? list : []).map(toEmployeeProfileEntity);
  }

  async getVacationTypes(): Promise<VacationTypeEntity[]> {
    const { data, error } = await this.supabase
      .from("vacation_types")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      // Fallback: return default types
      return [
        toVacationTypeEntity({
          id: "vacation",
          code: "vacation",
          name: "Vacation",
          unit: "day",
          uses_balance: true,
          requires_approval: true,
          is_active: true,
          sort_order: 1,
        }),
        toVacationTypeEntity({
          id: "sick",
          code: "sick",
          name: "Sick Leave",
          unit: "day",
          uses_balance: false,
          requires_approval: true,
          is_active: true,
          sort_order: 2,
        }),
      ];
    }

    const list = data as unknown as VacationTypeDto[];
    return (Array.isArray(list) ? list : []).map(toVacationTypeEntity);
  }

  async createVacationRequest(
    input: CreateVacationRequestInput
  ): Promise<{ id: string; status: string; requestedDays: number }> {
    const { data, error } = await (this.supabase.rpc as CallableFunction)(
      "create_vacation_request",
      {
        p_vacation_type_id: input.vacationTypeId,
        p_from_date: input.fromDate,
        p_to_date: input.toDate,
        p_return_to_work_date: input.returnToWorkDate,
        p_alternative_employee_id: input.alternativeEmployeeId || null,
        p_note: input.note || null,
      }
    );

    if (error) {
      throw new Error(error.message || "Failed to submit vacation request");
    }

    const parsed = (typeof data === "string" ? JSON.parse(data) : data) as {
      id: string;
      status: string;
      requestedDays: number;
    };

    return {
      id: parsed.id,
      status: parsed.status,
      requestedDays: Number(parsed.requestedDays || 0),
    };
  }

  async cancelVacationRequest(requestId: string): Promise<void> {
    const { error } = await (this.supabase.rpc as CallableFunction)(
      "cancel_vacation_request",
      { p_request_id: requestId }
    );

    if (error) {
      throw new Error(error.message || "Failed to cancel vacation request");
    }
  }

  async adminGetVacationRequests(
    status?: string,
    employeeId?: string,
    search?: string,
    page?: number,
    pageSize?: number
  ): Promise<VacationRequestEntity[]> {
    const { data, error } = await (this.supabase.rpc as CallableFunction)(
      "admin_get_vacation_requests",
      {
        p_status: status && status !== "all" ? status : null,
        p_employee_id: employeeId || null,
        p_search: search && search.trim() !== "" ? search.trim() : null,
        p_page: page || 1,
        p_page_size: pageSize || 100,
      }
    );

    if (error) {
      throw new Error(error.message || "Failed to load vacation requests");
    }

    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    const rawList = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.items)
      ? parsed.items
      : [];

    return (rawList as VacationRequestDto[]).map(toVacationRequestEntity);
  }

  async adminReviewVacationRequest(
    requestId: string,
    decision: "approved" | "rejected",
    reviewerNote?: string
  ): Promise<void> {
    const { error } = await (this.supabase.rpc as CallableFunction)(
      "admin_review_vacation_request",
      {
        p_request_id: requestId,
        p_decision: decision,
        p_reviewer_note: reviewerNote || null,
      }
    );

    if (error) {
      throw new Error(error.message || `Failed to ${decision} vacation request`);
    }
  }

  async adminCreateVacationRequest(
    input: AdminCreateVacationRequestInput
  ): Promise<{ id: string; status: string }> {
    const { data, error } = await (this.supabase.rpc as CallableFunction)(
      "admin_create_vacation_request",
      {
        p_employee_id: input.employeeId,
        p_vacation_type_id: input.vacationTypeId,
        p_from_date: input.fromDate,
        p_to_date: input.toDate,
        p_return_to_work_date: input.returnToWorkDate,
        p_alternative_employee_id: input.alternativeEmployeeId || null,
        p_note: input.note || null,
      }
    );

    if (error) {
      throw new Error(error.message || "Failed to create vacation request for employee");
    }

    const parsed = (typeof data === "string" ? JSON.parse(data) : data) as {
      id: string;
      status: string;
    };

    return {
      id: parsed.id,
      status: parsed.status,
    };
  }
}
