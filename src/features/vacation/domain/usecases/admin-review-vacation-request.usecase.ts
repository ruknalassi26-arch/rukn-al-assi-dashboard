// ==============================================================================
// features/vacation/domain/usecases/admin-review-vacation-request.usecase.ts
// ==============================================================================

import type { IVacationRepository } from "../repositories/i-vacation.repository";

export class AdminReviewVacationRequestUseCase {
  constructor(private readonly vacationRepo: IVacationRepository) {}

  async execute(
    requestId: string,
    decision: "approved" | "rejected",
    reviewerNote?: string
  ): Promise<void> {
    return this.vacationRepo.adminReviewVacationRequest(
      requestId,
      decision,
      reviewerNote
    );
  }
}
