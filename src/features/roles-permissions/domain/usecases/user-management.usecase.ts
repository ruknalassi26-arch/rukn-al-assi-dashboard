// ==============================================================================
// features/roles-permissions/domain/usecases/user-management.usecase.ts
// User Management Domain Use Cases (Encapsulates business rules & activity logging)
// ==============================================================================

import type {
  IUserRepository,
  GetUsersFilterParams,
  CreateUserInput,
  UpdateUserInput,
} from "../repositories/i-user-role-management.repository";

export class UserManagementUseCases {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUsers(params?: GetUsersFilterParams) {
    return this.userRepository.getUsers(params);
  }

  async getUserById(id: string) {
    if (!id) throw new Error("User ID is required");
    return this.userRepository.getUserById(id);
  }

  async createUser(input: CreateUserInput) {
    if (!input.fullName?.trim()) {
      throw new Error("Full name is required");
    }
    if (!input.email?.trim() || !input.email.includes("@")) {
      throw new Error("Valid email address is required");
    }
    if (!input.roleId) {
      throw new Error("Role selection is required");
    }
    return this.userRepository.createUser(input);
  }

  async updateUser(id: string, input: UpdateUserInput) {
    if (!id) throw new Error("User ID is required");
    return this.userRepository.updateUser(id, input);
  }

  async setUserActiveStatus(id: string, isActive: boolean) {
    if (!id) throw new Error("User ID is required");
    return this.userRepository.setUserActiveStatus(id, isActive);
  }
}
