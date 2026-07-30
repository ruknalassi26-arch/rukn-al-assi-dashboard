// ==============================================================================
// features/team/domain/usecases/delete-team-member.usecase.ts
// ==============================================================================
import type { ITeamRepository } from "../repositories/i-team.repository";

export class DeleteTeamMemberUseCase {
  constructor(private readonly repository: ITeamRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteTeamMember(id);
  }
}
