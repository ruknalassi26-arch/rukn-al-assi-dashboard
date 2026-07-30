// ==============================================================================
// features/team/domain/usecases/get-team-members.usecase.ts
// ==============================================================================
import type { ITeamRepository, TeamFilterParams, PaginatedTeamMembers } from "../repositories/i-team.repository";

export class GetTeamMembersUseCase {
  constructor(private readonly repository: ITeamRepository) {}

  async execute(params?: TeamFilterParams): Promise<PaginatedTeamMembers> {
    return this.repository.getTeamMembers(params);
  }
}
