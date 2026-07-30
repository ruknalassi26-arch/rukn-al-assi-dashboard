// ==============================================================================
// features/rfq/domain/usecases/get-rfq-by-id.usecase.ts
// ==============================================================================
import type { IRfqRepository } from "../repositories/i-rfq.repository";
import type { RfqRequestEntity } from "../entities/rfq-request.entity";

export class GetRfqByIdUseCase {
  constructor(private readonly repository: IRfqRepository) {}

  async execute(id: string): Promise<RfqRequestEntity | null> {
    return this.repository.getRfqById(id);
  }
}
