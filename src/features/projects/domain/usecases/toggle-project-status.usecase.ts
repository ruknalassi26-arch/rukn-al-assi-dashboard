// ==============================================================================
// features/projects/domain/usecases/toggle-project-status.usecase.ts
// ==============================================================================
import type { IProjectRepository } from "../repositories/i-project.repository";
import type { ProjectEntity, ProjectStatus } from "../entities/project.entity";

export class ToggleProjectStatusUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string, status: ProjectStatus): Promise<ProjectEntity> {
    return this.repository.toggleProjectStatus(id, status);
  }
}
