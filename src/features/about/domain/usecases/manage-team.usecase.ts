// ==============================================================================
// features/about/domain/usecases/manage-team.usecase.ts
// Use cases for Management Team management
// ==============================================================================
import type { TeamMemberEntity, SectionStatus } from "../entities/about.entity";
import type { IAboutRepository, SaveTeamMemberInput } from "../repositories/i-about.repository";

export class GetTeamMembersUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<TeamMemberEntity[]> {
    return this.repo.getTeamMembers();
  }
}

export class CreateTeamMemberUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(input: SaveTeamMemberInput): Promise<TeamMemberEntity> {
    const result = await this.repo.createTeamMember(input);
    await this.repo.logActivity("created", "team_members", "Team Member Created");
    return result;
  }
}

export class UpdateTeamMemberUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string, input: SaveTeamMemberInput): Promise<TeamMemberEntity> {
    const result = await this.repo.updateTeamMember(id, input);
    await this.repo.logActivity("updated", "team_members", "Team Member Updated");
    return result;
  }
}

export class DeleteTeamMemberUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteTeamMember(id);
    await this.repo.logActivity("deleted", "team_members", "Team Member Deleted");
  }
}

export class ReorderTeamMembersUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderTeamMembers(orderedIds);
    await this.repo.logActivity("updated", "team_members", "Team Members Order Changed");
  }
}

export class BulkDeleteTeamMembersUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[]): Promise<void> {
    await this.repo.bulkDeleteTeamMembers(ids);
    await this.repo.logActivity("deleted", "team_members", `Bulk Delete ${ids.length} Team Members`);
  }
}

export class BulkUpdateTeamMembersStatusUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[], status: SectionStatus): Promise<void> {
    await this.repo.bulkUpdateTeamMembersStatus(ids, status);
    await this.repo.logActivity("updated", "team_members", `Bulk Status ${status} Team Members`);
  }
}
