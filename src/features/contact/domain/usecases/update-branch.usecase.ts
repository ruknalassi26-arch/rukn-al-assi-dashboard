// ==============================================================================
// features/contact/domain/usecases/update-branch.usecase.ts
// ==============================================================================
import type { IContactRepository, UpdateBranchInput } from "../repositories/i-contact.repository";
import type { BranchEntity } from "../entities/branch.entity";

export class UpdateBranchUseCase {
  constructor(private readonly repository: IContactRepository) {}

  async execute(input: UpdateBranchInput): Promise<BranchEntity> {
    return this.repository.updateBranch(input);
  }
}
