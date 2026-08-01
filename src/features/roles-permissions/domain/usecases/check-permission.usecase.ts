// ==============================================================================
// features/roles-permissions/domain/usecases/check-permission.usecase.ts
// ==============================================================================
import type { IRolePermissionRepository } from "../repositories/i-role-permission.repository";
import type { RoleCode, PermissionCode } from "../entities/role.enums";

export class CheckPermissionUseCase {
  constructor(private readonly repository: IRolePermissionRepository) {}

  async execute(roleCode: RoleCode, permission: PermissionCode): Promise<boolean> {
    return this.repository.hasPermission(roleCode, permission);
  }
}
