// ==============================================================================
// features/rfq/domain/usecases/delete-rfq.usecase.ts
// ==============================================================================
import type { IRfqRepository } from "../repositories/i-rfq.repository";

export class DeleteRfqUseCase {
  constructor(private readonly repository: IRfqRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteRfq(id);
  }
}
