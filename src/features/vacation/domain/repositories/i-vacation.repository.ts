// ==============================================================================
// features/vacation/domain/repositories/i-vacation.repository.ts
// Interface for Vacation Domain Repository
// ==============================================================================

import type {
  MyVacationDashboardEntity,
  VacationRequestEntity,
  VacationTypeEntity,
} from "../entities/vacation.entity";
import type { EmployeeProfileEntity } from "../entities/employee.entity";

export interface CreateVacationRequestInput {
  vacationTypeId: string;
  fromDate: string;
  toDate: string;
  returnToWorkDate: string;
  alternativeEmployeeId?: string | null;
  note?: string | null;
}

export interface AdminCreateVacationRequestInput {
  employeeId: string;
  vacationTypeId: string;
  fromDate: string;
  toDate: string;
  returnToWorkDate: string;
  alternativeEmployeeId?: string | null;
  note?: string | null;
}

export interface IVacationRepository {
  getMyVacationDashboard(): Promise<MyVacationDashboardEntity>;
  getActiveColleagues(): Promise<EmployeeProfileEntity[]>;
  getVacationTypes(): Promise<VacationTypeEntity[]>;
  createVacationRequest(
    input: CreateVacationRequestInput
  ): Promise<{ id: string; status: string; requestedDays: number }>;
  cancelVacationRequest(requestId: string): Promise<void>;
  adminGetVacationRequests(
    status?: string,
    employeeId?: string
  ): Promise<VacationRequestEntity[]>;
  adminReviewVacationRequest(
    requestId: string,
    decision: "approved" | "rejected",
    reviewerNote?: string
  ): Promise<void>;
  adminCreateVacationRequest(
    input: AdminCreateVacationRequestInput
  ): Promise<{ id: string; status: string }>;
}
