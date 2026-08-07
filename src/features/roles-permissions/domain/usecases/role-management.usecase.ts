// ==============================================================================
// features/roles-permissions/domain/usecases/role-management.usecase.ts
// Role & Permission Management Domain Use Cases
// ==============================================================================

import type {
  IRoleRepository,
  GetRolesFilterParams,
  CreateRoleInput,
  UpdateRoleInput,
} from "../repositories/i-user-role-management.repository";

export class RoleManagementUseCases {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async getRoles(params?: GetRolesFilterParams) {
    return this.roleRepository.getRoles(params);
  }

  async getRoleById(id: string) {
    if (!id) throw new Error("Role ID is required");
    return this.roleRepository.getRoleById(id);
  }

  async getAllPermissions() {
    return this.roleRepository.getAllPermissions();
  }

  async createRole(input: CreateRoleInput) {
    if (!input.name?.trim()) {
      throw new Error("Role name is required");
    }
    return this.roleRepository.createRole(input);
  }

  async updateRole(id: string, input: UpdateRoleInput) {
    if (!id) throw new Error("Role ID is required");
    return this.roleRepository.updateRole(id, input);
  }

  async deleteRole(id: string) {
    if (!id) throw new Error("Role ID is required");
    return this.roleRepository.deleteRole(id);
  }
}
