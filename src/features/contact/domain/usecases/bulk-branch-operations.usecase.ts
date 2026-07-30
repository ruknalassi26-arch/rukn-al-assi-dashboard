// ==============================================================================
// features/contact/domain/usecases/bulk-branch-operations.usecase.ts
// ==============================================================================
import type { IContactRepository } from "../repositories/i-contact.repository";
import type { BranchStatus } from "../entities/branch.entity";

export class BulkDeleteBranchesUseCase {
  constructor(private readonly repository: IContactRepository) {}

  async execute(ids: string[]): Promise<void> {
    return this.repository.bulkDeleteBranches(ids);
  }
}

export class BulkUpdateBranchStatusUseCase {
  constructor(private readonly repository: IContactRepository) {}

  async execute(ids: string[], status: BranchStatus): Promise<void> {
    return this.repository.bulkUpdateBranchStatus(ids, status);
  }
}
