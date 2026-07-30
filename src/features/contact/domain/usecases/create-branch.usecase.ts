// ==============================================================================
// features/contact/domain/usecases/create-branch.usecase.ts
// ==============================================================================
import type { IContactRepository, CreateBranchInput } from "../repositories/i-contact.repository";
import type { BranchEntity } from "../entities/branch.entity";

export class CreateBranchUseCase {
  constructor(private readonly repository: IContactRepository) {}

  async execute(input: CreateBranchInput): Promise<BranchEntity> {
    return this.repository.createBranch(input);
  }
}
