// ==============================================================================
// features/projects/domain/usecases/delete-project.usecase.ts
// ==============================================================================
import type { IProjectRepository } from "../repositories/i-project.repository";

export class DeleteProjectUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteProject(id);
  }
}
