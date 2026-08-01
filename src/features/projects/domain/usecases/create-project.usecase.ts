// ==============================================================================
// features/projects/domain/usecases/create-project.usecase.ts
// ==============================================================================
import type { IProjectRepository, CreateProjectInput } from "../repositories/i-project.repository";
import type { ProjectEntity } from "../entities/project.entity";

export class CreateProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<ProjectEntity> {
    return this.repository.createProject(input);
  }
}
