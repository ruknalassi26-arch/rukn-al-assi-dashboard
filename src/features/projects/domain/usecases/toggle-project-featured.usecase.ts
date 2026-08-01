// ==============================================================================
// features/projects/domain/usecases/toggle-project-featured.usecase.ts
// ==============================================================================
import type { IProjectRepository } from "../repositories/i-project.repository";
import type { ProjectEntity } from "../entities/project.entity";

export class ToggleProjectFeaturedUseCase {
  constructor(private readonly repository: IProjectRepository) {}

  async execute(id: string, isFeatured: boolean): Promise<ProjectEntity> {
    return this.repository.toggleProjectFeatured(id, isFeatured);
  }
}
