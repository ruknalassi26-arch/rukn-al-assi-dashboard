// ==============================================================================
// features/roles-permissions/domain/usecases/get-roles.usecase.ts
// ==============================================================================
import type { IRolePermissionRepository } from "../repositories/i-role-permission.repository";
import type { RoleEntity } from "../entities/role.entity";

export class GetRolesUseCase {
  constructor(private readonly repository: IRolePermissionRepository) {}

  async execute(): Promise<RoleEntity[]> {
    return this.repository.getRoles();
  }
}
