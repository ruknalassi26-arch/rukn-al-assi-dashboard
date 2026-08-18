// ==============================================================================
// features/vacation/domain/usecases/create-vacation-request.usecase.ts
// ==============================================================================

import type {
  IVacationRepository,
  CreateVacationRequestInput,
} from "../repositories/i-vacation.repository";

export class CreateVacationRequestUseCase {
  constructor(private readonly vacationRepo: IVacationRepository) {}

  async execute(
    input: CreateVacationRequestInput
  ): Promise<{ id: string; status: string; requestedDays: number }> {
    return this.vacationRepo.createVacationRequest(input);
  }
}
