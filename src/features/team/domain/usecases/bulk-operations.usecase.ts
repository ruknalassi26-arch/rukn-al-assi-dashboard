// ==============================================================================
// features/team/domain/usecases/bulk-operations.usecase.ts
// ==============================================================================
import type { ITeamRepository } from "../repositories/i-team.repository";
import type { TeamMemberStatus } from "../entities/team-member.entity";

export class BulkDeleteTeamMembersUseCase {
  constructor(private readonly repository: ITeamRepository) {}

  async execute(ids: string[]): Promise<void> {
    return this.repository.bulkDeleteTeamMembers(ids);
  }
}

export class BulkUpdateTeamMemberStatusUseCase {
  constructor(private readonly repository: ITeamRepository) {}

  async execute(ids: string[], status: TeamMemberStatus): Promise<void> {
    return this.repository.bulkUpdateTeamMemberStatus(ids, status);
  }
}
