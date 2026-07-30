// ==============================================================================
// features/team/domain/usecases/get-team-member-by-id.usecase.ts
// ==============================================================================
import type { ITeamRepository } from "../repositories/i-team.repository";
import type { TeamMemberEntity } from "../entities/team-member.entity";

export class GetTeamMemberByIdUseCase {
  constructor(private readonly repository: ITeamRepository) {}

  async execute(id: string): Promise<TeamMemberEntity | null> {
    return this.repository.getTeamMemberById(id);
  }
}
