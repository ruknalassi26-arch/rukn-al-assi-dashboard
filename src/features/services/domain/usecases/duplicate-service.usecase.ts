// ==============================================================================
// features/services/domain/usecases/duplicate-service.usecase.ts
// ==============================================================================
import type { IServiceRepository } from "../repositories/i-service.repository";
import type { ServiceEntity } from "../entities/service.entity";

export class DuplicateServiceUseCase {
  constructor(private readonly repository: IServiceRepository) {}

  async execute(id: string): Promise<ServiceEntity> {
    return this.repository.duplicateService(id);
  }
}
