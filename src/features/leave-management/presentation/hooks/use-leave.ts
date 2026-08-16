// ==============================================================================
// features/leave-management/presentation/hooks/use-leave.ts
// React Query Hooks for Leave Management (Employee & Admin)
// ==============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@core/utils/toast";
import { SupabaseLeaveRepository } from "../../data/repositories/supabase-leave.repository";
import { SupabaseEmployeeRepository } from "../../data/repositories/supabase-employee.repository";
import type {
  CreateLeaveRequestInput,
  AdminReviewLeaveRequestInput,
  GetAdminLeaveRequestsFilter,
} from "../../domain/repositories/i-leave.repository";

const leaveRepo = new SupabaseLeaveRepository();
const employeeRepo = new SupabaseEmployeeRepository();

export const LEAVE_QUERY_KEYS = {
  dashboard: () => ["leave-dashboard"],
  history: () => ["leave-history"],
  types: () => ["leave-types"],
  policies: () => ["leave-policies"],
  activeEmployees: () => ["active-employees"],
  currentEmployeeId: () => ["current-employee-id"],
  adminRequests: (filter?: GetAdminLeaveRequestsFilter) => ["admin-leave-requests", filter],
  adminBalances: () => ["admin-leave-balances"],
};

// --- Employee Hooks ---

/**
 * Fetch employee leave dashboard summary, balances & recent requests
 */
export function useMyLeaveDashboard() {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.dashboard(),
    queryFn: () => leaveRepo.getMyLeaveDashboard(),
    staleTime: 1000 * 60, // 1 min cache
  });
}

/**
 * Fetch all leave requests history for the current employee
 */
export function useMyLeaveHistory() {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.history(),
    queryFn: () => leaveRepo.getMyLeaveHistory(),
    staleTime: 1000 * 60,
  });
}

/**
 * Fetch all active leave types (cached for 5 minutes)
 */
export function useActiveLeaveTypes() {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.types(),
    queryFn: () => leaveRepo.getActiveLeaveTypes(),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch all active leave policies (cached for 5 minutes)
 */
export function useActiveLeavePolicies() {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.policies(),
    queryFn: () => leaveRepo.getActiveLeavePolicies(),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch active employees list for alternative employee selection (cached for 5 minutes)
 */
export function useActiveEmployees() {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.activeEmployees(),
    queryFn: () => employeeRepo.getActiveEmployees(),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch current authenticated employee ID
 */
export function useCurrentEmployeeId() {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.currentEmployeeId(),
    queryFn: () => employeeRepo.getCurrentEmployeeId(),
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Submit a new leave request
 */
export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLeaveRequestInput) => leaveRepo.createLeaveRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.history() });
      queryClient.invalidateQueries({ queryKey: ["admin-leave-requests"] });
      toast.success("Leave request submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit leave request.");
    },
  });
}

/**
 * Cancel a pending leave request
 */
export function useCancelMyLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => leaveRepo.cancelMyLeaveRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.history() });
      queryClient.invalidateQueries({ queryKey: ["admin-leave-requests"] });
      toast.success("Leave request cancelled successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel leave request.");
    },
  });
}

// --- Admin Hooks ---

/**
 * Admin: Fetch all company leave requests with filter support
 */
export function useAdminLeaveRequests(filter?: GetAdminLeaveRequestsFilter) {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.adminRequests(filter),
    queryFn: () => leaveRepo.adminGetLeaveRequests(filter),
  });
}

/**
 * Admin: Review (approve or reject) a leave request
 */
export function useAdminReviewLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AdminReviewLeaveRequestInput) => leaveRepo.adminReviewLeaveRequest(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-leave-requests"] });
      queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: LEAVE_QUERY_KEYS.history() });
      toast.success(`Leave request ${variables.decision} successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to review leave request.");
    },
  });
}

/**
 * Admin: Fetch all employee leave balances
 */
export function useAdminLeaveBalances() {
  return useQuery({
    queryKey: LEAVE_QUERY_KEYS.adminBalances(),
    queryFn: () => leaveRepo.adminGetLeaveBalances(),
    staleTime: 1000 * 60 * 2,
  });
}
