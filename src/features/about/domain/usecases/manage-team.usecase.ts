// ==============================================================================
// features/about/domain/usecases/manage-team.usecase.ts
// Use cases for Management Team management
// ==============================================================================
import type { TeamMemberEntity } from "../entities/about.entity";
import type { IAboutRepository } from "../repositories/i-about.repository";

export class GetTeamMembersUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<TeamMemberEntity[]> {
    return this.repo.getTeamMembers();
  }
}

export class CreateTeamMemberUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(member: Omit<TeamMemberEntity, "id" | "createdAt" | "updatedAt">): Promise<TeamMemberEntity> {
    const result = await this.repo.createTeamMember(member);
    await this.repo.logActivity("created", "settings", `Team Member Created: ${member.fullNameEn}`);
    return result;
  }
}

export class UpdateTeamMemberUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string, member: Partial<TeamMemberEntity>): Promise<TeamMemberEntity> {
    const result = await this.repo.updateTeamMember(id, member);
    await this.repo.logActivity("updated", "settings", `Team Member Updated: ${member.fullNameEn ?? id}`);
    return result;
  }
}

export class DeleteTeamMemberUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteTeamMember(id);
    await this.repo.logActivity("deleted", "settings", "Team Member Deleted");
  }
}

export class ReorderTeamMembersUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderTeamMembers(orderedIds);
    await this.repo.logActivity("updated", "settings", "Team Members Order Changed");
  }
}

export class BulkDeleteTeamMembersUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[]): Promise<void> {
    await this.repo.bulkDeleteTeamMembers(ids);
    await this.repo.logActivity("deleted", "settings", `Bulk Deleted ${ids.length} Team Members`);
  }
}

export class BulkUpdateTeamMembersStatusUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[], status: "active" | "draft"): Promise<void> {
    await this.repo.bulkUpdateTeamMembersStatus(ids, status);
    await this.repo.logActivity("updated", "settings", `Bulk Updated ${ids.length} Team Members to ${status}`);
  }
}
