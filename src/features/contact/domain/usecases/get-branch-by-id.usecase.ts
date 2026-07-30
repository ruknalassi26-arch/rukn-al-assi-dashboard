// ==============================================================================
// features/contact/domain/usecases/get-branch-by-id.usecase.ts
// ==============================================================================
import type { IContactRepository } from "../repositories/i-contact.repository";
import type { BranchEntity } from "../entities/branch.entity";

export class GetBranchByIdUseCase {
  constructor(private readonly repository: IContactRepository) {}

  async execute(id: string): Promise<BranchEntity | null> {
    return this.repository.getBranchById(id);
  }
}
