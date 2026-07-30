// ==============================================================================
// features/services/domain/usecases/toggle-feature-service.usecase.ts
// ==============================================================================
import type { IServiceRepository } from "../repositories/i-service.repository";
import type { ServiceEntity } from "../entities/service.entity";

export class ToggleFeatureServiceUseCase {
  constructor(private readonly repository: IServiceRepository) {}

  async execute(id: string, isFeatured: boolean): Promise<ServiceEntity> {
    return this.repository.toggleFeatureService(id, isFeatured);
  }
}
