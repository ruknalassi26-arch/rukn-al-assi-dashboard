// ==============================================================================
// features/roles-permissions/domain/usecases/get-user-permissions.usecase.ts
// ==============================================================================
import type { IRolePermissionRepository } from "../repositories/i-role-permission.repository";
import type { RoleCode, PermissionCode } from "../entities/role.enums";

export class GetUserPermissionsUseCase {
  constructor(private readonly repository: IRolePermissionRepository) {}

  async execute(roleCode: RoleCode): Promise<PermissionCode[]> {
    return this.repository.getUserPermissions(roleCode);
  }
}
