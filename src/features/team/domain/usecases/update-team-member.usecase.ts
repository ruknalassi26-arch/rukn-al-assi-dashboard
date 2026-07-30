// ==============================================================================
// features/team/domain/usecases/update-team-member.usecase.ts
// ==============================================================================
import type { ITeamRepository, UpdateTeamMemberInput } from "../repositories/i-team.repository";
import type { TeamMemberEntity } from "../entities/team-member.entity";

export class UpdateTeamMemberUseCase {
  constructor(private readonly repository: ITeamRepository) {}

  async execute(input: UpdateTeamMemberInput): Promise<TeamMemberEntity> {
    return this.repository.updateTeamMember(input);
  }
}
