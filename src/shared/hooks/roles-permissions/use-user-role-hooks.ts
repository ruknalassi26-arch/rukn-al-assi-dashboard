// ==============================================================================
// shared/hooks/roles-permissions/use-user-role-hooks.ts
// React Query Hooks for Admin Users, Roles, and Permissions Management
// ==============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@core/utils/toast";
import { SupabaseUserRepository } from "@features/roles-permissions/data/repositories/supabase-user.repository";
import { SupabaseRoleRepository } from "@features/roles-permissions/data/repositories/supabase-role.repository";
import { UserManagementUseCases } from "@features/roles-permissions/domain/usecases/user-management.usecase";
import { RoleManagementUseCases } from "@features/roles-permissions/domain/usecases/role-management.usecase";
import type {
  GetUsersFilterParams,
  GetRolesFilterParams,
  CreateUserInput,
  UpdateUserInput,
  CreateRoleInput,
  UpdateRoleInput,
} from "@features/roles-permissions/domain/repositories/i-user-role-management.repository";

const userRepo = new SupabaseUserRepository();
const userUseCases = new UserManagementUseCases(userRepo);

const roleRepo = new SupabaseRoleRepository();
const roleUseCases = new RoleManagementUseCases(roleRepo);

export const USER_ROLE_QUERY_KEYS = {
  users: (params?: GetUsersFilterParams) => ["admin-users", params],
  userDetail: (id: string) => ["admin-user-detail", id],
  roles: (params?: GetRolesFilterParams) => ["admin-roles", params],
  roleDetail: (id: string) => ["admin-role-detail", id],
  allPermissions: () => ["admin-all-permissions"],
};

// --- User Hooks ---

export function useAdminUsers(params?: GetUsersFilterParams) {
  return useQuery({
    queryKey: USER_ROLE_QUERY_KEYS.users(params),
    queryFn: () => userUseCases.getUsers(params),
  });
}

export function useAdminUserById(id: string) {
  return useQuery({
    queryKey: USER_ROLE_QUERY_KEYS.userDetail(id),
    queryFn: () => userUseCases.getUserById(id),
    enabled: !!id,
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => userUseCases.createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User created successfully! Setup email triggered.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user.");
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      userUseCases.updateUser(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user.");
    },
  });
}

export function useToggleUserActiveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      userUseCases.setUserActiveStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(`User ${variables.isActive ? "activated" : "deactivated"}.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user status.");
    },
  });
}

// --- Role & Permission Hooks ---

export function useAdminRoles(params?: GetRolesFilterParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: USER_ROLE_QUERY_KEYS.roles(params),
    queryFn: () => roleUseCases.getRoles(params),
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}

export function useAdminRoleById(id: string) {
  return useQuery({
    queryKey: USER_ROLE_QUERY_KEYS.roleDetail(id),
    queryFn: () => roleUseCases.getRoleById(id),
    enabled: !!id,
  });
}

export function useAllPermissions() {
  return useQuery({
    queryKey: USER_ROLE_QUERY_KEYS.allPermissions(),
    queryFn: () => roleUseCases.getAllPermissions(),
  });
}

export function useCreateAdminRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRoleInput) => roleUseCases.createRole(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-role-detail"] });
      toast.success("Role created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create role.");
    },
  });
}

export function useUpdateAdminRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRoleInput }) =>
      roleUseCases.updateRole(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-role-detail"] });
      toast.success("Role updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update role.");
    },
  });
}

export function useDeleteAdminRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roleUseCases.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-role-detail"] });
      toast.success("Role deleted.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete role.");
    },
  });
}
