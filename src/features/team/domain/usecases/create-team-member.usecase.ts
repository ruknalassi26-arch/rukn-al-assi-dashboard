// ==============================================================================
// features/team/domain/usecases/create-team-member.usecase.ts
// ==============================================================================
import type { ITeamRepository, CreateTeamMemberInput } from "../repositories/i-team.repository";
import type { TeamMemberEntity } from "../entities/team-member.entity";

export class CreateTeamMemberUseCase {
  constructor(private readonly repository: ITeamRepository) {}

  async execute(input: CreateTeamMemberInput): Promise<TeamMemberEntity> {
    return this.repository.createTeamMember(input);
  }
}
