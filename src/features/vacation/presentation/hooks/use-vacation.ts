// ==============================================================================
// features/vacation/presentation/hooks/use-vacation.ts
// React Query Hooks for Vacation & Leave Management (Employee & Admin)
// ==============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@core/utils/toast";
import { SupabaseVacationRepository } from "../../data/repositories/supabase-vacation.repository";
import { SupabaseEmployeeRepository } from "../../data/repositories/supabase-employee.repository";
import {
  GetMyVacationDashboardUseCase,
  GetActiveColleaguesUseCase,
  CreateVacationRequestUseCase,
  CancelVacationRequestUseCase,
  AdminGetVacationRequestsUseCase,
  AdminReviewVacationRequestUseCase,
  AdminCreateVacationRequestUseCase,
  AdminGetEmployeesUseCase,
  GetCurrentEmployeeProfileUseCase,
} from "../../domain/usecases";
import type {
  CreateVacationRequestInput,
  AdminCreateVacationRequestInput,
} from "../../domain/repositories/i-vacation.repository";

const vacationRepo = new SupabaseVacationRepository();
const employeeRepo = new SupabaseEmployeeRepository();

const getMyVacationDashboardUseCase = new GetMyVacationDashboardUseCase(vacationRepo);
const getActiveColleaguesUseCase = new GetActiveColleaguesUseCase(vacationRepo);
const createVacationRequestUseCase = new CreateVacationRequestUseCase(vacationRepo);
const cancelVacationRequestUseCase = new CancelVacationRequestUseCase(vacationRepo);
const adminGetVacationRequestsUseCase = new AdminGetVacationRequestsUseCase(vacationRepo);
const adminReviewVacationRequestUseCase = new AdminReviewVacationRequestUseCase(vacationRepo);
const adminCreateVacationRequestUseCase = new AdminCreateVacationRequestUseCase(vacationRepo);
const adminGetEmployeesUseCase = new AdminGetEmployeesUseCase(employeeRepo);
const getCurrentEmployeeProfileUseCase = new GetCurrentEmployeeProfileUseCase(employeeRepo);

export const VACATION_QUERY_KEYS = {
  myDashboard: () => ["my-vacation-dashboard"],
  activeColleagues: () => ["active-colleagues"],
  vacationTypes: () => ["vacation-types"],
  adminRequests: (status?: string, employeeId?: string) => [
    "admin-vacation-requests",
    status,
    employeeId,
  ],
  adminEmployees: (search?: string) => ["admin-employees", search],
  currentEmployeeProfile: () => ["current-employee-profile"],
};

// ==========================================
// Employee Hooks
// ==========================================

export function useMyVacationDashboard() {
  return useQuery({
    queryKey: VACATION_QUERY_KEYS.myDashboard(),
    queryFn: () => getMyVacationDashboardUseCase.execute(),
  });
}

export function useActiveColleagues() {
  return useQuery({
    queryKey: VACATION_QUERY_KEYS.activeColleagues(),
    queryFn: () => getActiveColleaguesUseCase.execute(),
  });
}

export function useVacationTypes() {
  return useQuery({
    queryKey: VACATION_QUERY_KEYS.vacationTypes(),
    queryFn: () => vacationRepo.getVacationTypes(),
  });
}

export function useCurrentEmployeeProfile() {
  return useQuery({
    queryKey: VACATION_QUERY_KEYS.currentEmployeeProfile(),
    queryFn: () => getCurrentEmployeeProfileUseCase.execute(),
  });
}

export function useCreateVacationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVacationRequestInput) =>
      createVacationRequestUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VACATION_QUERY_KEYS.myDashboard() });
      toast.success("Vacation request submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit vacation request");
    },
  });
}

export function useCancelVacationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) =>
      cancelVacationRequestUseCase.execute(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VACATION_QUERY_KEYS.myDashboard() });
      toast.success("Vacation request cancelled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel vacation request");
    },
  });
}

// ==========================================
// Admin Hooks
// ==========================================

export function useAdminVacationRequests(
  status?: string,
  employeeId?: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: VACATION_QUERY_KEYS.adminRequests(status, employeeId),
    queryFn: () => adminGetVacationRequestsUseCase.execute(status, employeeId),
    enabled,
  });
}

export function useAdminEmployees(search?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: VACATION_QUERY_KEYS.adminEmployees(search),
    queryFn: () => adminGetEmployeesUseCase.execute(search),
    enabled,
  });
}

export function useAdminReviewVacationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      decision,
      reviewerNote,
    }: {
      requestId: string;
      decision: "approved" | "rejected";
      reviewerNote?: string;
    }) =>
      adminReviewVacationRequestUseCase.execute(
        requestId,
        decision,
        reviewerNote
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-vacation-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-vacation-dashboard"] });
      toast.success(
        `Vacation request has been ${variables.decision === "approved" ? "approved" : "rejected"} successfully!`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to review vacation request");
    },
  });
}

export function useAdminCreateVacationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminCreateVacationRequestInput) =>
      adminCreateVacationRequestUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vacation-requests"] });
      toast.success("Vacation request created and approved for employee!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create vacation request");
    },
  });
}
