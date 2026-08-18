// ==============================================================================
// features/vacation/data/repositories/supabase-employee.repository.ts
// Supabase Implementation of IEmployeeRepository with Paginated & Direct Support
// ==============================================================================

import { createClient } from "@core/lib/supabase/client";
import type { IEmployeeRepository } from "../../domain/repositories/i-employee.repository";
import type { EmployeeProfileEntity } from "../../domain/entities/employee.entity";
import type { EmployeeProfileDto } from "../dto/employee.dto";
import { toEmployeeProfileEntity } from "../mapper/employee.mapper";

export class SupabaseEmployeeRepository implements IEmployeeRepository {
  private get supabase() {
    return createClient();
  }

  async getCurrentEmployeeProfile(): Promise<EmployeeProfileEntity> {
    const { data, error } = await (this.supabase.rpc as CallableFunction)(
      "get_current_employee_profile"
    );

    if (error) {
      throw new Error(error.message || "Failed to load current employee profile");
    }

    const parsed = (typeof data === "string" ? JSON.parse(data) : data) as EmployeeProfileDto;
    return toEmployeeProfileEntity(parsed);
  }

  async adminGetEmployees(
    search?: string,
    page?: number,
    pageSize?: number
  ): Promise<EmployeeProfileEntity[]> {
    const { data, error } = await (this.supabase.rpc as CallableFunction)(
      "admin_get_employees",
      {
        p_search: search && search.trim() !== "" ? search.trim() : null,
        p_page: page || 1,
        p_page_size: pageSize || 100,
      }
    );

    if (error) {
      throw new Error(error.message || "Failed to load employees list");
    }

    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    const rawList = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.items)
      ? parsed.items
      : [];

    return (rawList as EmployeeProfileDto[]).map(toEmployeeProfileEntity);
  }
}
