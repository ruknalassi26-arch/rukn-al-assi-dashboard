// ==============================================================================
// features/projects/domain/usecases/bulk-delete-projects.usecase.ts
// ==============================================================================
import type { IProjectRepository } from "../repositories/i-project.repository";

export class BulkDeleteProjectsUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(ids: string[]): Promise<void> {
    return this.repository.bulkDeleteProjects(ids);
  }
}
