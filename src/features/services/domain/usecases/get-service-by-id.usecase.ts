// ==============================================================================
// features/services/domain/usecases/get-service-by-id.usecase.ts
// ==============================================================================
import type { IServiceRepository } from "../repositories/i-service.repository";
import type { ServiceEntity } from "../entities/service.entity";

export class GetServiceByIdUseCase {
  constructor(private readonly repository: IServiceRepository) {}

  async execute(id: string): Promise<ServiceEntity | null> {
    return this.repository.getServiceById(id);
  }
}
