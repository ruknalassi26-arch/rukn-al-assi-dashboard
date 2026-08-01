// ==============================================================================
// features/projects/domain/usecases/update-project.usecase.ts
// ==============================================================================
import type { IProjectRepository, UpdateProjectInput } from "../repositories/i-project.repository";
import type { ProjectEntity } from "../entities/project.entity";

export class UpdateProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(input: UpdateProjectInput): Promise<ProjectEntity> {
    return this.repository.updateProject(input);
  }
}
