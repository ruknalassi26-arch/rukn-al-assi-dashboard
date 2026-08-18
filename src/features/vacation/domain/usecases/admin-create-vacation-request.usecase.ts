// ==============================================================================
// features/vacation/domain/usecases/admin-create-vacation-request.usecase.ts
// ==============================================================================

import type {
  IVacationRepository,
  AdminCreateVacationRequestInput,
} from "../repositories/i-vacation.repository";

export class AdminCreateVacationRequestUseCase {
  constructor(private readonly vacationRepo: IVacationRepository) {}

  async execute(
    input: AdminCreateVacationRequestInput
  ): Promise<{ id: string; status: string }> {
    return this.vacationRepo.adminCreateVacationRequest(input);
  }
}
