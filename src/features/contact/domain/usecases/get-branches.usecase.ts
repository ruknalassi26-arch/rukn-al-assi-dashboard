// ==============================================================================
// features/contact/domain/usecases/get-branches.usecase.ts
// ==============================================================================
import type { IContactRepository, BranchFilterParams, PaginatedBranches } from "../repositories/i-contact.repository";

export class GetBranchesUseCase {
  constructor(private readonly repository: IContactRepository) {}

  async execute(params?: BranchFilterParams): Promise<PaginatedBranches> {
    return this.repository.getBranches(params);
  }
}
