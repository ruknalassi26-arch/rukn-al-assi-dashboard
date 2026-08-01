// ==============================================================================
// features/projects/domain/usecases/get-projects.usecase.ts
// ==============================================================================
import type { IProjectRepository, ProjectFilters, PaginatedProjects } from "../repositories/i-project.repository";

export class GetProjectsUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(filters: ProjectFilters = {}): Promise<PaginatedProjects> {
    return this.repository.getProjects(filters);
  }
}
