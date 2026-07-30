// ==============================================================================
// features/rfq/domain/usecases/update-rfq-status.usecase.ts
// ==============================================================================
import type { IRfqRepository } from "../repositories/i-rfq.repository";
import type { RfqRequestEntity, RfqStatus } from "../entities/rfq-request.entity";

export class UpdateRfqStatusUseCase {
  constructor(private readonly repository: IRfqRepository) {}

  async execute(id: string, status: RfqStatus, notes?: string): Promise<RfqRequestEntity> {
    return this.repository.updateRfqStatus(id, status, notes);
  }
}
