// ==============================================================================
// features/rfq/domain/usecases/get-rfqs.usecase.ts
// ==============================================================================
import type { IRfqRepository, RfqFilterParams, PaginatedRfqRequests } from "../repositories/i-rfq.repository";

export class GetRfqsUseCase {
  constructor(private readonly repository: IRfqRepository) {}

  async execute(params?: RfqFilterParams): Promise<PaginatedRfqRequests> {
    return this.repository.getRfqs(params);
  }
}
