// ==============================================================================
// features/services/domain/usecases/update-service.usecase.ts
// ==============================================================================
import type { IServiceRepository, UpdateServiceInput } from "../repositories/i-service.repository";
import type { ServiceEntity } from "../entities/service.entity";

export class UpdateServiceUseCase {
  constructor(private readonly repository: IServiceRepository) {}

  async execute(input: UpdateServiceInput): Promise<ServiceEntity> {
    return this.repository.updateService(input);
  }
}
