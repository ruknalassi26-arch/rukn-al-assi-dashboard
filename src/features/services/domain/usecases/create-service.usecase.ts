// ==============================================================================
// features/services/domain/usecases/create-service.usecase.ts
// ==============================================================================
import type { IServiceRepository, CreateServiceInput } from "../repositories/i-service.repository";
import type { ServiceEntity } from "../entities/service.entity";

export class CreateServiceUseCase {
  constructor(private readonly repository: IServiceRepository) {}

  async execute(input: CreateServiceInput): Promise<ServiceEntity> {
    return this.repository.createService(input);
  }
}
