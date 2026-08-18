// ==============================================================================
// features/vacation/domain/usecases/cancel-vacation-request.usecase.ts
// ==============================================================================

import type { IVacationRepository } from "../repositories/i-vacation.repository";

export class CancelVacationRequestUseCase {
  constructor(private readonly vacationRepo: IVacationRepository) {}

  async execute(requestId: string): Promise<void> {
    return this.vacationRepo.cancelVacationRequest(requestId);
  }
}
