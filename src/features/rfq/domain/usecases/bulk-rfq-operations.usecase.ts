// ==============================================================================
// features/rfq/domain/usecases/bulk-rfq-operations.usecase.ts
// ==============================================================================
import type { IRfqRepository } from "../repositories/i-rfq.repository";
import type { RfqStatus } from "../entities/rfq-request.entity";

export class BulkDeleteRfqsUseCase {
  constructor(private readonly repository: IRfqRepository) {}

  async execute(ids: string[]): Promise<void> {
    return this.repository.bulkDeleteRfqs(ids);
  }
}

export class BulkUpdateRfqStatusUseCase {
  constructor(private readonly repository: IRfqRepository) {}

  async execute(ids: string[], status: RfqStatus): Promise<void> {
    return this.repository.bulkUpdateRfqStatus(ids, status);
  }
}
