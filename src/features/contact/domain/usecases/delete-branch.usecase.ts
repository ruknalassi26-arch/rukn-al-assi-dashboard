// ==============================================================================
// features/contact/domain/usecases/delete-branch.usecase.ts
// ==============================================================================
import type { IContactRepository } from "../repositories/i-contact.repository";

export class DeleteBranchUseCase {
  constructor(private readonly repository: IContactRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteBranch(id);
  }
}
