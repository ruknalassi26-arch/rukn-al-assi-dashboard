// ==============================================================================
// features/projects/domain/usecases/get-project-by-id.usecase.ts
// ==============================================================================
import type { IProjectRepository } from "../repositories/i-project.repository";
import type { ProjectEntity } from "../entities/project.entity";

export class GetProjectByIdUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string): Promise<ProjectEntity | null> {
    return this.repository.getProjectById(id);
  }
}
